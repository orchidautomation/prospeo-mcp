# Prospeo MCP Server

MCP server for [Prospeo](https://prospeo.io) — search 200M+ contacts, enrich people and companies, and get verified work emails. Works with Claude Code, Claude Desktop, Cursor, Windsurf, and any MCP-compatible client.

## Why Prospeo

- **98% email accuracy** with <1% bounce rate
- **200M+ contacts** and **30M+ companies** searchable
- **7-day data refresh** cycle
- Pure credit-based pricing (no seat fees)

## Tools

| Tool | What it does | Credits |
|------|-------------|---------|
| `prospeo_enrich_person` | Verified email, title, LinkedIn, mobile, job history | 1 |
| `prospeo_bulk_enrich_person` | Enrich up to 50 people in one call | 1/record |
| `prospeo_search_person` | Search contacts by title, seniority, industry, tech, funding | 1/page |
| `prospeo_enrich_company` | Industry, funding, tech stack, headcount, revenue | 1 |
| `prospeo_bulk_enrich_company` | Enrich up to 50 companies in one call | 1/record |
| `prospeo_search_company` | Search companies by industry, size, funding, technology | 1/page |
| `prospeo_account_info` | Check remaining credits, plan, renewal date | Free |

## Setup

### 1. Get your API key

Sign up at [app.prospeo.io](https://app.prospeo.io) and grab your key from [app.prospeo.io/api](https://app.prospeo.io/api).

### 2. Clone and build

```bash
git clone https://github.com/your-username/prospeo-mcp.git
cd prospeo-mcp
npm install
npm run build
```

### 3. Add to your MCP client

**Claude Code:**

```bash
claude mcp add prospeo -- node /absolute/path/to/prospeo-mcp/dist/index.js -e PROSPEO_API_KEY=your_key
```

**Claude Desktop / Cursor / Windsurf** (add to your MCP config):

```json
{
  "mcpServers": {
    "prospeo": {
      "command": "node",
      "args": ["/absolute/path/to/prospeo-mcp/dist/index.js"],
      "env": {
        "PROSPEO_API_KEY": "your_key"
      }
    }
  }
}
```

**Dev mode** (no build step):

```bash
PROSPEO_API_KEY=your_key npx tsx src/index.ts
```

## Usage Examples

### Find someone's email

```
"Find the verified email for Sarah Park at Mosaic"
```

### Search for prospects

```
"Find CROs at Series B SaaS companies with 51-200 employees"
```

### Enrich a company

```
"Get the tech stack and funding info for stripe.com"
```

### Batch enrich

```
"Enrich these 10 people with verified emails"
```

### Check credits

```
"How many Prospeo credits do I have left?"
```

## Search Filters

Person search supports these filters (all optional):

```json
{
  "person_job_title": { "include": ["CRO", "VP Sales"] },
  "person_seniority": { "include": ["C-Suite", "Vice President", "Director"] },
  "person_department": { "include": ["Sales", "Marketing"] },
  "person_location": { "include": ["United States"] },
  "company_industry": { "include": ["Software Development"] },
  "company_headcount_range": ["51-100", "101-200"],
  "company_technology": { "include": ["Salesforce"] },
  "company_funding": { "stage": ["Series A", "Series B"] },
  "max_person_per_company": 3
}
```

Company search supports: `company_industry`, `company_headcount_range`, `company_location`, `company_funding`, `company_technology`, `company_founded` (min/max).

## Credit Costs

| Action | Credits |
|--------|---------|
| Enrich person | 1 |
| Enrich company | 1 |
| Search (per page, 25 results) | 1 |
| Mobile number | 10 |

## Requirements

- Node.js 18+
- Prospeo API key ([get one here](https://app.prospeo.io))

## License

MIT
