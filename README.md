<picture>
  <source media="(prefers-color-scheme: dark)" srcset="SocialPreviewDark.png">
  <source media="(prefers-color-scheme: light)" srcset="SocialPreview.png">
  <img alt="Tethered" src="SocialPreview.png">
</picture>
Tethered App, macOS and IOS Support.

## Sparkle update overviews

The release notes shown in Sparkle's update dialog come from the `<description>` inside each release's `<item>` in `appcast.xml`. Add the version's verified changes there before publishing a new update. Keep the `sparkle:version`, archive URL, length, and EdDSA signature matched to the released archive. The channel's `<description>` is feed metadata, not the update overview.
