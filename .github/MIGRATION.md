# GitHub organization migration

The public repositories moved from `Tumerit` to `Tumerit-LLC` on October 20, 2026.

## Canonical locations

- Repository: https://github.com/Tumerit-LLC/Tethered
- Releases: https://github.com/Tumerit-LLC/Tethered/releases
- Issues: https://github.com/Tumerit-LLC/Tethered/issues
- License: https://github.com/Tumerit-LLC/Tethered/blob/main/LICENSE
- Security policy: https://github.com/Tumerit-LLC/Tethered/blob/main/SECURITY.md
- Update feed: https://raw.githubusercontent.com/Tumerit-LLC/Tethered/main/appcast.xml
- Homebrew tap: https://github.com/Tumerit-LLC/homebrew-tap
- Install: `brew install --cask Tumerit-LLC/tap/tethered`

## Existing installations and releases

Released apps still embed the original update-feed URL. Both original and new
feed URLs returned HTTP 200 during the migration. The release verifier accepts
both exact URLs; future app builds use the new URL. Keep GitHub redirects intact:
do not recreate the repositories at their old locations. Do not rewrite signed
app archives or replace signatures merely to change links.

Users who already have the old Homebrew tap can update its remote without
uninstalling the app:

```sh
git -C "$(brew --repository Tumerit/tap)" remote set-url origin https://github.com/Tumerit-LLC/homebrew-tap.git
brew update
```

New installations should use the new tap name above. Existing installations do
not require this manual step while GitHub redirects remain available.

## Listing audit: October 20, 2026

| Surface | Verified result |
| --- | --- |
| Public repository and Homebrew | Canonical links and remotes updated and pushed. Homebrew updater succeeded after migration. |
| Smithery `tumerit/tethered` | Repository updated to `https://github.com/Tumerit-LLC/Tethered`; verified in public listing. Existing Smithery identity retained. |
| Official MCP Registry | Published and retrieved version `0.2.7` of `io.github.Tumerit/tethered`, with the new repository URL and the existing 0.2.7 MCPB at its canonical release URL. SHA-256 verified before publication. Metadata is tracked in `Integrations/registry/server.json`. |
| Awesome MCP Servers | Updated existing PR #16262 description and its `patch-1` README entry. Commit `c8908b07616fa38555e50a3918b5a211627b201c` changes only the Tethered listing line. PR still awaits upstream review. |
| MCPRush | Saved and publicly verified the canonical setup link in listing copy. The separate GitHub source field still points to the old repository; no source-field editor was exposed in the claimed listing's management panels. Operator correction remains. |
| VS Code Marketplace | Public `tumerit.tethered` remains 0.2.3 with old links. Prepared 0.2.5, attached it in the existing publisher's update dialog, and attempted publication. The portal logs `reCAPTCHA Timeout` and reports exceeded reCAPTCHA Enterprise quota. Publication is not confirmed. |
| OpenAI Plugins | Reuploaded the existing Tethered draft as 0.2.7. Portal shows `0.2.7 · Draft`. It remains unpublished with the existing command-line MCP review blocker; no duplicate plugin or review submission was created. |
| Cursor | Existing local submission record is dated October 7. Current publisher portal shows a new-application form, with no existing-application editor exposed. No duplicate application or new terms acceptance submitted. Operator correction remains. |
| Claude directory | Previous submission is recorded as pending in the earlier launch handoff. No current published listing or editable publisher record was located in this audit; current approval status is unverified. Repository-based manifest links are updated. |
| Raycast | Inspected upstream `extensions/tethered-controls` README and package metadata. They use the unchanged product domain and Raycast author `Tumerit`, with no old GitHub repository URL requiring a change. |
| mcpservers.org | Public mirror still stores the old repository address. Requested its README refresh; the stored repository link remained old when checked. Operator correction remains. |
| Socket.dev | Mirrors the published VS Code package; its old links need the VS Code publication and downstream indexing, rather than a duplicate directory submission. |

## Websites and app source

TetheredMac.com deployed as Worker version
`4bca557e-6e7b-4a90-8850-72f0044e7d15`. Before deployment, all 55 deployable text
assets matched the live pre-migration baseline after normalizing Cloudflare HTML
injection and route transforms. Deployment uploaded exactly the 15 link-modified
assets, reused the other assets, and patched only GitHub URLs in the downloaded
production Worker module. Wrangler ran with `--no-bundle --keep-vars`; no build or
test commands were run. Live privacy, releases, and release-script URLs were
retrieved afterward and contain canonical links with no old owner references.

Tumerit.com also serves the updated canonical GitHub API URL in `i18n.js`.

App source changes are committed locally and take effect in the next app release.
The Tethered API email-template source correction is committed locally, but that
API was not deployed by this migration. Historical SQL migrations and existing
signed app archives were not rewritten.

Private website/API repositories remain under `Merit-Inc`; their remotes are not
part of this transfer. The app checkout has no configured Git remote. Bundle IDs,
Apple signing identities, Sparkle public keys, domains, and support email addresses
remain unchanged.

## Prepared packages

- VS Code: `/tmp/tethered-vscode-0.2.5.vsix`, SHA-256
  `ebd0b685cc6d278e25a79e9e3411d504d7c938b49e6fbdecc3ec32b9143eb95f`.
  Executable `extension.js` matches the published 0.2.3 version. The prepared
  package uses the current checked-in documentation and icon.
- OpenAI: `/tmp/tethered-codex-0.2.7.zip`, SHA-256
  `ed0d62c2b696f0255c0e7cf087d86de73f27822ef715867f5192c05f8b34e027`.
- Screenshots: `/tmp/tethered-migration-evidence/openai-draft-0.2.7.png` and
  `/tmp/tethered-migration-evidence/vscode-upload-blocked.png`.

The VSIX packager now writes the repository, support, homepage, and README assets
into the VSIX manifest so future uploads preserve Marketplace links.

## Operator correction drafts

These messages are prepared only; none has been sent. Sending them requires the
user's explicit instruction.

### Cursor

Recipient: marketplace-publishing@cursor.com

Subject: Update existing Tethered publisher submission after GitHub migration

Please update our existing Tethered publisher submission, originally submitted on
October 7, 2026, to use `https://github.com/Tumerit-LLC/Tethered` in place of
`https://github.com/Tumerit/Tethered`. The support URL is
`https://github.com/Tumerit-LLC/Tethered/issues`. Please preserve the existing
application and review history rather than creating a duplicate. Our product and
contact domains remain unchanged.

### MCPRush

Destination: existing MCPRush publisher-support/contact route

Please update the stored GitHub source URL for our claimed listing
`https://mcprush.com/tumerit/tethered-task-sessions-mcp` from
`https://github.com/Tumerit/Tethered` to
`https://github.com/Tumerit-LLC/Tethered`. We updated the setup link in the listing
copy, but could not find an editor for the separate GitHub source field. Please
preserve the existing listing ID, publisher, reviews, and install history.

### mcpservers.org

Recipient: contact@mcpservers.org

Please update the stored repository URL for
`https://mcpservers.org/servers/github-com-tumerit-tethered-blob-main-integrations-readme-md`
to `https://github.com/Tumerit-LLC/Tethered/blob/main/Integrations/README.md`, then
refresh its documentation. The repository moved to our organization; please
preserve the existing listing rather than creating a duplicate. A README refresh
was requested through the listing page, but its stored repository address remains
old.

## Identity and redirect compatibility

Keep Smithery `tumerit/tethered`, MCP Registry `io.github.Tumerit/tethered`, VS Code
`tumerit.tethered`, and Raycast author `Tumerit`: these are service identities, not
repository URLs. Existing GitHub redirect links still work; avoid recreating
repositories at their previous locations.

The translation secret name remained present after transfer. The available GitHub
API credential could not inspect organization Actions policies; no policy changes
were made. Existing successful runs alone do not establish every future policy
check will pass.
