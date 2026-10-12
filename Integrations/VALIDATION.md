# Integration verification

Updated October 12, 2026. Requires Tethered 1.2.0+ installed and running on the same Mac and user account, Pro access, Task Sessions enabled, and profile-specific permissions. These results are dated observations, not a guarantee of every client/version or marketplace approval. [Client installation instructions](README.md#install).

## Current scope

Profiles control temporary power mode, keep-awake behavior, maximum duration, background-process priority or suspension, memory-pressure activation, and configured safeguards. Charging policy remains independent. The October 7 historical statement listing only power mode, keep-awake, and duration is superseded by this scope. Its removed charging-pause exception references remain historical.

The October 6 client tests generally discovered four tools; October 7 clear-all checks discovered five. The later installed adapter and public MCPB initialization check discovered eight. Those shared adapter results do not automatically retest every client’s installation and approval surface.

## Process-control verification — October 11, 2026

These checks used the installed app/worker on the tested Mac and disposable fixture processes. They establish actual process-policy application and recovery rather than just successful MCP responses.

| Check | Observed result |
| --- | --- |
| Installed-worker deprioritization | The fixture app and its child entered macOS background policy, independently confirmed through kernel state. |
| Priority restoration | Normal priority returned after disconnect, expiry, client exit, termination, and crash recovery in the worker tests. |
| Installed-worker memory-heavy suspension | A fixture using approximately 202 MiB met the configured threshold; both fixture processes stopped and subsequently resumed. |
| Saved-profile deprioritization | The running app’s saved-profile/session path applied and restored the fixture’s background policy. |
| Warning/critical transition handling | Critical-only priority policy ignored warning pressure. Warning and critical triggers activated background policy after approximately 4.1 seconds; pressure returned to normal around 10.3 seconds and normal priority returned around 25.9 seconds. |
| Saved-profile pressure-triggered suspension | After macOS warning pressure began, both fixture processes entered kernel stopped state about three seconds later. Tethered independently reported two suspended processes and no errors. Both resumed after pressure returned to normal. |
| Final cleanup | The session ended, the temporary profile was removed, and fixture apps/processes were closed. The original saved profile was preserved. |

**Claim supported by testing:** on the tested Mac, a saved task profile can suspend the targeted fixture app and its child in response to warning memory pressure, and resume them when pressure recovers. The installed worker also applies and restores deprioritization.

**Limits:** the pressure states were induced with macOS `memory_pressure -S` simulation and independently observed in kernel readings; this was not a naturally occurring memory-exhaustion workload. The warning-pressure suspension path passed through a saved profile. Warning and critical priority transitions passed separately; critical-pressure suspension was not separately verified through a saved profile. The observed priority timing was consistent with the three-second activation and fifteen-second recovery delays plus polling. Suspension recovery passed, but no more precise suspension recovery time is claimed here.

Suspension stops execution; it does not free the suspended app’s allocated memory. These tests do not establish reduced memory footprint, faster builds, improved battery life, behavior of every third-party app, or suspension results in every MCP client.

## Client verification

Expand a client to see what passed and what remains unverified. Successful session requests alone do not establish physical charging behavior.

<details>
<summary>Claude Desktop</summary>

**Recorded result:** October 6, 2026: the user imported the app-generated MCPB, approved read-only calls, then began and ended a one-minute session using its returned ID. Independent bridge status, sleep-assertion observation, and fan measurements confirmed activation and restoration on the tested Mac.

**Scope and remaining checks:** That was a four-tool build. The public 0.2.5 MCPB passed shared initialization/eight-tool discovery; 0.2.6 changes only metadata/documentation and preserves its launcher. A complete lifecycle with the current public bundle in Claude Desktop has not been repeated.

[Installation instructions](README.md#install). Exact earlier measurements and dispositions are preserved in the historical record below.

</details>

<details>
<summary>Codex desktop</summary>

**Recorded result:** October 6, 2026: the user installed the desktop plugin. A fresh chat discovered Heavy Work and inactive status after the redundant manual server entry was removed.

**Scope and remaining checks:** The desktop plugin installation/discovery result is distinct from the interactive CLI lifecycle and the later shared process-policy tests. No claim of a repeated full current-version desktop lifecycle is made.

[Installation instructions](README.md#install). Exact earlier measurements and dispositions are preserved in the historical record below.

</details>

<details>
<summary>Codex CLI</summary>

**Recorded result:** October 6, 2026: the isolated plugin-only interactive CLI approved profile listing, status, start, and end separately; a one-minute lifecycle passed. October 7: version 0.2.0 conversation selection, same-session reuse without extending expiry, clear-all, and no calls after clearing the conversation preference passed.

**Scope and remaining checks:** The record does not establish identical prompt-by-prompt model behavior in every host or current-version lifecycle results in every client.

[Installation instructions](README.md#install). Exact earlier measurements and dispositions are preserved in the historical record below.

</details>

<details>
<summary>Claude Code</summary>

**Recorded result:** October 6, 2026: native plugin/repository manifests passed validation.

**Scope and remaining checks:** End-to-end model calls were blocked by insufficient account credit. Installation validation is not a successful task lifecycle.

[Installation instructions](README.md#install). Exact earlier measurements and dispositions are preserved in the historical record below.

</details>

<details>
<summary>Cursor</summary>

**Recorded result:** October 6, 2026: Cursor 3.22 discovered the plugin skill and four tools. After restarting to resolve an account-policy error, a one-minute start/status/end/status lifecycle passed; independent bridge status confirmed inactivity afterward.

**Scope and remaining checks:** Current eight-tool client discovery and pressure-triggered suspension from Cursor have not been separately retested.

[Installation instructions](README.md#install). Exact earlier measurements and dispositions are preserved in the historical record below.

</details>

<details>
<summary>VS Code / Copilot</summary>

**Recorded result:** October 6, 2026: isolated and normal-client VSIX installations passed. Copilot approved read-only calls and Allow Once for start/end; a one-minute lifecycle and independent bridge checks passed.

**Scope and remaining checks:** The earlier client lifecycle used four tools. Current eight-tool discovery and pressure-triggered suspension from Copilot have not been separately retested.

[Installation instructions](README.md#install). Exact earlier measurements and dispositions are preserved in the historical record below.

</details>

<details>
<summary>Google Antigravity</summary>

**Recorded result:** October 6, 2026: Antigravity 2.19.1 detected the plugin at the documented global path and four tools. Read-only calls and a one-minute lifecycle passed; independent bridge status confirmed inactive state.

**Scope and remaining checks:** This does not resolve Gemini CLI eligibility. Current eight-tool discovery and pressure-triggered suspension from Antigravity have not been separately retested.

[Installation instructions](README.md#install). Exact earlier measurements and dispositions are preserved in the historical record below.

</details>

<details>
<summary>Gemini CLI</summary>

**Recorded result:** October 6, 2026: manifest validation and native install/permission prompts passed, including an isolated CLI 0.63.0 attempt.

**Scope and remaining checks:** The model session remained blocked by UNSUPPORTED_CLIENT for Gemini Code Assist for individuals. An incompatible preferred-editor setting was avoided with isolated settings, but account eligibility remained unresolved. No end-to-end lifecycle pass is claimed.

[Installation instructions](README.md#install). Exact earlier measurements and dispositions are preserved in the historical record below.

</details>

<details>
<summary>Other configuration-only clients</summary>

**Recorded result:** The earlier export check generated all 16 app export formats, parsed JSON and Codex TOML, and checked MCPB/VSIX archive layouts.

**Scope and remaining checks:** Those packaging checks do not establish interactive installation, tool approvals, or session lifecycle in LM Studio, Windsurf, Cline, Kiro, Zed, OpenCode, Kilo Code, Continue, or every other host.

[Installation instructions](README.md#install). Exact earlier measurements and dispositions are preserved in the historical record below.

</details>

## Package and publication checks — October 12, 2026

The public 0.2.5 MCPB launched the installed adapter, initialized MCP, and listed eight tools. Version 0.2.6 preserves that launcher and changes only metadata/documentation. Its public download was verified against SHA-256 `7f144aa20fd1ff6faa1e1765f2386d192dbc4749bc2457474c7cdeef618bd462`. The Official MCP Registry lists `io.github.Tumerit/tethered` version 0.2.6 as active/latest. Directory submissions and review remain separate from protocol and runtime verification.

## Historical record

The original October 6–7 record is retained below verbatim. It includes intermediate failures and draft/merge prerequisites later resolved or explicitly waived. Read the final disposition and the current scope above before treating an earlier blocker as current.

<details>
<summary>October 6–7, 2026: full chronological verification record</summary>

# Preview verification — October 6, 2026

## Current scope — October 7, 2026

Charging-pause suspensions have been removed from the Tethered app source, MCP profile/status responses, and current plugin instructions. Paused charging does not prevent the battery from supplementing adapter power, so resuming charging is not required for that purpose. Task profiles now configure power mode, keep-awake, and maximum duration; charging policy remains independent.

The records below describe earlier builds and remain as historical evidence. Their references to charging exceptions and related validation prerequisites do not describe the current feature. A newly built Tethered app is required to use the updated adapter and controls. Older installed apps and plugin packages may still expose the previous descriptions.


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

## Final validation disposition — October 6, 2026

The heat-protection pause was rechecked outside a task session. After allowing telemetry to refresh, IOKit reported `IsCharging = No`, zero battery current, and external power connected; `pmset -g batt` reported AC attached and not charging. The earlier immediate charging readback was premature, so that discrepancy is resolved for the normal heat-protection pause.

The user installed the Codex desktop plugin. The redundant manual `[mcp_servers.tethered]` entry was removed from the user configuration, preserving all other settings and a backup. In a fresh chat the user reported successful profile discovery (Heavy Work, expected controls and 15-minute maximum) and inactive session status, with no task started. This validates the desktop plugin route independently of the manual MCP configuration.

The user explicitly waived further charging-resumption/restoration, Sailing restoration, and expiry charging checks as merge prerequisites. Supplemental battery current under load remains unmeasured. Claude Code and Gemini CLI account-access blockers remain documented rather than counted as passes. Marketplace submission and approval remain separate from this integration preview. With the desktop check complete and remaining hardware checks waived, the user authorized merging PR #1. Earlier chronological draft/blocker notes above are superseded by this disposition.

## Version 0.2.0 conversation validation — October 7, 2026

The installed Codex skill was verified at version 0.2.0. A fresh Codex CLI conversation loaded that skill, listed the live saved profile, and asked for profile, activation, ending, and duration choices without starting a session. Selecting Heavy Work, every prompt, let expire, and one minute began session `019232A4-84FB-4D42-8D16-71F8581256F2`. A subsequent short “hello” prompt called status and reused the same session ID and expiration without another begin or end call. “Clear all Tethered task sessions” called `clear_task_sessions`, returned cleared_count 1 and inactive status, and cleared the conversation's activation choice. A subsequent greeting made no MCP calls. Independent final status was inactive.

Fresh direct adapter tests also verified five-tool discovery, unchanged session ID and expiration across repeated status checks, active and inactive clear-all calls (counts 1 and 0), and explicit end with inactive final status. These are model conversation and bridge checks, not proof of native profile-picker UI or consistent behavior in every host. Other clients' 0.2.0 conversation flows and expiry restart behavior have not yet been retested.


</details>
