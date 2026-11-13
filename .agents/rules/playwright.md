---
trigger: always_on
description: Strict restriction on Playwright MCP tool usage — use only for testing and strictly upon explicit user command.
---

## Playwright MCP Usage Restriction

- **Explicit User Command Required**: Do NOT use the Playwright MCP server or any of its tools (`browser_*`) without a direct, explicit instruction from the user.
- **Testing Only**: When explicitly commanded, the Playwright MCP is strictly reserved for automated testing and UI verification workflows.
- **No Autonomous or Proactive Invocations**: Never invoke Playwright MCP tools autonomously, proactively, or for general web browsing, crawling, or unprompted checks. Wait for the user to explicitly say e.g. "test this with playwright" or "run playwright test".
