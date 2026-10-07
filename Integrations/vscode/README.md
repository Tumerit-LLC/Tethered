# Tethered for VS Code / Copilot

Requires macOS and Tethered 1.2.0 or later. Enable Task sessions in Tethered and keep it running under the same macOS account. Install the preview VSIX through Extensions: Install from VSIX, then review the Tethered MCP server and tool permissions in Copilot’s local agent.

This extension discovers the installed Tethered app and uses its bundled adapter. It does not work in remote extension hosts. It exposes saved task profiles, session status, beginning a bounded session, and ending that exact session. Charging exceptions are configured in Tethered; temperature monitoring, alerts, and fan protection remain active.

Model instructions do not guarantee start or end calls. Tethered expires sessions automatically. Use MCP: Open User Configuration as a manual fallback. Avoid registering the same server through both routes.

Report issues at https://github.com/Tumerit/Tethered/issues.

## Choose behavior for a chat

Ask “Configure Tethered for this chat.” The assistant lists saved profiles and asks you to choose one, when to activate it, and when to end sessions. Choose every prompt, explicit requests only, or criteria you describe. Choose end after each reply/task or let the session expire between replies. You can change the profile or stop using it at any time.

For example: “Use Heavy Work for every prompt in this chat and let sessions expire.” The assistant uses your saved duration, reuses its active session without extending it, and starts a new session after expiry on the next matching prompt. A different chat's active session is never taken over.

These are conversation preferences implemented through model instructions, not a native plugin settings panel. Start a fresh chat after updating. Choices are not shared across chats or written to project files. Host permissions, model behavior, and conversation context determine whether instructions run; automatic expiration remains the fallback.

VS Code and configuration-only clients receive this workflow through the updated Tethered adapter's MCP initialization instructions. With an older adapter, include `task-workflow.md` in chat context. This workflow update requires a newly built Tethered adapter; updating the plugin alone updates skill-based clients.
