<picture>
  <source media="(prefers-color-scheme: dark)" srcset="SocialPreviewDark.png">
  <source media="(prefers-color-scheme: light)" srcset="SocialPreview.png">
  <img alt="Tethered" src="SocialPreview.png">
</picture>
Tethered App, macOS and IOS Support.

## Sparkle update overviews

The release notes shown in Sparkle's update dialog come from the `<description>` inside each release's `<item>` in `appcast.xml`. Write the release body in GitHub's Release editor in English. When a release is published or edited, the Sync Sparkle release notes workflow renders that body as HTML, removes images, the repeated release title, and the standard manual installer and ZIP instructions, then translates the remaining notes with Google Cloud Translation. It embeds English and the app's Arabic, German, Spanish, French, Italian, Japanese, Korean, Brazilian Portuguese, Russian, Ukrainian, and Simplified Chinese localizations in the matching appcast item. Existing translations are reused when the English body has not changed. If no other notes remain, it removes the item's descriptions. The workflow can also be run manually with the release tag.

The translation project is `tethered-release-notes`. Enable the Cloud Translation API and create an API key restricted to that API in Google Cloud Console. Save the key as the repository Actions secret `GOOGLE_TRANSLATE_API_KEY`; never put it in the repository. A release with substantive notes fails to sync if the key is missing or translation fails, leaving the existing appcast intact. Google Cloud billing is required for this API and usage beyond the free allowance can incur charges.

Create the appcast item and its signed update archive before publishing the release. The workflow matches the release tag in the enclosure URL and fails if no matching item exists. It does not change the archive URL, length, version, or EdDSA signature. The channel's `<description>` is feed metadata, not the update overview.
