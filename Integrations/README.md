# AI task sessions

These integrations are a preview for local macOS testing. Manifest validation has passed for Claude Code and Gemini CLI. Interactive installation and session restoration still need client testing. Task sessions require **Tethered 1.2.0 or later**, which includes General → AI → Task sessions and the bundled MCP adapter.

Enable Task sessions in Tethered, create a task profile. All saved task profiles are available while Task sessions is enabled. Keep Tethered running on the same Mac and macOS account as your AI app. Task sessions require Pro access and the permissions needed by the selected profile.

A profile can temporarily request a power mode, keep your Mac awake, and suspend user-configured charging pauses. Sessions expire automatically and can be ended in Tethered. Heat monitoring, alerts, and configured fan protection remain active. Charging exceptions may allow charging above your usual limit.

## Install

Download or clone this repository. Replace `/path/to/Tethered` below with its local directory. If you already configured a direct Tethered MCP server, disable that entry before installing a plugin to avoid duplicate tools.

| AI app | Setup |
| --- | --- |
| Codex desktop | Run `codex plugin marketplace add /path/to/Tethered`, then install Tethered from the local Tethered source in the Plugins directory. Open a new chat. |
| Claude Code | Run `claude plugin marketplace add /path/to/Tethered`, then `claude plugin install tethered@tumerit-tethered`. Open a new session. |
| Cursor | Copy `Integrations/cursor` to `~/.cursor/plugins/local/tethered`, then reopen Cursor and review its plugin and tool permissions. |
| VS Code / Copilot | Install the preview `.vsix` through Extensions: Install from VSIX, then review MCP tool permissions in the local agent. |
| Google Antigravity | Install `Integrations/antigravity` using its plugin installer; client verification is pending. |
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

These are directly distributed preview packages, not approved public-marketplace listings. Configuration-only clients use the Manual Setup fallback above. Claude Desktop bundles are exported by Tethered for the exporting Mac. VS Code and Antigravity package definitions are included; interactive tool discovery remains pending for these clients.

- [Codex plugin packaging](https://developers.openai.com/plugins/build/plugins)
- [Claude Code plugin distribution](https://code.claude.com/docs/en/plugins/publish)
- [Cursor plugins](https://prod.cursor.com/docs/plugins)
- [Gemini CLI extensions](https://geminicli.com/docs/extensions/)
