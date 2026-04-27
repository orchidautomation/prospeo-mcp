#!/usr/bin/env node

/**
 * Prospeo MCP Server
 *
 * MCP server for Prospeo's lead sourcing API — person/company search and email enrichment.
 *
 * Install:
 *   claude mcp add prospeo node /path/to/prospeo-mcp/build/index.js
 *
 * Env:
 *   PROSPEO_API_KEY — required, get from https://app.prospeo.io/api
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ProspeoClient } from "./prospeo-client.js";

const apiKey = process.env.PROSPEO_API_KEY;
if (!apiKey) {
  console.error("PROSPEO_API_KEY environment variable is required");
  process.exit(1);
}

const client = new ProspeoClient(apiKey);
const server = new McpServer({
  name: "prospeo",
  version: "1.0.0",
});

// Helper: safely stringify any value, never return undefined
function safeJson(value: unknown): string {
  const result = JSON.stringify(value, null, 2);
  return result ?? '{"error": "empty response"}';
}

// ==========================================================================
// Tool 1: prospeo_enrich_person
// ==========================================================================

server.tool(
  "prospeo_enrich_person",
  "Enrich a person to get their verified work email, title, LinkedIn, mobile, and employment history. Provide name + company, OR LinkedIn URL, OR email, OR person_id. Costs 1 credit.",
  {
    first_name: z.string().optional().describe("First name"),
    last_name: z.string().optional().describe("Last name"),
    full_name: z.string().optional().describe("Full name (alternative to first + last)"),
    company_name: z.string().optional().describe("Company name"),
    company_website: z.string().optional().describe("Company domain (e.g. 'acme.com')"),
    linkedin_url: z.string().optional().describe("LinkedIn profile URL (standalone — no name/company needed)"),
    email: z.string().optional().describe("Email to enrich (standalone)"),
    person_id: z.string().optional().describe("Person ID from search results (standalone)"),
    only_verified_email: z.boolean().optional().describe("Only return verified emails (default true)"),
    enrich_mobile: z.boolean().optional().describe("Also find mobile number (costs 10 credits, default false)"),
  },
  async (params) => {
    try {
      const result = await client.enrichPerson(params);
      return {
        content: [{ type: "text" as const, text: safeJson({ person: result.person, company: result.company }) }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: safeJson({ error: message }) }],
      };
    }
  }
);

// ==========================================================================
// Tool 2: prospeo_bulk_enrich_person
// ==========================================================================

server.tool(
  "prospeo_bulk_enrich_person",
  "Enrich up to 50 people in one call. Each record needs name + company or LinkedIn URL. Returns matched/unmatched/invalid lists. Costs 1 credit per matched record.",
  {
    people: z.array(z.object({
      identifier: z.string().describe("Unique ID for this record (used to match results)"),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      full_name: z.string().optional(),
      company_name: z.string().optional(),
      company_website: z.string().optional(),
      linkedin_url: z.string().optional(),
    })).min(1).max(50).describe("Array of people to enrich (max 50)"),
    only_verified_email: z.boolean().optional().describe("Only return verified emails (default true)"),
  },
  async ({ people, only_verified_email }) => {
    try {
      const result = await client.bulkEnrichPerson({
        data: people,
        only_verified_email,
      });
      return {
        content: [{ type: "text" as const, text: safeJson(result.response) }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: safeJson({ error: message }) }],
      };
    }
  }
);

// ==========================================================================
// Tool 3: prospeo_search_person
// ==========================================================================

server.tool(
  "prospeo_search_person",
  `Search 200M+ professional contacts. Returns 25 results per page. Costs 1 credit per page.
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
- max_person_per_company: 3`,
  {
    filters: z.record(z.unknown()).describe("Search filters object — see tool description for structure"),
    page: z.number().optional().describe("Page number (default 1, 25 results per page)"),
  },
  async ({ filters, page }) => {
    try {
      const result = await client.searchPerson({ filters, page });
      return {
        content: [{
          type: "text" as const,
          text: safeJson({ results: result.results, pagination: result.pagination }),
        }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: safeJson({ error: message }) }],
      };
    }
  }
);

// ==========================================================================
// Tool 4: prospeo_enrich_company
// ==========================================================================

server.tool(
  "prospeo_enrich_company",
  "Enrich a company by domain or name. Returns industry, description, employee count, funding, technologies, revenue, and location. Costs 1 credit.",
  {
    domain: z.string().optional().describe("Company domain (e.g. 'acme.com')"),
    company_name: z.string().optional().describe("Company name (use domain when possible for better matching)"),
  },
  async (params) => {
    try {
      const result = await client.enrichCompany(params);
      return {
        content: [{ type: "text" as const, text: safeJson(result.company) }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: safeJson({ error: message }) }],
      };
    }
  }
);

// ==========================================================================
// Tool 5: prospeo_search_company
// ==========================================================================

server.tool(
  "prospeo_search_company",
  `Search 30M+ companies by industry, size, location, funding round, and technology stack. Returns 25 results per page. Costs 1 credit per page.

Filter structure (all optional):
- company.names.include: ["Company"]
- company.websites.include: ["domain.com"]
- company_industry.include: ["Software Development"]
- company_headcount_range: ["51-100", "101-200"]
- company_location.include: ["United States"]
- company_funding.stage: ["Series A", "Series B"]
- company_technology.include: ["React", "Python"]
- company_founded.min: 2020, company_founded.max: 2025`,
  {
    filters: z.record(z.unknown()).describe("Search filters object — see tool description for structure"),
    page: z.number().optional().describe("Page number (default 1)"),
  },
  async ({ filters, page }) => {
    try {
      const result = await client.searchCompany({ filters, page });
      return {
        content: [{
          type: "text" as const,
          text: safeJson({ results: result.results, pagination: result.pagination }),
        }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: safeJson({ error: message }) }],
      };
    }
  }
);

// ==========================================================================
// Tool 6: prospeo_bulk_enrich_company
// ==========================================================================

server.tool(
  "prospeo_bulk_enrich_company",
  "Enrich up to 50 companies in one call. Returns industry, tech stack, funding, employee count for each. Costs 1 credit per matched record.",
  {
    companies: z.array(z.object({
      identifier: z.string().describe("Unique ID for this record"),
      domain: z.string().optional().describe("Company domain"),
      company_name: z.string().optional().describe("Company name"),
    })).min(1).max(50).describe("Array of companies to enrich (max 50)"),
  },
  async ({ companies }) => {
    try {
      const result = await client.bulkEnrichCompany({ data: companies });
      return {
        content: [{ type: "text" as const, text: safeJson(result.response) }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: safeJson({ error: message }) }],
      };
    }
  }
);

// ==========================================================================
// Tool 7: prospeo_account_info
// ==========================================================================

server.tool(
  "prospeo_account_info",
  "Check your Prospeo account: remaining credits, plan, usage, and next renewal date. Free — no credits consumed.",
  {},
  async () => {
    try {
      const result = await client.accountInfo();
      return {
        content: [{ type: "text" as const, text: safeJson(result.response) }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: safeJson({ error: message }) }],
      };
    }
  }
);

// ==========================================================================
// Start
// ==========================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Prospeo MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
