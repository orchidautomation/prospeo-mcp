/**
 * Prospeo API client
 *
 * Docs: https://prospeo.io/api-docs
 * Base URL: https://api.prospeo.io
 * Auth: X-KEY header
 * Rate limit: 150 req/min
 *
 * Credit costs:
 *   - Enrichment: 1 credit per person/company
 *   - Search: 1 credit per page (25 results)
 *   - Bulk: 1 credit per record (up to 50 per call)
 *   - Account info: free
 */
const BASE_URL = "https://api.prospeo.io";
export class ProspeoClient {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async post(endpoint, body) {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-KEY": this.apiKey,
            },
            body: JSON.stringify(body),
        });
        if (res.status === 429) {
            const retryAfter = res.headers.get("x-minute-reset-seconds") ?? "60";
            throw new Error(`Rate limited. Retry after ${retryAfter}s.`);
        }
        const data = (await res.json());
        if (data.error === true) {
            throw new Error(data.error_code ?? data.filter_error ?? "Prospeo API error");
        }
        if (data.req_status === false) {
            throw new Error(data.error_toast ?? "Prospeo API error");
        }
        return data;
    }
    async get(endpoint) {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: "GET",
            headers: {
                "X-KEY": this.apiKey,
            },
        });
        const data = (await res.json());
        if (data.error === true) {
            throw new Error(data.error_code ?? "Prospeo API error");
        }
        return data;
    }
    // ---------------------------------------------------------------------------
    // Person Enrichment — 1 credit
    // POST /enrich-person
    // Response: { error, person, company }
    // ---------------------------------------------------------------------------
    async enrichPerson(params) {
        const { only_verified_email, enrich_mobile, only_verified_mobile, ...data } = params;
        return this.post("/enrich-person", {
            data,
            only_verified_email: only_verified_email ?? true,
            enrich_mobile: enrich_mobile ?? false,
            ...(only_verified_mobile !== undefined && { only_verified_mobile }),
        });
    }
    // ---------------------------------------------------------------------------
    // Bulk Person Enrichment — 1 credit per record, up to 50
    // POST /bulk-enrich-person
    // ---------------------------------------------------------------------------
    async bulkEnrichPerson(params) {
        return this.post("/bulk-enrich-person", {
            data: params.data,
            only_verified_email: params.only_verified_email ?? true,
        });
    }
    // ---------------------------------------------------------------------------
    // Person Search — 1 credit per page (25 results), 200M+ contacts
    // POST /search-person
    // Response: { error, results: [{ person, company }], pagination }
    // ---------------------------------------------------------------------------
    async searchPerson(params) {
        return this.post("/search-person", {
            filters: params.filters,
            page: params.page ?? 1,
        });
    }
    // ---------------------------------------------------------------------------
    // Company Enrichment — 1 credit
    // POST /enrich-company
    // ---------------------------------------------------------------------------
    async enrichCompany(params) {
        return this.post("/enrich-company", {
            data: params,
        });
    }
    // ---------------------------------------------------------------------------
    // Bulk Company Enrichment — 1 credit per record, up to 50
    // POST /bulk-enrich-company
    // ---------------------------------------------------------------------------
    async bulkEnrichCompany(params) {
        return this.post("/bulk-enrich-company", {
            data: params.data,
        });
    }
    // ---------------------------------------------------------------------------
    // Company Search — 1 credit per page (25 results), 30M+ companies
    // POST /search-company
    // ---------------------------------------------------------------------------
    async searchCompany(params) {
        return this.post("/search-company", {
            filters: params.filters,
            page: params.page ?? 1,
        });
    }
    // ---------------------------------------------------------------------------
    // Account Info — free
    // GET /account-information
    // ---------------------------------------------------------------------------
    async accountInfo() {
        return this.get("/account-information");
    }
}
