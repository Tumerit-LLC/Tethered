# Integration distribution

Only integration manifests, workflow instructions, documentation, and approved release packages belong here. Tethered app and helper source remain in the private development repository. These packages contain no bridge credentials or user profiles.

The preview package version is 0.1.0. The macOS launcher and task workflow originate from the private repository’s MCP integration implementation. Keep the platform copies aligned when preparing updates.

Before advertising a release, verify installation and tool discovery in each supported client; then verify begin, status, end, expiration, disabled bridge, unknown profile IDs, and restoration of the normal policy. Task sessions require Tethered 1.2.0 or later. Current package installation verification is pending.

For release archives, package each platform directory with its hidden manifest files. Keep marketplace catalogs at the repository root so repository installation can discover them. Do not include app source, private assets, signing credentials, or local connection descriptors.

Official marketplace approval is separate from direct distribution. OpenAI’s standard public submission expects remote HTTPS MCP; obtain guidance for this local macOS integration before submitting. Claude Code and Cursor have their own directory review processes. Gemini CLI supports direct repository installation and a separate gallery discovery path.
