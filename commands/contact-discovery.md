---
description: "Find people, contacts, and buyer-side context at the right accounts."
argument-hint: [people] [name]
---

<!-- pluxx:generated:start -->
Use this command when the user asks to find people, contacts, and buyer-side context at the right accounts.

Arguments: $ARGUMENTS

Primary tools:
- `prospeo_bulk_enrich_person`
- `prospeo_enrich_person`
- `prospeo_search_person`

Workflow:

1. Interpret `$ARGUMENTS` as the user request for this workflow.
2. Choose the most specific tool in this surface.
3. Ask for missing required inputs only if the request does not already provide them.
4. Return a concise task-focused answer instead of raw JSON unless the user asks for it.
<!-- pluxx:generated:end -->

## Custom Notes

<!-- pluxx:custom:start -->
- Good fits: prospect sourcing, verified work email lookup, batch person enrichment, and person search by title, seniority, or company filters.
- Default sequence: search people first, then enrich specific records with `person_id` when the user wants verified contact details.
<!-- pluxx:custom:end -->
