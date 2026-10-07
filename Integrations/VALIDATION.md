# Preview verification — October 6, 2026

Requires Tethered 1.2.0 or later. These checks do not constitute marketplace approval.

| Check | Result |
| --- | --- |
| Tethered Debug build with bundled MCP target | Passed, code signing disabled for the verification build |
| Claude Code plugin and repository marketplace manifests | Passed native validator |
| Gemini CLI extension manifest | Validator completed successfully |
| Codex repository marketplace | Registered successfully using the CLI bundled with ChatGPT |
| macOS app-discovery launcher | Initialized MCP, discovered all four tools, and read live session status |
| Live running Tethered bridge | Listed profiles; began one-minute High Power profile with keep-awake and both charging exceptions; ended that exact session; returned inactive |
| All 16 app-generated export formats | Generated successfully; JSON and Codex TOML parsed; desktop bundle and VSIX ZIP layouts checked |
| VS Code app-generated VSIX | Installed successfully in isolated user-data and extension directories |
| App UI and Companion event translations | Added eleven non-English locales; checked event placeholders; app build passed |

The live bridge test used the installed Tethered app. The separate verification build was not installed over it. Starting and ending a session proves policy requests and session ownership, not physical charging current, fan response, or temperature behavior under load.

Still required before advertising full client support: interactive plugin installation and tool approvals in Codex, Claude Code, Cursor, Gemini, Antigravity, and VS Code; Claude Desktop import; expiry and restoration under load; disabled bridge and permission-denied behavior; Companion delivery and account-change behavior; release signing and archive validation. Preview package archives preserve hidden manifests and contain no application source or bridge credentials.

The globally installed Codex wrapper fails because its native executable is missing. The working CLI is `/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex`. No change to that global installation was made.
