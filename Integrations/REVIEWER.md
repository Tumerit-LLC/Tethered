# Marketplace review draft

## Listing copy

**Name:** Tethered Task Sessions

**Short description:** Temporarily apply a saved Tethered power profile while AI tools perform local work on your Mac.

**Description:** Connect your AI app to Tethered 1.2.0 or later. Use saved task profiles to request a power mode or keep your Mac awake during local builds, rendering, testing, or model inference. Sessions are bounded, expire automatically, and can be ended in Tethered. Temperature monitoring, heat alerts, and configured fan protection remain active. Cloud inference alone does not require a performance session.

**Requirements:** macOS, Tethered installed and running under the same account, Task sessions enabled, Pro access, and permissions for the selected profile. The AI app’s tool process must run on this Mac.

**Support:** https://github.com/Tumerit/Tethered/issues

**Repository:** https://github.com/Tumerit/Tethered

**Privacy summary:** Integration packages contain no bridge credentials or saved profiles. Tools receive profile names, configured task controls, and session state. The session reason is supplied by the caller. Optional Companion event uploads include the profile name and Tethered session events, but exclude AI prompt text and the task reason. AI platform data handling remains governed by that platform.

**Release notes:** Initial integration preview. Adds saved-profile discovery, session status, bounded task activation, and ending the exact owned session. Includes platform packages and manual setup alternatives. Public marketplace approval is pending.

Before submitting, provide verified privacy-policy and terms URLs, an approved icon, screenshots or a walkthrough of the current task-session interface, and reviewer access to Tethered’s required Pro features. Do not submit this draft as though those materials or access have been provided.

## Reviewer setup

Install a signed Tethered 1.2.0 build containing the connection-reuse fix. Enable Task sessions in General → AI. Create a test profile with a short duration. Install one integration, review its tool permissions, and open a fresh AI session. Disable any duplicate manually configured Tethered server first.

## Positive test prompts

1. “List my saved Tethered task profiles and report the current session status. Do not start a session.” Expected: five tools are discoverable; status reports whether a session is active.
2. “Start this saved Tethered profile for one minute and report its session ID and phase.” Expected: a valid saved ID activates a bounded session if access and permissions allow it.
3. “End the exact Tethered session you just started, then report its status.” Expected: that session ends; normal policy is requested; no active session remains.
4. “Start a one-minute Tethered test session and let it expire without calling end_task.” Expected: Tethered ends it automatically. Confirm restoration in the app and hardware readback.
5. “Use this saved task profile for a local build and end your session when the build finishes or fails.” Expected: begin precedes local work; end targets the returned ID. Confirm later manual power selections are preserved.

## Negative test cases

1. Use an unknown profile ID or a zero-minute duration. Expected: rejected without activating a session.
2. With a session already active, attempt another begin or end using an unrelated ID. Expected: rejected; the existing session remains owned by its original caller until ended or expired.
3. Disable Task sessions or deny the required access, then ask to begin a session. Expected: no activation; the AI app can continue its underlying task without Tethered. An unavailable bridge may return a connection error.

Repeat profile discovery and status more than eight times to confirm connection reuse. Verify power-mode and keep-awake restoration separately from reported session state. Confirm Companion notifications on the paired iPhone if that optional feature is enabled.
