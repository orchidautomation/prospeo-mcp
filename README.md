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
claude mcp add prospeo -- node /absolute/path/to/prospeo-mcp/build/index.js -e PROSPEO_API_KEY=your_key
```

**Claude Desktop / Cursor / Windsurf** (add to your MCP config):

```json
{
  "mcpServers": {
    "prospeo": {
      "command": "node",
      "args": ["/absolute/path/to/prospeo-mcp/build/index.js"],
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

## Pluxx

This repo now includes a Pluxx source project so the Prospeo MCP can be built into host-native plugin bundles for Claude Code, Cursor, Codex, and OpenCode.

```bash
npm run build
pluxx doctor
pluxx lint
pluxx test --target claude-code cursor codex opencode
```

Use `pluxx install --dry-run --target claude-code cursor codex opencode` to regenerate the current local install surfaces and reload notes.

### Generated Bundles

- `dist/claude-code/.claude-plugin/plugin.json`
- `dist/cursor/.cursor-plugin/plugin.json`
- `dist/codex/.codex-plugin/plugin.json`
- `dist/opencode/package.json`

### Publish Surfaces

Use `pluxx publish --dry-run --json` to preview the published release artifacts and installer URLs.

Pluxx publish currently plans these release channels:

- npm package: [`opencode-prospeo`](https://www.npmjs.com/package/opencode-prospeo)
- GitHub release: [`orchidautomation/prospeo-mcp` tag `v1.0.0`](https://github.com/orchidautomation/prospeo-mcp/releases/tag/v1.0.0)

### Installer Links

After `pluxx publish` succeeds, the GitHub release is expected to include these installer assets:

- [install-all.sh](https://github.com/orchidautomation/prospeo-mcp/releases/download/v1.0.0/install-all.sh)
- [install-claude-code.sh](https://github.com/orchidautomation/prospeo-mcp/releases/download/v1.0.0/install-claude-code.sh)
- [install-cursor.sh](https://github.com/orchidautomation/prospeo-mcp/releases/download/v1.0.0/install-cursor.sh)
- [install-codex.sh](https://github.com/orchidautomation/prospeo-mcp/releases/download/v1.0.0/install-codex.sh)
- [install-opencode.sh](https://github.com/orchidautomation/prospeo-mcp/releases/download/v1.0.0/install-opencode.sh)

### Release Archives

Pluxx publish also plans versioned and latest archives for each target:

- `prospeo-claude-code-v1.0.0.tar.gz`
- `prospeo-claude-code-latest.tar.gz`
- `prospeo-cursor-v1.0.0.tar.gz`
- `prospeo-cursor-latest.tar.gz`
- `prospeo-codex-v1.0.0.tar.gz`
- `prospeo-codex-latest.tar.gz`
- `prospeo-opencode-v1.0.0.tar.gz`
- `prospeo-opencode-latest.tar.gz`

### Install with Pluxx

```bash
pluxx test --install --target codex --trust
pluxx verify-install --target codex
```

`--trust` is required because this plugin installs a `sessionStart` hook that runs `scripts/check-env.sh`.

The Pluxx source of truth lives in `pluxx.config.ts`, `INSTRUCTIONS.md`, `skills/`, `commands/`, and `.pluxx/mcp.json`.

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
