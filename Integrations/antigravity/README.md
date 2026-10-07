![Tethered](assets/icon.png)

# Tethered for Antigravity

Requires Tethered 1.2.0 or later on this Mac, with Task sessions enabled. Copy this folder to `~/.gemini/config/plugins/tethered` for Antigravity 2.0. Open Settings → Customizations and refresh MCP servers; Tethered should show four tools. Alternatively, place the folder under your workspace’s `.agents/plugins/`. Review tool permissions before beginning a session. Global installation and the session lifecycle were verified with Antigravity 2.19.1.

The plugin locates the installed app automatically and launches its bundled MCP adapter. Keep Tethered running under the same macOS account. Remote agents cannot use the local bridge.

## Choose behavior for a chat

Ask “Configure Tethered for this chat.” The assistant lists saved profiles and asks you to choose one, when to activate it, and when to end sessions. Choose every prompt, explicit requests only, or criteria you describe. Choose end after each reply/task or let the session expire between replies. You can change the profile or stop using it at any time.

For example: “Use Heavy Work for every prompt in this chat and let sessions expire.” The assistant uses your saved duration, reuses its active session without extending it, and starts a new session after expiry on the next matching prompt. A different chat's active session is never taken over.

These are conversation preferences implemented through model instructions, not a native plugin settings panel. Start a fresh chat after updating. Choices are not shared across chats or written to project files. Host permissions, model behavior, and conversation context determine whether instructions run; automatic expiration remains the fallback.

VS Code and configuration-only clients receive this workflow through the updated Tethered adapter's MCP initialization instructions. With an older adapter, include `task-workflow.md` in chat context. This workflow update requires a newly built Tethered adapter; updating the plugin alone updates skill-based clients.

To stop all active Tethered sessions, say “Clear all Tethered task sessions.” The assistant calls `clear_task_sessions`, which ends the active session regardless of chat ownership and disables this chat's future activation selection. The command is safe to repeat when inactive. It requires the updated Tethered app and bundled adapter; 1.2.0 installations without that tool must use Tethered's manual End control. Other chats retain their preferences and may start another session on a later prompt.
