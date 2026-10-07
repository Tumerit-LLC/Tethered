# Tethered for VS Code / Copilot

Requires macOS and Tethered 1.2.0 or later. Enable Task sessions in Tethered and keep it running under the same macOS account. Install the preview VSIX through Extensions: Install from VSIX, then review the Tethered MCP server and tool permissions in Copilot’s local agent.

This extension discovers the installed Tethered app and uses its bundled adapter. It does not work in remote extension hosts. It exposes saved task profiles, session status, beginning a bounded session, and ending that exact session. Charging exceptions are configured in Tethered; temperature monitoring, alerts, and fan protection remain active.

Model instructions do not guarantee start or end calls. Tethered expires sessions automatically. Use MCP: Open User Configuration as a manual fallback. Avoid registering the same server through both routes.

Report issues at https://github.com/Tumerit/Tethered/issues.
