# AI task sessions

These integrations are a preview for local macOS testing. Manifest validation has passed for Claude Code and Gemini CLI. Interactive installation and session restoration still need client testing. Task sessions require **Tethered 1.2.0 or later**, which includes General → AI → Task sessions and the bundled MCP adapter.

Enable Task sessions in Tethered, create a task profile. All saved task profiles are available while Task sessions is enabled. Keep Tethered running on the same Mac and macOS account as your AI app. Task sessions require Pro access and the permissions needed by the selected profile.

A profile can temporarily request a power mode and keep your Mac awake. Sessions expire automatically and can be ended in Tethered. Heat monitoring, alerts, and configured fan protection remain active. Charging policy remains independent of task sessions.

## Install

Download or clone this repository. Replace `/path/to/Tethered` below with its local directory. If you already configured a direct Tethered MCP server, disable that entry before installing a plugin to avoid duplicate tools.

| AI app | Setup |
| --- | --- |
| Codex desktop | Run `codex plugin marketplace add /path/to/Tethered`, then install Tethered from the local Tethered source in the Plugins directory. Open a new chat. |
| Claude Code | Run `claude plugin marketplace add /path/to/Tethered`, then `claude plugin install tethered@tumerit-tethered`. Open a new session. |
| Cursor | Copy `Integrations/cursor` to `~/.cursor/plugins/local/tethered`, then reopen Cursor and review its plugin and tool permissions. |
| VS Code / Copilot | Install the preview `.vsix` through Extensions: Install from VSIX, then review MCP tool permissions in the local agent. |
| Google Antigravity | Copy `Integrations/antigravity` to `~/.gemini/config/plugins/tethered`, then refresh MCP servers in Settings → Customizations. |
| Gemini CLI | Run `gemini extensions install /path/to/Tethered/Integrations/gemini-cli`, then open a new session. |

No Tethered configuration export, token entry, adapter compilation, or language runtime installation is required. Each package finds the installed Tethered app through macOS and launches its bundled adapter. The adapter connects to the active bridge. Moving or updating Tethered does not require regenerating these packages.

These packages run tools on your Mac. Browser-only chats and tool processes in a remote machine, cloud VM, or container cannot use this local connection.

## First connection

Ask your AI app:

> Use Tethered to list saved task profiles and report session status. Do not start a session yet.

Then ask it to start a saved test profile for one minute, report status, and end that exact session. You can watch the session in Tethered or end it there. If the tools are unavailable, check that the plugin is enabled, the AI session is new, and the installed Tethered build contains its MCP adapter.

Cloud inference alone does not call for a performance session. The integrations guide models to use saved profiles for substantial local work or when explicitly requested. Model instructions do not guarantee a tool call at the start or end of every prompt.

## Manual setup

If your AI app has no plugin installer, enable Task sessions in Tethered, choose the app under **Manual Setup**, then use one of these options:

- **Open Setup** opens the supported client’s installation dialog. Review and approve it there.
- **Export Integration** saves a package or configuration and a platform-specific README. Import the `.mcpb` file in Claude Desktop, install the `.vsix` file in VS Code, or follow the exported instructions for your selected app.
- **Copy Configuration** copies only a server entry. Merge it into the client’s existing settings; preserve any other servers.

| Client | Copied format and destination |
| --- | --- |
| Codex | TOML, `~/.codex/config.toml` |
| Claude Desktop | JSON, `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Cursor, LM Studio, Windsurf, Cline, Kiro | JSON, through the client’s MCP settings |
| VS Code / Copilot | JSON `servers` entry, through MCP: Open User Configuration or workspace `.vscode/mcp.json` |
| Zed | JSON `context_servers` entry, through Zed settings |
| OpenCode, Kilo Code | JSON `mcp` entry, through their configuration editor |
| Continue | YAML `mcpServers` entry, through Continue’s configuration editor |
| Other local MCP clients | JSON `mcpServers` entry, if supported by the client |

For Codex, a Tethered app installed in `/Applications` produces:

```toml
[mcp_servers.tethered]
command = "/Applications/Tethered.app/Contents/MacOS/tethered-mcp"
args = []
```

Copied configurations use the current app location. Copy again if you move Tethered. Profile edits, session changes, and app restarts do not require a new configuration. The Claude Desktop export includes a copied adapter, so re-export and reinstall that bundle when its adapter needs updating. App-generated desktop exports are intended for the exporting Mac; they are not universal marketplace release packages.

## Availability

These are directly distributed preview packages, not approved public-marketplace listings. Configuration-only clients use the Manual Setup fallback above. Claude Desktop bundles are exported by Tethered for the exporting Mac. VS Code/Copilot and Antigravity installation and session lifecycle checks passed; see the verification record for remaining checks.

- [Codex plugin packaging](https://developers.openai.com/plugins/build/plugins)
- [Claude Code plugin distribution](https://code.claude.com/docs/en/plugins/publish)
- [Cursor plugins](https://prod.cursor.com/docs/plugins)
- [Gemini CLI extensions](https://geminicli.com/docs/extensions/)

## Choose behavior for a chat

Ask “Configure Tethered for this chat.” The assistant lists saved profiles and asks you to choose one, when to activate it, and when to end sessions. Choose every prompt, explicit requests only, or criteria you describe. Choose end after each reply/task or let the session expire between replies. You can change the profile or stop using it at any time.

For example: “Use Heavy Work for every prompt in this chat and let sessions expire.” The assistant uses your saved duration, reuses its active session without extending it, and starts a new session after expiry on the next matching prompt. A different chat's active session is never taken over.

These are conversation preferences implemented through model instructions, not a native plugin settings panel. Start a fresh chat after updating. Choices are not shared across chats or written to project files. Host permissions, model behavior, and conversation context determine whether instructions run; automatic expiration remains the fallback.

VS Code and configuration-only clients receive this workflow through the updated Tethered adapter's MCP initialization instructions. With an older adapter, include `task-workflow.md` in chat context. This workflow update requires a newly built Tethered adapter; updating the plugin alone updates skill-based clients.

To stop all active Tethered sessions, say “Clear all Tethered task sessions.” The assistant calls `clear_task_sessions`, which ends the active session regardless of chat ownership and disables this chat's future activation selection. The command is safe to repeat when inactive. It requires the updated Tethered app and bundled adapter; 1.2.0 installations without that tool must use Tethered's manual End control. Other chats retain their preferences and may start another session on a later prompt.
