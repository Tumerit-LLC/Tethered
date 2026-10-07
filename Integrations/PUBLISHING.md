# Integration distribution

Only integration manifests, workflow instructions, documentation, and approved release packages belong here. Tethered app and helper source remain in the private development repository. These packages contain no bridge credentials or user profiles.

The preview package version is 0.1.0. The macOS launcher and task workflow originate from the private repository’s MCP integration implementation. Keep the platform copies aligned when preparing updates.

Before advertising a release, verify installation and tool discovery in each supported client; then verify begin, status, end, expiration, disabled bridge, unknown profile IDs, and restoration of the normal policy. Task sessions require Tethered 1.2.0 or later. See [the verification record](VALIDATION.md) for completed checks and remaining client and hardware checks.

For release archives, package each platform directory with its hidden manifest files. Keep marketplace catalogs at the repository root so repository installation can discover them. Do not include app source, private assets, signing credentials, or local connection descriptors.

Official marketplace approval is separate from direct distribution. OpenAI’s standard public submission expects remote HTTPS MCP; obtain guidance for this local macOS integration before submitting. Claude Code and Cursor have their own directory review processes. Gemini CLI supports direct repository installation and a separate gallery discovery path.

## Prepare preview archives

From the repository root, run `python3 Integrations/package.py /absolute/path/to/output`. This maintainer command packages manifests and integration instructions, preserves hidden files, creates the VS Code VSIX, and writes SHA-256 checksums. End users do not need Python or to build an adapter. Claude Desktop bundles remain available through Tethered’s Export Integration; the preview packager does not copy or redistribute the installed app binary.

## Submission handoff

1. Publish Tethered 1.2.0 with its signed, bundled adapter and complete the remaining checks in `VALIDATION.md`.
2. Merge the reviewed integration branch into the support repository’s default branch. Direct marketplace installation can then use `Tumerit/Tethered` rather than a local path.
3. Prepare listing assets: app icon, screenshots or a walkthrough, support and privacy URLs, release notes, and test instructions. Reviewers need a Mac with Tethered and access to the required Pro features.
4. For OpenAI, obtain confirmation of the submission route for local stdio MCP before submitting. The standard public flow expects remote HTTPS MCP. Direct Codex marketplace installation is already a separate distribution route.
5. Submit Claude Code and Cursor through their directory review processes. For VS Code, use a publisher account you control; `tumerit` is a proposed package publisher and has not been verified or reserved here. For Gemini and Antigravity, confirm the available gallery listing route; direct installation does not imply gallery approval.

Do not register duplicate manual and plugin servers. GitHub supports translated documentation, but English-only documentation is sufficient for this preview. App UI translations are maintained in the private app repository; no user must localize files on GitHub.
