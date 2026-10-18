# Tethered for Alfred

[Download Tethered for macOS](https://www.tetheredmac.com/download), install it, and open it before using the workflow. This link is also available in Alfred’s workflow configuration window when importing or configuring the workflow.

Requires Alfred 5 with Powerpack and the current Tethered app installed and running. Some features require Tethered Pro and supported hardware or battery conditions. Uses macOS’s built-in Perl and osascript; no additional dependencies are required.

Double-click `Tethered.alfredworkflow` to import it. Open Alfred and type `tethered` to browse and search commands.

- `tethered low power`: switch power mode.
- `tethered awake 30`: keep the Mac and display awake for 30 minutes (1–1,440 minutes).
- `tethered profile`: search saved Tethered profiles.
- `tethered preset`: search saved Caffeinate presets.
- `tethered status`: request fresh battery, control, and MCP Bridge status.
- `tethered events`: browse scheduled/repeating events. Select a row to edit, delete, or enable/disable a repeating event.
- `tethered next`: show the next enabled upcoming event.
- `tethered quick sleep in 30 minutes`: preview a one-time event, then press Return to create it.
- `tethered repeat low power weekdays at 9am for 2 hours`: preview a repeating event with a duration.
- `tethered schedule brightness 50% tomorrow at 9am for 1 hour`: preview a scheduled brightness change.
- `tethered quick topup on tomorrow at 7am wait for ac 30 minutes`: allow a wait for AC power.
- `tethered mcp`: find Toggle MCP Bridge. Disabling the bridge ends the active task session.
- `tethered companion`: find Toggle Companion Sync. The current app returns an unavailable error; future supporting apps can confirm success.

Controls also include Topup, Sailing, Heat Protection, and manual calibration. Starting calibration can charge the battery to full and then discharge it. A preset uses Tethered's existing preset-toggle behavior.

Scheduled event creation, editing, deletion, repeating-event enable/disable, and Companion Sync wait for a matching app response and report app errors or timeouts. Other controls confirm only that the request was sent. Use `tethered status` or Tethered itself to confirm the resulting state. Status is shown only when its request ID matches a fresh response; missing responses show an error instead of cached values. Permissions and Pro access are enforced by Tethered.

The workflow reads saved profiles and presets from local Tethered preferences. It uses the same distributed-notification bridge as the Raycast extension and does not activate Tethered when sending controls. It sends no data to an external service.

The source is in `Tethered/`. The workflow archive contains `info.plist`, `menu.pl`, `tethered.js`, `events.js`, `event-parser.js`, `icon.png`, and `icons/` at its root.

Quick Event supports relative minutes/hours/days, today, tomorrow, YYYY-MM-DD dates, upcoming named weekdays, and daily/weekday/weekend/named-day repeats. Times accept 12-hour AM/PM or 24-hour notation in your Mac’s timezone. Brightness and fans require a percentage or `system`. Unsupported input cannot create an event.

Selecting Edit fills the Alfred query with the existing event’s schedule. Change the text, review the preview, and press Return to save the same event. Edits preserve its app/system source and one-time/repeating type. Disabled repeats stay disabled. Delete requires selecting a confirmation row. Enable/Disable is available only for repeats; disabling does not delete their settings. Re-enabling a power event fails if another event occupies its system slot.

Append `replace` to a new repeating power-event phrase to explicitly replace a conflicting wake/power-on or sleep/shutdown event. The other system slot is preserved. Without that suffix, conflicts return an error. Creating or editing macOS power events may request administrator authorization. App-managed actions require Tethered running and the Mac awake at execution time.

The new commands require an updated Tethered app that supports event and Companion Sync response endpoints. Event lists are refreshed by entering `events` or `next`; selecting and editing rows uses the last list, while app mutations revalidate the selected event.

Alfred import and workflow-object execution remain unverified because Alfred is not installed on this Mac.

Command search reads current preferences with `defaults` and builds results in Perl. Actions and fresh status requests use osascript. The list checks the Tethered process name for its running-app hint; action execution verifies the app’s bundle identifier.
