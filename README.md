<picture>
  <source media="(prefers-color-scheme: dark)" srcset="SocialPreviewDark.png">
  <source media="(prefers-color-scheme: light)" srcset="SocialPreview.png">
  <img alt="Tethered" src="SocialPreview.png">
</picture>
Tethered App, macOS and IOS Support.

## Sparkle update overviews

The release notes shown in Sparkle's update dialog come from the `<description>` inside each release's `<item>` in `appcast.xml`. Write the release body in GitHub's Release editor. When a release is published or edited, the Sync Sparkle release notes workflow renders that body as HTML and copies it into the matching appcast item. The workflow can also be run manually with the release tag.

Create the appcast item and its signed update archive before publishing the release. The workflow matches the release tag in the enclosure URL and fails if no matching item exists. It does not change the archive URL, length, version, or EdDSA signature. The channel's `<description>` is feed metadata, not the update overview.
