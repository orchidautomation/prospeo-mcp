---
name: "contact-discovery"
description: "Find people, contacts, and buyer-side context at the right accounts."
---

<!-- pluxx:generated:start -->
# Contact Discovery

Find people, contacts, and buyer-side context at the right accounts.

## Tools In This Skill

### `prospeo_bulk_enrich_person`

Enrich up to 50 people in one call. Each record needs name + company or LinkedIn URL. Returns matched/unmatched/invalid lists. Costs 1 credit per matched record.

Inputs:
- `people` (array, required): Array of people to enrich (max 50)
- `only_verified_email` (boolean): Only return verified emails (default true)

### `prospeo_enrich_person`

Enrich a person to get their verified work email, title, LinkedIn, mobile, and employment history. Provide name + company, OR LinkedIn URL, OR email, OR person_id. Costs 1 credit.

Inputs:
- `first_name` (string): First name
- `last_name` (string): Last name
- `full_name` (string): Full name (alternative to first + last)
- `company_name` (string): Company name
- `company_website` (string): Company domain (e.g. 'acme.com')
- `linkedin_url` (string): LinkedIn profile URL (standalone — no name/company needed)
- `email` (string): Email to enrich (standalone)
- `person_id` (string): Person ID from search results (standalone)
- `only_verified_email` (boolean): Only return verified emails (default true)
- `enrich_mobile` (boolean): Also find mobile number (costs 10 credits, default false)

### `prospeo_search_person`

Search 200M+ professional contacts. Returns 25 results per page. Costs 1 credit per page.
NOTE: Search results do NOT include email/mobile. Use prospeo_enrich_person with person_id to get contact info.

Filter structure (all optional):
- company.websites.include: ["domain.com"] — filter by company domain
- company.names.include: ["Company Name"] — filter by company name
- person_job_title.include: ["CRO", "VP Sales"] — job title filter (also supports boolean: "(CEO OR CTO) AND !Intern")
- person_seniority.include: ["C-Suite", "Vice President", "Director", "Head", "Founder/Owner", "Manager", "Senior"]
- person_department.include: ["Sales", "Marketing", "Engineering"]
- person_location.include: ["United States", "San Francisco"]
- company_industry.include: ["Software Development"]
- company_headcount_range: ["51-100", "101-200", "201-500"]
- company_location.include: ["United States"]
- company_technology.include: ["Salesforce"]
- company_funding.stage: ["Seed", "Series A", "Series B"]
- max_person_per_company: 3

Inputs:
- `filters` (object, required): Search filters object — see tool description for structure
- `page` (number): Page number (default 1, 25 results per page)

## Example Requests

- "Find prospeo bulk enrich persons with <people>."
- "Find prospeo enrich persons."
- "Find prospeo search persons with <filters>."

## Usage

- Pick the most specific tool in this skill for the user request.
- Gather required inputs before calling a tool.
- Summarize the returned data clearly instead of dumping raw JSON unless the user asks for it.
<!-- pluxx:generated:end -->

## Custom Notes

<!-- pluxx:custom:start -->
- Start with `prospeo_search_person` when the user needs discovery across titles, seniority, geography, industry, or technology filters.
- When the user wants verified contact data for a known person or a search result, call `prospeo_enrich_person` with the most specific identifier available, ideally `person_id`.
- Reserve `prospeo_bulk_enrich_person` for prepared lists of people. It is a throughput tool, not a search tool.
- Keep `only_verified_email` enabled unless the user explicitly asks for broader, lower-confidence output.
- Call out that `enrich_mobile` costs more credits than standard email enrichment.
<!-- pluxx:custom:end -->
