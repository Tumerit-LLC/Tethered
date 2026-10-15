# Tethered for Smithery

Requires Apple Silicon, macOS 15 or later, Tethered 1.2.0 or later installed and running under the same macOS account, Pro access, and AI task sessions enabled. Intel Macs and cloud-only clients are unsupported.

The MCPB contains an arm64 adapter and public metadata. It reads the current user's private Tethered connection descriptor at runtime. No connection descriptors, tokens, or saved profiles are distributed.

Install the bundle in a local MCPB-compatible client and review its tool permissions. Start with profile discovery; activate profiles only according to the user's selection. Unlimited profiles require an explicit end. Manual disk-cache purging requires a separate explicit request and Tethered's confirmation.

Publish through Smithery's local stdio route:

```sh
smithery mcp publish ./tethered.mcpb -n tumerit/tethered
```

Version 0.2.8 was compiled for arm64 and signed with Tumerit LLC’s Developer ID on October 15, 2026. All eight output schemas, structured/text response parity, and tool errors passed isolated verification. Read-only profile discovery and status passed against the running app. Another Mac has not been verified.

Version 0.2.8 advertises list_profiles, start_task, end_task, clear_tasks, purge_cache, report_event, dismiss_warnings, and get_status. Legacy tool names remain accepted for existing clients. New names and legacy aliases passed isolated schema verification; live profile discovery and status passed against the existing app bridge.
