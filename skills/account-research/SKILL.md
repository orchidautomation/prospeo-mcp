---
name: "account-research"
description: "Research companies, organizations, and account context before taking action."
---

<!-- pluxx:generated:start -->
# Account Research

Research companies, organizations, and account context before taking action.

## Tools In This Skill

### `prospeo_account_info`

Check your Prospeo account: remaining credits, plan, usage, and next renewal date. Free — no credits consumed.

### `prospeo_bulk_enrich_company`

Enrich up to 50 companies in one call. Returns industry, tech stack, funding, employee count for each. Costs 1 credit per matched record.

Inputs:
- `companies` (array, required): Array of companies to enrich (max 50)

### `prospeo_enrich_company`

Enrich a company by domain or name. Returns industry, description, employee count, funding, technologies, revenue, and location. Costs 1 credit.

Inputs:
- `domain` (string): Company domain (e.g. 'acme.com')
- `company_name` (string): Company name (use domain when possible for better matching)

### `prospeo_search_company`

Search 30M+ companies by industry, size, location, funding round, and technology stack. Returns 25 results per page. Costs 1 credit per page.

Filter structure (all optional):
- company.names.include: ["Company"]
- company.websites.include: ["domain.com"]
- company_industry.include: ["Software Development"]
- company_headcount_range: ["51-100", "101-200"]
- company_location.include: ["United States"]
- company_funding.stage: ["Series A", "Series B"]
- company_technology.include: ["React", "Python"]
- company_founded.min: 2020, company_founded.max: 2025

Inputs:
- `filters` (object, required): Search filters object — see tool description for structure
- `page` (number): Page number (default 1)

## Example Requests

- "Find prospeo account infos."
- "Find prospeo bulk enrich companies with <companies>."
- "Find prospeo enrich companies."
- "Find prospeo search companies with <filters>."

## Usage

- Pick the most specific tool in this skill for the user request.
- Gather required inputs before calling a tool.
- Summarize the returned data clearly instead of dumping raw JSON unless the user asks for it.
<!-- pluxx:generated:end -->

## Custom Notes

<!-- pluxx:custom:start -->
- Start with `prospeo_search_company` when the user is defining an account list, and switch to `prospeo_enrich_company` once they have a concrete domain or company name.
- Use `prospeo_bulk_enrich_company` only for pre-existing batches of domains or company names.
- Use `prospeo_account_info` when the user asks about credits, plan limits, or renewal timing.
- Mention credit consumption when proposing search pages or bulk enrich operations.
<!-- pluxx:custom:end -->
