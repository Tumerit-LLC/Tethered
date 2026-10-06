# AI task sessions

These integrations are a preview for local macOS testing. Installation in each AI app is still pending verification. Task sessions require **Tethered 1.2.0 or later**, which includes General → AI → Task sessions and the bundled MCP adapter.

Enable Task sessions in Tethered, create a task profile, and allow AI activation. Keep Tethered running on the same Mac and macOS account as your AI app. Task sessions require Pro access and the permissions needed by the selected profile.

A profile can temporarily request a power mode, keep your Mac awake, and suspend approved charging pauses. Sessions expire automatically and can be ended in Tethered. Heat monitoring, alerts, and configured fan protection remain active. Charging exceptions may allow charging above your usual limit.

## Install

Download or clone this repository. Replace `/path/to/Tethered` below with its local directory. If you already configured a direct Tethered MCP server, disable that entry before installing a plugin to avoid duplicate tools.

| AI app | Setup |
| --- | --- |
| Codex desktop | Run `codex plugin marketplace add /path/to/Tethered`, then install Tethered from the local Tethered source in the Plugins directory. Open a new chat. |
| Claude Code | Run `claude plugin marketplace add /path/to/Tethered`, then `claude plugin install tethered@tumerit-tethered`. Open a new session. |
| Cursor | Copy `Integrations/cursor` to `~/.cursor/plugins/local/tethered`, then reopen Cursor and review its plugin and tool permissions. |
| Gemini CLI | Run `gemini extensions install /path/to/Tethered/Integrations/gemini-cli`, then open a new session. |

No Tethered configuration export, token entry, adapter compilation, or language runtime installation is required. Each package finds the installed Tethered app through macOS and launches its bundled adapter. The adapter connects to the active bridge. Moving or updating Tethered does not require regenerating these packages.

These packages run tools on your Mac. Browser-only chats and tool processes in a remote machine, cloud VM, or container cannot use this local connection.

## First connection

Ask your AI app:

> Use Tethered to list approved task profiles and report session status. Do not start a session yet.

Then ask it to start an approved test profile for one minute, report status, and end that exact session. You can watch the session in Tethered or end it there. If the tools are unavailable, check that the plugin is enabled, the AI session is new, and the installed Tethered build contains its MCP adapter.

Cloud inference alone does not call for a performance session. The integrations guide models to use approved profiles for substantial local work or when explicitly requested. Model instructions do not guarantee a tool call at the start or end of every prompt.

## Availability

These are directly distributed preview packages, not approved public-marketplace listings. Other platforms and downloadable desktop bundles will be added after their packaging is prepared and checked.

- [Codex plugin packaging](https://developers.openai.com/plugins/build/plugins)
- [Claude Code plugin distribution](https://code.claude.com/docs/en/plugins/publish)
- [Cursor plugins](https://prod.cursor.com/docs/plugins)
- [Gemini CLI extensions](https://geminicli.com/docs/extensions/)
