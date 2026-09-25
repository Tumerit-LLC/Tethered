import json
import html
import os
import re
import sys
import textwrap
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path


APPCAST = Path("appcast.xml")
LANGUAGES = {
    "ar": "ar",
    "de": "de",
    "es": "es",
    "fr": "fr",
    "it": "it",
    "ja": "ja",
    "ko": "ko",
    "pt-BR": "pt",
    "ru": "ru",
    "uk": "uk",
    "zh-Hans": "zh-CN",
}
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"


def github_request(path, token, payload=None, accept="application/vnd.github+json"):
    url = f"https://api.github.com{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = urllib.request.Request(
        url,
        data=data,
        headers={
            "Accept": accept,
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "tethered-sparkle-release-notes",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def element_text(fragment):
    extractor = TextExtractor()
    extractor.feed(fragment)
    return " ".join(html.unescape("".join(extractor.parts)).split())


def filter_release_html(rendered_html, title):
    filtered = re.sub(r"(?is)<picture\b[^>]*>.*?</picture>", "", rendered_html)
    filtered = re.sub(r"(?is)<a\b[^>]*>\s*<img\b[^>]*>\s*</a>", "", filtered)
    filtered = re.sub(r"(?is)<img\b[^>]*>", "", filtered)

    def keep_paragraph(match):
        text = element_text(match.group())
        if re.fullmatch(r"Download Tethered-[^\s]+\.pkg package to install Tethered\.", text):
            return ""
        if re.fullmatch(
            r"ZIP files are used by Tethered['’]s built-in updater; they are not needed for a manual installation\.",
            text,
        ):
            return ""
        return match.group() if text else ""

    filtered = re.sub(r"(?is)<p\b[^>]*>.*?</p>", keep_paragraph, filtered)
    filtered = re.sub(
        r"(?is)<h[1-6]\b[^>]*>.*?</h[1-6]>",
        lambda match: "" if element_text(match.group()) == title else match.group(),
        filtered,
    )
    return "\n".join(line for line in filtered.splitlines() if line.strip()).strip()


def translate_html(rendered_html, target, api_key):
    request = urllib.request.Request(
        "https://translation.googleapis.com/language/translate/v2",
        data=json.dumps({"q": rendered_html, "source": "en", "target": target, "format": "html"}).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        result = json.load(response)
    translated = result["data"]["translations"][0]["translatedText"].strip()
    if not translated:
        raise ValueError(f"Empty Cloud Translation result for {target}")
    return html.unescape(translated)


def update_appcast(source, tag, rendered_html, api_key=None, translator=translate_html):
    root = ET.fromstring(source)
    parsed_items = root.findall("./channel/item")
    item_matches = list(re.finditer(r"(?ms)^    <item>.*?^    </item>", source))
    if len(parsed_items) != len(item_matches):
        raise ValueError("Cannot safely locate every appcast item")

    matching_indexes = []
    for index, item in enumerate(parsed_items):
        enclosure = item.find("enclosure")
        if enclosure is None:
            continue
        path = urllib.parse.urlsplit(enclosure.get("url", "")).path
        if f"/releases/download/{tag}/" in path:
            matching_indexes.append(index)
    if len(matching_indexes) != 1:
        raise ValueError(f"Expected one appcast item for {tag}, found {len(matching_indexes)}")

    match = item_matches[matching_indexes[0]]
    old_item = match.group()
    existing = {}
    for element in parsed_items[matching_indexes[0]].findall("description"):
        language = element.get(XML_LANG, "en")
        existing[language] = textwrap.dedent((element.text or "").strip())

    rendered_html = rendered_html.strip()
    notes = {}
    if rendered_html:
        notes["en"] = rendered_html
        if existing.get("en") == rendered_html:
            notes.update({language: existing[language] for language in LANGUAGES if existing.get(language)})
        missing = [language for language in LANGUAGES if language not in notes]
        if missing and not api_key:
            raise ValueError("GOOGLE_TRANSLATE_API_KEY is required for localized release notes")
        for language in missing:
            notes[language] = translator(rendered_html, LANGUAGES[language], api_key)

    description = ""
    for language in ("en", *LANGUAGES):
        if language not in notes:
            continue
        escaped_html = notes[language].replace("]]>", "]]]]><![CDATA[>")
        indented_html = "\n".join("        " + line for line in escaped_html.splitlines())
        description += f'      <description xml:lang="{language}"><![CDATA[\n{indented_html}\n      ]]></description>\n'

    new_item, count = re.subn(
        r"(?s)(?:      <description\b[^>]*>.*?</description>\n)+",
        lambda _: description,
        old_item,
        count=1,
    )
    if count == 0 and description:
        new_item, count = re.subn(
            r"(?m)^      <enclosure ",
            lambda _: description + "      <enclosure ",
            old_item,
            count=1,
        )
        if count != 1:
            raise ValueError("Cannot find update enclosure")

    updated = source[: match.start()] + new_item + source[match.end() :]
    ET.fromstring(updated)
    return updated


def main():
    tag = sys.argv[1]
    repository = os.environ["GITHUB_REPOSITORY"]
    token = os.environ["GH_TOKEN"]
    encoded_tag = urllib.parse.quote(tag, safe="")
    release = json.loads(github_request(f"/repos/{repository}/releases/tags/{encoded_tag}", token))
    if release["tag_name"] != tag or release["draft"] or not release.get("body", "").strip():
        raise ValueError("Release must be published and have a nonempty body")

    rendered_html = github_request(
        "/markdown",
        token,
        payload={"text": release["body"], "mode": "gfm", "context": repository},
        accept="text/html",
    )
    if not rendered_html.strip():
        raise ValueError("GitHub returned empty release notes HTML")

    source = APPCAST.read_text(encoding="utf-8")
    updated = update_appcast(
        source,
        tag,
        filter_release_html(rendered_html, release["name"]),
        os.environ.get("GOOGLE_TRANSLATE_API_KEY"),
    )
    if updated != source:
        APPCAST.write_text(updated, encoding="utf-8")


if __name__ == "__main__":
    main()
