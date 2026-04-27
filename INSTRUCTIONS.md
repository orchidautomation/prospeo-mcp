<!-- pluxx:generated:start -->
# Prospeo

Prospeo plugin scaffold for account research and contact discovery workflows.

Prospeo connects through a local stdio MCP command (`node ./build/index.js`).

## Workflow Guidance

- `account-research`: Research companies, organizations, and account context before taking action. Primary tools: `prospeo_account_info`, `prospeo_bulk_enrich_company`, `prospeo_enrich_company`, `prospeo_search_company`.
- `contact-discovery`: Find people, contacts, and buyer-side context at the right accounts. Primary tools: `prospeo_bulk_enrich_person`, `prospeo_enrich_person`, `prospeo_search_person`.

## Tool Routing

- `prospeo_enrich_person`: Enrich a person to get their verified work email, title, LinkedIn, mobile, and employment history.
- `prospeo_bulk_enrich_person`: Enrich up to 50 people in one call.
- `prospeo_search_person`: Search 200M+ professional contacts.
- `prospeo_enrich_company`: Enrich a company by domain or name.
- `prospeo_search_company`: Search 30M+ companies by industry, size, location, funding round, and technology stack.
- `prospeo_bulk_enrich_company`: Enrich up to 50 companies in one call.
- `prospeo_account_info`: Check your Prospeo account: remaining credits, plan, usage, and next renewal date.

## Operating Notes

- Prefer the most specific tool that matches the user request.
- If the MCP exposes resources or prompt templates, use them as canonical context before improvising your own workflow.
- Confirm required inputs before calling a tool.
- Summarize returned data instead of dumping raw JSON unless the user asks for it.

## User Config

- `prospeo-api-key` (Prospeo Api Key; secret, required) — env: `PROSPEO_API_KEY`: Environment value required to launch the prospeo stdio MCP server.
<!-- pluxx:generated:end -->

## Custom Instructions

<!-- pluxx:custom:start -->
- Use `prospeo_search_person` to discover candidates, then call `prospeo_enrich_person` with `person_id` when the user wants verified emails or deeper profile data.
- Use `prospeo_search_company` to source target accounts, then `prospeo_enrich_company` for specific domains that need funding, headcount, tech stack, or revenue context.
- Prefer bulk enrich tools only when the user already has a prepared list. They are not discovery tools.
- Treat credit usage explicitly in your answers. `prospeo_enrich_person`, `prospeo_enrich_company`, and each search page cost credits; `prospeo_account_info` is free.
- Only set `enrich_mobile` when the user explicitly wants mobile numbers, because it increases credit cost materially.
<!-- pluxx:custom:end -->
