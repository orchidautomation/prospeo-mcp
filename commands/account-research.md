---
description: "Research companies, organizations, and account context before taking action."
argument-hint: [companies] [domain]
---

<!-- pluxx:generated:start -->
Use this command when the user asks to research companies, organizations, and account context before taking action.

Arguments: $ARGUMENTS

Primary tools:
- `prospeo_account_info`
- `prospeo_bulk_enrich_company`
- `prospeo_enrich_company`
- `prospeo_search_company`

Workflow:

1. Interpret `$ARGUMENTS` as the user request for this workflow.
2. Choose the most specific tool in this surface.
3. Ask for missing required inputs only if the request does not already provide them.
4. Return a concise task-focused answer instead of raw JSON unless the user asks for it.
<!-- pluxx:generated:end -->

## Custom Notes

<!-- pluxx:custom:start -->
- Good fits: account list building, domain-based company enrichment, firmographic research, tech stack lookups, and credit checks.
- Default sequence: search companies first, then enrich the shortlisted accounts.
<!-- pluxx:custom:end -->
