import argparse
import hashlib
import json
from pathlib import Path
import zipfile

parser = argparse.ArgumentParser(description="Package Tethered integration previews without app source or credentials")
parser.add_argument("destination", type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parent
args.destination.mkdir(parents=True, exist_ok=True)
outputs = []
for platform in ("codex", "claude-code", "cursor", "gemini-cli", "antigravity"):
    folder = root / platform
    manifest_path = {"codex": ".codex-plugin/plugin.json", "cursor": ".cursor-plugin/plugin.json", "claude-code": ".claude-plugin/plugin.json", "gemini-cli": "gemini-extension.json", "antigravity": "plugin.json"}[platform]
    version = json.loads((folder / manifest_path).read_text()).get("version", "0.2.0")
    output = args.destination / f"tethered-{platform}-{version}.zip"
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(folder.rglob("*")):
            if path.is_file():
                archive.write(path, (Path("tethered") / path.relative_to(folder)).as_posix())
    outputs.append(output)
package = json.loads((root / "vscode/package.json").read_text())
version = package["version"]
output = args.destination / f"tethered-vscode-{version}.vsix"
manifest = f'''<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011"><Metadata><Identity Language="en-US" Id="tethered" Version="{version}" Publisher="{package['publisher']}"/><DisplayName>Tethered Task Sessions</DisplayName><Description xml:space="preserve">Temporary Tethered task profiles</Description><Properties><Property Id="Microsoft.VisualStudio.Code.Engine" Value="{package['engines']['vscode']}"/></Properties></Metadata><Installation><InstallationTarget Id="Microsoft.VisualStudio.Code"/></Installation><Dependencies/><Assets><Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true"/></Assets></PackageManifest>'''
content_types = '''<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="png" ContentType="image/png"/><Default Extension="json" ContentType="application/json"/><Default Extension="js" ContentType="application/javascript"/><Default Extension="md" ContentType="text/markdown"/><Default Extension="vsixmanifest" ContentType="text/xml"/></Types>'''
with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
    archive.writestr("extension.vsixmanifest", manifest)
    archive.writestr("[Content_Types].xml", content_types)
    for path in sorted((root / "vscode").rglob("*")):
        if path.is_file():
            archive.write(path, f"extension/{path.relative_to(root / 'vscode').as_posix()}")
outputs.append(output)
for output in outputs:
    with zipfile.ZipFile(output) as archive:
        if archive.testzip() is not None:
            raise RuntimeError(f"Corrupt archive: {output}")
checksums = "".join(f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n" for path in outputs)
(args.destination / "SHA256SUMS.txt").write_text(checksums)
for output in outputs:
    print(output)
