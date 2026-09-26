import base64
import hashlib
import json
import os
import plistlib
import re
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from datetime import datetime
from email.utils import format_datetime
from pathlib import Path
from xml.sax.saxutils import escape


APPCAST = Path("appcast.xml")
PUBLIC_KEY = "+JshUjjBctdtO8PDO+nL5riaJv17K9E3LaKcRV+NSKU="
FEED_URL = "https://raw.githubusercontent.com/Tumerit/Tethered/main/appcast.xml"
BUNDLE_ID = "com.Tumerit.Tethered"
SPARKLE = "{http://www.andymatuschak.org/xml-namespaces/sparkle}"


def request(url, token):
    headers = {"Authorization": f"Bearer {token}", "User-Agent": "tethered-sparkle-appcast", "Accept": "application/vnd.github+json"}
    return urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=60)


def download(asset, token, destination):
    with request(asset["browser_download_url"], token) as response, destination.open("wb") as output:
        while chunk := response.read(1024 * 1024):
            output.write(chunk)
    if destination.stat().st_size != asset["size"]:
        raise ValueError(f"Size mismatch for {asset['name']}")
    digest = asset.get("digest")
    if digest:
        actual = "sha256:" + hashlib.sha256(destination.read_bytes()).hexdigest()
        if actual != digest:
            raise ValueError(f"Digest mismatch for {asset['name']}")


def one_asset(assets, name):
    matches = [asset for asset in assets if asset["name"] == name]
    if len(matches) != 1:
        raise ValueError(f"Expected one release asset named {name}, found {len(matches)}")
    return matches[0]


def bundle_info(archive):
    with zipfile.ZipFile(archive) as zipped:
        matches = [name for name in zipped.namelist() if name == "Tethered.app/Contents/Info.plist"]
        if len(matches) != 1:
            raise ValueError("Expected Tethered.app/Contents/Info.plist in the Sparkle ZIP")
        return plistlib.loads(zipped.read(matches[0]))


def prepare(tag, repository, token):
    if not re.fullmatch(r"v[0-9]+\.[0-9]+\.[0-9]+", tag):
        raise ValueError("Expected a semantic release tag such as v0.9.3")
    encoded_tag = urllib.parse.quote(tag, safe="")
    with request(f"https://api.github.com/repos/{repository}/releases/tags/{encoded_tag}", token) as response:
        release = json.load(response)
    if release["draft"] or release["tag_name"] != tag:
        raise ValueError("Expected a published release with the requested tag")

    version = tag[1:]
    archive_name = f"Tethered-{version}.Sparkle.zip"
    archive_asset = one_asset(release["assets"], archive_name)
    signature_asset = one_asset(release["assets"], archive_name + ".edSignature")

    with tempfile.TemporaryDirectory() as directory:
        archive = Path(directory) / archive_name
        sidecar = Path(directory) / signature_asset["name"]
        download(archive_asset, token, archive)
        download(signature_asset, token, sidecar)
        signature = sidecar.read_text(encoding="ascii").strip()
        if len(base64.b64decode(signature, validate=True)) != 64:
            raise ValueError("The Sparkle signature asset is not a valid Ed25519 signature")
        info = bundle_info(archive)
        expected = {"CFBundleShortVersionString": version, "CFBundleIdentifier": BUNDLE_ID, "SUPublicEDKey": PUBLIC_KEY, "SUFeedURL": FEED_URL}
        for key, value in expected.items():
            if info.get(key) != value:
                raise ValueError(f"Unexpected {key} in Sparkle ZIP")
        build = str(info.get("CFBundleVersion", ""))
        if not build.isdecimal():
            raise ValueError("Expected a numeric CFBundleVersion")
        subprocess.run(["swift", ".github/scripts/verify_sparkle_signature.swift", PUBLIC_KEY, signature, str(archive)], check=True)

    source = APPCAST.read_text(encoding="utf-8")
    root = ET.fromstring(source)
    items = root.findall("./channel/item")
    matching = []
    for item in items:
        enclosure = item.find("enclosure")
        if enclosure is not None and f"/releases/download/{tag}/" in urllib.parse.urlsplit(enclosure.get("url", "")).path:
            matching.append(item)
    if matching:
        if len(matching) != 1:
            raise ValueError("Multiple appcast items match the release tag")
        item = matching[0]
        enclosure = item.find("enclosure")
        if item.findtext(SPARKLE + "version") != build or enclosure.get(SPARKLE + "edSignature") != signature or enclosure.get("length") != str(archive_asset["size"]) or enclosure.get("url") != archive_asset["browser_download_url"]:
            raise ValueError("Existing appcast item does not match the release archive")
        return

    existing_builds = [int(item.findtext(SPARKLE + "version")) for item in items]
    if existing_builds and int(build) <= max(existing_builds):
        raise ValueError("The release build must be newer than existing appcast items")
    published = datetime.fromisoformat(release["published_at"].replace("Z", "+00:00"))
    url = escape(archive_asset["browser_download_url"], {'"': '&quot;'})
    new_item = (
        "    <item>\n"
        f"      <title>Tethered {version}</title>\n"
        f"      <pubDate>{format_datetime(published)}</pubDate>\n"
        f"      <sparkle:version>{build}</sparkle:version>\n"
        f"      <sparkle:shortVersionString>{version}</sparkle:shortVersionString>\n"
        f"      <enclosure url=\"{url}\" length=\"{archive_asset['size']}\" type=\"application/octet-stream\" sparkle:edSignature=\"{signature}\" />\n"
        "    </item>\n"
    )
    channel_description = "    <description>Official updates for Tethered.</description>\n"
    if source.count(channel_description) != 1:
        raise ValueError("Cannot locate the appcast channel description")
    updated = source.replace(channel_description, channel_description + new_item, 1)
    ET.fromstring(updated)
    APPCAST.write_text(updated, encoding="utf-8")


if __name__ == "__main__":
    prepare(sys.argv[1], os.environ["GITHUB_REPOSITORY"], os.environ["GH_TOKEN"])
