# Preview verification — October 6, 2026

Requires Tethered 1.2.0 or later. These checks do not constitute marketplace approval.

| Check | Result |
| --- | --- |
| Tethered Debug build with bundled MCP target | Passed, code signing disabled for the verification build |
| Claude Code plugin and repository marketplace manifests | Passed native validator |
| Gemini CLI extension manifest | Validator completed successfully |
| Codex repository marketplace | Registered and listed Tethered successfully using the CLI bundled with ChatGPT; left uninstalled to avoid duplicating this chat’s manual server |
| macOS app-discovery launcher | Initialized MCP, discovered all four tools, and read live session status |
| Live running Tethered bridge | Listed profiles; began one-minute High Power profile with keep-awake and both charging exceptions; ended that exact session; returned inactive |
| All 16 app-generated export formats | Generated successfully; JSON and Codex TOML parsed; desktop bundle and VSIX ZIP layouts checked |
| VS Code app-generated VSIX | Installed successfully in isolated user-data and extension directories |
| Preview VSIX | Installed successfully in isolated VS Code directories |
| Bridge connection reuse | Found lifetime connection-budget exhaustion in the installed test build; corrected in app source; isolated regression passes 24 consecutive requests and the eight-active-connection cap |
| Unknown profile and zero-minute duration | Rejected by the live bridge |
| App UI and Companion event translations | Added eleven non-English locales; checked event placeholders; app build passed |

The installed test build stopped accepting new bridge connections after its lifetime budget was exhausted. The corrected app source uses an unlimited lifetime budget while retaining its own eight-active-connection limit. Launch a build containing that fix before continuing live tests. A timed-out start is not confirmation of activation: inspect status in Tethered before retrying.

The live bridge test used the installed Tethered app. The separate verification build was not installed over it. Starting and ending a session proves policy requests and session ownership, not physical charging current, fan response, or temperature behavior under load.

Still required before advertising full client support: interactive plugin installation and tool approvals in Codex, Claude Code, Cursor, Gemini, Antigravity, and VS Code; expiry and restoration under load; disabled bridge and permission-denied behavior; Companion delivery and account-change behavior; release signing and archive validation. Preview package archives preserve hidden manifests and contain no application source or bridge credentials.

The globally installed Codex wrapper fails because its native executable is missing. The working CLI is `/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex`. No change to that global installation was made.

Claude Code’s attempted end-to-end read-only tool test was blocked by “Credit balance is too low.” Its manifests still validate successfully. Use an authenticated account with available access before repeating that client test.

## Live follow-up — October 6, 2026

The running Tethered 1.2.0 build passed 24 consecutive authenticated status requests. An overlapping begin and an end with an unrelated session ID were rejected. A one-minute session expired automatically and its `Tethered Task Session` macOS sleep assertion disappeared. A separately ended session also released that assertion.

Independent read-only SMC measurements found two fans. Before activation, both had zero RPM and zero targets in mode 3. During a High Power task session, both entered mode 1, targeted 2,317 RPM, and spun at approximately 2,059 and 2,157 RPM. After the session ended, both returned to mode 3 with zero targets and zero RPM. This verifies the proprietary fan fallback and restoration on the tested Mac; it does not establish native High Power support or behavior on other Macs.

Charging-current validation remains blocked: the battery reports no external power source. Sailing and heat-induced charging pause restoration and supplemental current under load have not been measured.

Codex installed the plugin successfully. In a plugin-only session, it discovered both read-only tools and correctly rejected calls when approval was required but the noninteractive client’s policy was never. Successful approval through the interactive client remains pending. The original manual configuration was restored and the test plugin removed to avoid duplicate registration.

Gemini’s installer displayed the launcher and context permissions, accepted installation, and enabled the extension. The installed Gemini CLI 0.37.2 model session was blocked by the account/provider error `UNSUPPORTED_CLIENT` for Gemini Code Assist for individuals. A temporary check of the current 0.63.0 CLI also reported an incompatible existing preferred-editor setting; permanent CLI installation and user preferences were left unchanged. That test extension was removed afterward. Claude Code remains blocked by insufficient credit. Cursor and Antigravity are not installed on this Mac. These client checks remain incomplete.

Keep the PR in draft until the required charging and successful client approval checks are completed, or explicitly change the release scope to merge a documented preview with those checks still pending.

## Claude Desktop follow-up — October 6, 2026

The user installed the app-generated MCPB. Claude Desktop showed Tethered enabled with all four tools and per-tool approval required. The first read-only attempt was denied. The user repeated the prompt and approved the calls; Claude displayed use of the Tethered integration and reported the saved Heavy Work profile and `{"active": false}`. No task was started or ended. This verifies import, tool discovery, and the read-only approval flow; session activation through Claude and physical charging validation remain pending.

Claude Desktop subsequently began a one-minute Heavy Work session and ended the exact returned session ID before expiry. The live bridge independently confirmed the active session. During activation, read-only SMC measurements showed both fan targets at 2,317 RPM, actual speeds approximately 2,313 and 2,339 RPM, and the Tethered sleep assertion present. Claude reported `{"ended": true}` and inactive status. Independent follow-up confirmed inactive status, both fans restored to mode 3 with zero targets and RPM, and the task sleep assertion absent. External power was still disconnected, so this does not validate charging exceptions.

## Codex and VS Code follow-up — October 6, 2026

The bundled Codex CLI 0.160.1 installed the repository plugin in an isolated configuration with no manual MCP entry. Its interactive client displayed per-call approvals; Allow was selected separately for profile listing, status, start, and end. The one-minute session was confirmed active, ended using its returned ID, and confirmed inactive. The temporary authentication link was removed afterward; the normal Codex configuration was not changed. This validates the interactive CLI plugin route; the desktop plugin approval surface remains a separate check.

VS Code installed the preview VSIX in the normal client, started its extension-provided server, and logged discovery of four tools. Copilot returned the saved profile and inactive status after read-only approvals. A subsequent one-minute lifecycle test used Allow Once for start and end, read active status, ended the returned ID, and read inactive status. Independent bridge checks confirmed the active Copilot session and subsequent inactive state. This establishes the VS Code/Copilot extension route; it does not establish physical charging behavior. The extension remains installed.

Claude Code 2.0.55 was checked again and still returned insufficient credit. Cursor and Antigravity remain absent from Applications.

Gemini CLI 0.63.0 was retried with an isolated settings directory, avoiding the incompatible preferred-editor setting and unrelated extensions. Native installation displayed and accepted the launcher/context permissions and enabled Tethered. Model authentication still failed with `UNSUPPORTED_CLIENT` for Gemini Code Assist for individuals, directing the account to Antigravity. Temporary authentication links were removed. Existing Gemini settings and the installed CLI were left unchanged.

## Antigravity follow-up — October 6, 2026

Antigravity 2.19.1 for Apple Silicon was downloaded from Google’s official download page and installed. macOS accepted its Google LLC notarized Developer ID signature. Sign-in completed using the existing Google session. The Tethered package was copied to `~/.gemini/config/plugins/tethered`, the documented global plugin location; refreshing MCP servers showed the plugin-provided server and four enabled tools.

The client returned the saved profile and inactive status through real MCP calls. A one-minute task then returned an active session, status confirmed that same ID, end returned `{"ended": true}`, and the final status returned `{"active": false}`. An independent bridge check also confirmed inactive state. This validates Antigravity’s plugin installation and session lifecycle; it does not resolve Gemini CLI account eligibility or establish charging-current behavior. Antigravity and the plugin remain installed.

## Cursor follow-up — October 6, 2026

Cursor 3.22 for Apple Silicon was installed from its official download source; macOS accepted the notarized Developer ID signature. The plugin was copied to `~/.cursor/plugins/local/tethered`. Cursor discovered the skill and four MCP tools. An initial account-policy refresh produced an unauthenticated error despite successful stdio connection; restarting Cursor resolved it.

The client returned the saved Heavy Work profile and inactive status. Its subsequent one-minute lifecycle invoked all four start/status/end/status operations, using session `1265C8C0-AD3C-478D-A376-0820BDF7629B`, and reported successful end and inactive final status. Independent bridge status confirmed inactive state. Cursor and its plugin remain installed.

External power is now connected and the battery reports charging. Charging-pause exception and restoration tests are still pending; this lifecycle does not establish supplemental current behavior.

## Charging and desktop approval follow-up — October 6, 2026

External power was connected. A controlled heat-protection test temporarily reduced the original 97°F threshold to 85°F, below the measured battery temperature, then restored it to 97°F. Runtime logs showed heat protection active and successful `disableCharging` requests. A one-minute task session (`CF9B6ED7-79CB-4EA2-8ADA-43D36492CBBA`) began and ended successfully; ending requested `disableCharging` again. Fan boost remained active during the session: both fan targets were 4,559 RPM and measured speeds approximately 4,561 and 4,558 RPM. Final independent session status was inactive.

Physical charging validation did not pass: IOKit continued reporting `IsCharging = Yes` and positive current while pause requests were reported successful. This discrepancy requires investigation; command success alone does not establish that charging paused or resumed. Sailing restoration and supplemental current under load remain unverified. The original heat threshold was restored, with fan/alert settings preserved.

The computer-use controller explicitly refused access to the Codex desktop app. Its desktop plugin installation/approval surface could not be automated. The separately verified interactive CLI approval and lifecycle results still stand. The PR remains a draft pending the outstanding hardware and desktop checks.
