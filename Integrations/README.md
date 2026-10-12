# AI task sessions

These integrations connect local AI clients to **Tethered 1.2.0 or later**, which includes General → AI → Task sessions and the bundled MCP adapter. Client installation and lifecycle results vary; see each client below and the dated [validation record](VALIDATION.md).

Enable Task sessions in Tethered, create a task profile. All saved task profiles are available while Task sessions is enabled. Keep Tethered running on the same Mac and macOS account as your AI app. Task sessions require Pro access and the permissions needed by the selected profile.

Tethered lets an assistant apply a user-created profile during local builds, test suites, or data-processing jobs. Profiles can request Automatic, Low Power, or High Power mode where supported and keep the Mac awake using Caffeinate. Users can also deprioritize selected apps or other background apps, suspend eligible background apps, or suspend apps above a configured memory threshold. Process controls can apply throughout a session or activate when macOS reports warning or critical memory pressure. Configured app exceptions, frontmost-app protection, and protection for the AI client’s process tree limit which processes are affected.

The assistant can list saved profiles, begin a session, inspect status, report progress and safeguard events, and end its session. Ending or expiring a session releases temporary controls and resumes apps Tethered suspended. Users choose the profile settings and can end sessions directly in Tethered. Configured safeguards can warn about repeated failures or output, inactivity, lack of reported progress, excessive runtime, and sustained memory pressure; pause/cancel requests require cooperation from the AI client. Heat monitoring, alerts, and configured fan protection remain active. Charging policy remains independent of task sessions.

For example: “Use my Build profile while compiling, keep the Mac awake, and end the session when the build finishes.” Choose a finite duration if you want expiration to provide a fallback when the agent does not end its session.

## Install

All clients require the installed, running Tethered app, Pro access, Task Sessions enabled, and a saved profile. Select your client below. These direct installation routes do not require a public marketplace listing.

For repository-based packages, download or clone this repository and replace `/path/to/Tethered` with its local directory. If you already configured a direct Tethered MCP server, disable that entry before installing a plugin to avoid duplicate tools.

<details>
<summary>Claude Desktop</summary>

Download [tethered-0.2.6.mcpb](https://github.com/Tumerit/Tethered/releases/download/v1.2.0/tethered-0.2.6.mcpb) and import it in Claude Desktop. This public bundle launches the adapter from the installed app. An app-generated export is another option; follow its included README.

**Recorded verification:** Import, tool approval, and a one-minute start/status/end lifecycle passed with an earlier four-tool build. The current eight-tool package has shared adapter verification; its full Claude lifecycle has not been repeated. See [validation results and dates](VALIDATION.md).

</details>

<details>
<summary>Codex desktop and CLI</summary>

Run `codex plugin marketplace add /path/to/Tethered`, then install Tethered from the local Tethered source in the Plugins directory. Open a new chat. Manual configuration uses TOML in `~/.codex/config.toml`.

**Recorded verification:** Interactive CLI installation, per-call approvals, and lifecycle passed. The user verified desktop plugin profile discovery and inactive status. Version 0.2.0 conversation reuse and clear-all passed in CLI; these are distinct from the current shared suspension tests. See [validation results and dates](VALIDATION.md).

</details>

<details>
<summary>Claude Code</summary>

Run `claude plugin marketplace add /path/to/Tethered`, then `claude plugin install tethered@tumerit-tethered`. Open a new session.

**Recorded verification:** Native manifest validation passed. End-to-end model calls were blocked by insufficient account credit; they are not counted as passes. See [validation results and dates](VALIDATION.md).

</details>

<details>
<summary>Cursor</summary>

Copy `Integrations/cursor` to `~/.cursor/plugins/local/tethered`, then reopen Cursor and review its plugin and tool permissions. Manual configuration can be merged through Cursor’s MCP settings.

**Recorded verification:** Plugin discovery and a one-minute lifecycle passed after restarting the client to resolve an account-policy error. See [validation results and dates](VALIDATION.md).

</details>

<details>
<summary>VS Code / Copilot</summary>

Install the preview `.vsix` through Extensions: Install from VSIX, then review MCP tool permissions in the local agent. Manual setup uses a JSON `servers` entry through MCP: Open User Configuration or workspace `.vscode/mcp.json`.

**Recorded verification:** VSIX installation, four-tool discovery, approvals, and a one-minute lifecycle passed. See [validation results and dates](VALIDATION.md).

</details>

<details>
<summary>Google Antigravity</summary>

Copy `Integrations/antigravity` to `~/.gemini/config/plugins/tethered`, then refresh MCP servers in Settings → Customizations.

**Recorded verification:** Plugin installation, read-only calls, and a one-minute lifecycle passed. This does not resolve Gemini CLI account eligibility. See [validation results and dates](VALIDATION.md).

</details>

<details>
<summary>Gemini CLI</summary>

Run `gemini extensions install /path/to/Tethered/Integrations/gemini-cli`, then open a new session.

**Recorded verification:** Manifest validation and permission/installation prompts passed. Model calls were blocked by `UNSUPPORTED_CLIENT`; an isolated current-CLI attempt encountered the same account eligibility blocker. See [validation results and dates](VALIDATION.md).

</details>

No token entry, adapter compilation, or language runtime installation is required. Each repository package finds the installed Tethered app through macOS and launches its bundled adapter. Moving or updating Tethered does not require regenerating these launcher packages.

These tools run on your Mac. Browser-only chats and tool processes on a remote machine, cloud VM, or container cannot use this local connection.

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

<details>
<summary>Codex: manual configuration</summary>

TOML, `~/.codex/config.toml`. Merge the copied server entry into the existing configuration.

</details>

<details>
<summary>Claude Desktop: manual configuration</summary>

JSON, `~/Library/Application Support/Claude/claude_desktop_config.json`. Merge the copied server entry into the existing configuration.

</details>

<details>
<summary>Cursor, LM Studio, Windsurf, Cline, and Kiro: manual configuration</summary>

JSON through the client’s MCP settings. Merge the copied server entry into the existing configuration.

</details>

<details>
<summary>VS Code / Copilot: manual configuration</summary>

JSON `servers` entry through MCP: Open User Configuration or workspace `.vscode/mcp.json`. Merge the copied server entry into the existing configuration.

</details>

<details>
<summary>Zed: manual configuration</summary>

JSON `context_servers` entry through Zed settings. Merge the copied server entry into the existing configuration.

</details>

<details>
<summary>OpenCode and Kilo Code: manual configuration</summary>

JSON `mcp` entry through their configuration editor. Merge the copied server entry into the existing configuration.

</details>

<details>
<summary>Continue: manual configuration</summary>

YAML `mcpServers` entry through Continue’s configuration editor. Merge the copied server entry into the existing configuration.

</details>

<details>
<summary>Other local MCP clients: manual configuration</summary>

JSON `mcpServers` entry if supported by the client. Merge the copied server entry into the existing configuration.

</details>

For Codex, a Tethered app installed in `/Applications` produces:

```toml
[mcp_servers.tethered]
command = "/Applications/Tethered.app/Contents/MacOS/tethered-mcp"
args = []
```

Copied configurations use the current app location. Copy again if you move Tethered. Profile edits, session changes, and app restarts do not require a new configuration. The Claude Desktop export includes a copied adapter, so re-export and reinstall that bundle when its adapter needs updating. App-generated desktop exports are intended for the exporting Mac; they are not universal marketplace release packages.

## Tested suspension and restoration

The installed worker stopped and resumed a disposable fixture app and its child. A saved profile also suspended both processes after simulated macOS warning pressure and resumed them after pressure returned to normal. See the [post-test results and limits](VALIDATION.md#process-control-verification--october-11-2026). These checks establish suspension and restoration on the tested Mac; suspension does not free the app’s memory, and a performance improvement was not measured.

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
