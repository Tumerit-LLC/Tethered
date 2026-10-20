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

## Remaining external updates

- Deploy the updated TetheredMac.com website/Worker, Tumerit.com website, and
  Tethered API source to publish their canonical links. Local commits do not
  constitute a production deployment.
- Update repository/support URLs in submitted Codex, Claude, Cursor, VS Code,
  and other directory/marketplace listings when their publisher interface allows
  it. Already published bundles retain their original metadata until a new
  package is published.
- Keep existing Smithery `tumerit/tethered`, MCP Registry
  `io.github.Tumerit/tethered`, and VS Code publisher identifiers unless a
  separate publisher migration is intended. These are service identities, not
  GitHub repository URLs. Verify registry ownership authorization before the next
  publication under the old GitHub-based MCP namespace.
- Update editable promotional posts and portfolio links to the canonical
  repository, release, license, security-policy, and Homebrew URLs.
- Confirm organization Actions policies permit workflow writes. The translation
  secret name remained present after transfer; policy inspection was denied to
  the available GitHub credential. Past successful runs alone do not establish
  that future organization-policy checks will pass.

Private website/API repositories remain under `Merit-Inc`; their remotes are not
part of this transfer. The app checkout has no configured Git remote. Bundle IDs,
Apple signing identities, Sparkle public keys, domains, and support email addresses
remain unchanged.
