<picture>
  <source media="(prefers-color-scheme: dark)" srcset="SocialPreviewDark.png">
  <source media="(prefers-color-scheme: light)" srcset="SocialPreview.png">
  <img alt="Tethered" src="SocialPreview.png">
</picture>

# Tethered

Tethered is a macOS app for managing battery charging, power behavior, and automation. It brings charging controls, battery history, scheduled routines, and task-aware power management into one place, with quick access from the menu bar.

<a href="https://github.com/Tumerit/homebrew-tap"><img src="https://brew.sh/assets/img/homebrew.svg" alt="Homebrew logo" width="24" height="24"> Install with Homebrew</a>

```sh
brew install --cask Tumerit/tap/tethered
```

<a href="https://github.com/Tumerit/Tethered/releases/download/v1.0.0/Tethered.alfredworkflow"><img src="Assets/alfred-icon.png" alt="Alfred icon" width="24" height="24"> Alfred Workflow</a> — Currently testing. Requires Alfred 5 with Powerpack and Tethered installed and running.

## What you can do

- **Manage charging:** Set a charging limit, use Sailing to let the battery discharge before charging resumes, and pause charging when the battery gets too warm.
- **Control power and sleep:** Configure High and Low Power behavior and thresholds, macOS system assertions, wake behavior, and Caffeinate presets. Standby settings include hibernation mode and delays.
- **Automate by app:** Apply power, Caffeinate, brightness, and supported fan actions when selected apps launch, activate, deactivate, or quit. Use schedules and keyboard shortcuts for recurring routines.
- **Schedule system actions:** Set one-time or repeating events for power modes, Top-up, Caffeinate, brightness, wake, sleep, power on, or shutdown.
- **Save and share profiles:** Keep named settings profiles, export or share them, and import profiles from others. Profiles can include calibration and standby settings.
- **Calibrate your battery:** Start a calibration cycle when you choose, or schedule one according to your calibration policy.
- **Adjust the display:** Restore or set brightness when power modes change, and configure dimming behavior before display sleep.
- **Track battery condition:** See battery health, cycle count, charge level, and temperature history. Export battery history as CSV or JSON, and export app logs.
- **Manage alerts:** Customize battery alerts and manually or automatically dismiss the persistent macOS low-battery banner.
- **Use Apple Shortcuts and Siri:** Trigger supported charging and power actions through Apple Shortcuts, Siri, and keyboard shortcuts.

## Pro Access

Pro Access is **$9.99 per device**. Pay once, lifetime upgrades. It unlocks extended charging controls and heat protection options, power mode thresholds and system controls, app-based automation, Caffeinate presets, additional keyboard shortcuts and Apple Shortcuts actions, iCloud settings sync, and more alert customization. You can purchase or check access for this Mac in Tethered's Pro Access settings.

## Your data

Tethered keeps your settings and battery history locally on your Mac. With Pro Access, you can enable iCloud sync for your settings and assets, or back up and restore them through your iCloud account. Battery history remains available locally in Tethered's Application Support folder.

You can manage settings in the app, view battery health and charge history in **Stats**, and export battery health history as **CSV or JSON**. Tethered also lets you export its logs. Open **Account → iCloud** to find the local data location and iCloud backup controls.

## AI Integrations Preview

**Requires Tethered 1.2.0+ installed and running on the same Mac and user account, Pro access, Task Sessions enabled, and a saved task profile.**

Connect a local AI assistant to Tethered while it runs builds, test suites, data-processing jobs, and other work on your Mac. A saved task profile can:

- Request Automatic, Low Power, or High Power mode where supported
- Keep your Mac awake with Caffeinate
- Deprioritize or temporarily suspend eligible background apps
- Suspend eligible apps at configured memory-pressure levels, with exceptions and frontmost-app protection

Task safeguards can flag repeated failures, calls, or output; matching output; inactivity; missing progress reports; task runtime; and sustained memory pressure. A safeguard can notify you or request that the AI client pause or cancel work. Those requests depend on the client cooperating; Tethered does not directly pause or cancel the AI task. Ending or expiring a session releases temporary controls and resumes apps Tethered suspended. Heat monitoring, alerts, and configured fan protection remain active.

For Claude Desktop, download [tethered-0.2.6.mcpb](https://github.com/Tumerit/Tethered/releases/download/v1.2.0/tethered-0.2.6.mcpb). The MCPB launches the adapter from the installed app; it does not install Tethered.

For Codex, Claude Code, Cursor, Gemini CLI, VS Code/Copilot, and other supported local clients, see [plugin installation and manual setup](Integrations/README.md).

Current State: [Integrations/VALIDATION.md](Integrations/VALIDATION.md)

## Screenshots

| Charging and heat protection | Power modes and system assertions |
| --- | --- |
| ![Tethered charging limit and heat protection settings](Screenshots/battery.png) | ![Tethered power mode thresholds and system assertions](Screenshots/controls.png) |

| Per-app automation | Battery history |
| --- | --- |
| ![Tethered app schedule and its automated power actions](Screenshots/apps.png) | ![Tethered battery health and charge history](Screenshots/stats.png) |

| Display brightness | Alerts and appearance |
| --- | --- |
| ![Tethered display brightness automation](Screenshots/display.png) | ![Tethered battery alert and appearance settings](Screenshots/appearance.png) |

| AI task sessions | System assertions |
| --- | --- |
| ![Tethered local AI task session setup and saved task profiles](Screenshots/task-sessions.png) | ![Complete Tethered system assertions and Caffeinate controls](Screenshots/assertions.png) |

| Task profile editor | Per-app automation |
| --- | --- |
| ![Tethered task profile editor for power, brightness, fans, and background activity](Screenshots/task-profile.png) | ![Tethered app automation schedule and launch actions](Screenshots/app-automation.png) |

| Scheduled events | Caffeinate presets |
| --- | --- |
| ![Tethered one-time and repeating scheduled events](Screenshots/schedules.png) | ![Tethered Caffeinate preset controls for sleep prevention](Screenshots/caffeinate.png) |

| Menu appearance customization | |
| --- | --- |
| ![Tethered menu appearance customization and preview](Screenshots/menu-customization.png) | |
## Get Tethered

Download the macOS installer from [GitHub Releases](https://github.com/Tumerit/Tethered/releases). The `.pkg` file is for manual installation; the `.Sparkle.zip` file is used by the app's built-in updater.
