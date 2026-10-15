# Smithery search indexing investigation

Checked October 15, 2026 after publishing release 0.2.11.

Listing: https://smithery.ai/servers/tumerit/tethered
Qualified name: tumerit/tethered
Transport: local stdio, binary MCPB
Latest release: 1089956d-5da9-47ee-8862-fa210401010e (SUCCESS)

The listing is public, Unlisted is unchecked, and direct retrieval returns the current description beginning “Control Mac power modes, prevent sleep, keep your Mac awake, and manage background apps during AI coding, builds, rendering, and local model inference.”

## Reproduction for Smithery support

Authenticated GET requests to https://api.smithery.ai/servers:

| Parameters | Result |
| --- | --- |
| namespace=tumerit | One result: tumerit/tethered |
| namespace=tumerit&q=Tethered | Zero results |
| q=Tethered&topK=500&pageSize=100 | No tumerit/tethered among the first 100 results |
| q=Mac%20power%20management&remote=false&pageSize=100 | No tumerit/tethered among the first 100 results |

CLI searches for “Mac power management,” “keep awake,” “prevent sleep,” “background apps,” and “Tethered” each omit the listing from the first ten results, both before and immediately after the description update. Website search for “Tethered” also omitted it from the first page.

Please check whether this successful local stdio release is present in the full-text and semantic search indexes, whether metadata updates trigger reindexing, and whether a manual reindex is needed. Namespace-only discovery works, while adding the listing's exact name excludes it.

No confirmed indexing delay or cause was found in the current public API documentation. This is evidence of an indexing or search-path problem, not proof of a particular backend defect. No support message has been sent.
