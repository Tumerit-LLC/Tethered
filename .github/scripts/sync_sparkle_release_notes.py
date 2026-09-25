import json
import html
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path


APPCAST = Path("appcast.xml")


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


def update_appcast(source, tag, rendered_html):
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

    escaped_html = rendered_html.strip().replace("]]>", "]]]]><![CDATA[>")
    indented_html = "\n".join("        " + line for line in escaped_html.splitlines())
    description = (
        f"      <description><![CDATA[\n{indented_html}\n      ]]></description>\n"
        if escaped_html else ""
    )
    match = item_matches[matching_indexes[0]]
    old_item = match.group()
    new_item, count = re.subn(
        r"(?s)      <description\b[^>]*>.*?</description>\n",
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
    updated = update_appcast(source, tag, filter_release_html(rendered_html, release["name"]))
    if updated != source:
        APPCAST.write_text(updated, encoding="utf-8")


if __name__ == "__main__":
    main()
