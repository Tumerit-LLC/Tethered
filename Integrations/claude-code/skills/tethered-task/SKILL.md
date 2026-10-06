---
name: tethered-task
description: Use an approved Tethered profile during substantial work on this Mac.
---

Use Tethered only when the user requests a task profile or a substantial task runs on this Mac, such as compiling, rendering, testing, or local inference. Cloud inference alone does not require a session. List approved task profiles and choose one appropriate to the user’s request; never invent profile IDs. Begin a bounded session immediately before local work. Record the returned session_id and inspect the returned phase. End that exact session when work finishes, fails, or is cancelled. If a call times out, check get_session_status before retrying. Never end someone else’s session. If the bridge is unavailable or access is denied, continue the user’s work without a session. A prompt or skill is guidance, not a guaranteed lifecycle hook; Tethered also expires sessions. Charging-pause exceptions may be used only when already included in the user-approved profile. Never request individual charging controls or disable heat monitoring, alerts, or fan protection.
