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
export declare class ProspeoClient {
    private apiKey;
    constructor(apiKey: string);
    private post;
    private get;
    enrichPerson(params: {
        first_name?: string;
        last_name?: string;
        full_name?: string;
        company_name?: string;
        company_website?: string;
        company_linkedin_url?: string;
        linkedin_url?: string;
        email?: string;
        person_id?: string;
        only_verified_email?: boolean;
        enrich_mobile?: boolean;
        only_verified_mobile?: boolean;
    }): Promise<ProspeoEnrichPersonResponse>;
    bulkEnrichPerson(params: {
        data: Array<{
            identifier: string;
            first_name?: string;
            last_name?: string;
            full_name?: string;
            company_name?: string;
            company_website?: string;
            linkedin_url?: string;
        }>;
        only_verified_email?: boolean;
    }): Promise<ProspeoBulkEnrichResponse>;
    searchPerson(params: {
        filters: Record<string, unknown>;
        page?: number;
    }): Promise<ProspeoSearchPersonResponse>;
    enrichCompany(params: {
        domain?: string;
        company_name?: string;
    }): Promise<ProspeoEnrichCompanyResponse>;
    bulkEnrichCompany(params: {
        data: Array<{
            identifier: string;
            domain?: string;
            company_name?: string;
        }>;
    }): Promise<ProspeoBulkEnrichCompanyResponse>;
    searchCompany(params: {
        filters: Record<string, unknown>;
        page?: number;
    }): Promise<ProspeoSearchCompanyResponse>;
    accountInfo(): Promise<ProspeoAccountResponse>;
}
export interface ProspeoPersonObject {
    person_id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    linkedin_url: string | null;
    current_job_title: string | null;
    current_job_key: string | null;
    headline: string | null;
    linkedin_member_id: string | null;
    last_job_change_detected_at: string | null;
    job_history: Array<{
        title: string;
        company_name: string;
        logo_url: string | null;
        current: boolean;
        start_year: number | null;
        start_month: number | null;
        end_year: number | null;
        end_month: number | null;
        duration_in_months: number | null;
        departments: string[];
        seniority: string | null;
        company_id: string | null;
        job_key: string | null;
    }>;
    mobile: {
        status: string;
        revealed: boolean;
        mobile: string | null;
        mobile_national: string | null;
        mobile_international: string | null;
        mobile_country: string | null;
        mobile_country_code: string | null;
    } | null;
    email: {
        status: string;
        revealed: boolean;
        email: string | null;
        verification_method: string | null;
        email_mx_provider: string | null;
    } | null;
    location: {
        country: string | null;
        country_code: string | null;
        state: string | null;
        city: string | null;
        time_zone: string | null;
        time_zone_offset: number | null;
    } | null;
    skills: string[];
}
export interface ProspeoCompanyObject {
    company_id: string;
    name: string;
    website: string | null;
    domain: string | null;
    description: string | null;
    description_seo: string | null;
    description_ai: string | null;
    type: string | null;
    industry: string | null;
    employee_count: number | null;
    employee_range: string | null;
    location: {
        country: string | null;
        state: string | null;
        city: string | null;
        raw_address: string | null;
    } | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    facebook_url: string | null;
    crunchbase_url: string | null;
    phone_hq: {
        phone_hq: string | null;
    } | null;
    founded: number | null;
    revenue_range: {
        min: number | null;
        max: number | null;
    } | null;
    revenue_range_printed: string | null;
    keywords: string[];
    funding: {
        count: number;
        total_funding: number | null;
        total_funding_printed: string | null;
        latest_funding_date: string | null;
        latest_funding_stage: string | null;
        funding_events: Array<{
            amount: number | null;
            amount_printed: string | null;
            raised_at: string | null;
            stage: string | null;
        }>;
    } | null;
    technology: {
        count: number;
        technology_names: string[];
    } | null;
    job_postings: {
        active_count: number;
        active_titles: string[];
    } | null;
}
export interface ProspeoEnrichPersonResponse {
    error: boolean;
    free_enrichment: boolean;
    person: ProspeoPersonObject;
    company: ProspeoCompanyObject | null;
}
export interface ProspeoBulkEnrichResponse {
    error: boolean;
    response: {
        matched: Array<{
            identifier: string;
            person: ProspeoPersonObject;
            company: ProspeoCompanyObject | null;
        }>;
        not_matched: string[];
        invalid_datapoints: string[];
        total_cost: number;
    };
}
export interface ProspeoSearchPersonResponse {
    error: boolean;
    results: Array<{
        person: ProspeoPersonObject;
        company: ProspeoCompanyObject | null;
    }>;
    pagination: {
        current_page: number;
        per_page: number;
        total_page: number;
        total_count: number;
    };
}
export interface ProspeoEnrichCompanyResponse {
    error: boolean;
    company: ProspeoCompanyObject;
}
export interface ProspeoBulkEnrichCompanyResponse {
    error: boolean;
    response: {
        matched: Array<{
            identifier: string;
            company: ProspeoCompanyObject;
        }>;
        not_matched: string[];
        total_cost: number;
    };
}
export interface ProspeoSearchCompanyResponse {
    error: boolean;
    results: Array<{
        company: ProspeoCompanyObject;
    }>;
    pagination: {
        current_page: number;
        per_page: number;
        total_page: number;
        total_count: number;
    };
}
export interface ProspeoAccountResponse {
    error: boolean;
    response: {
        current_plan: string;
        remaining_credits: number;
        used_credits: number;
        current_team_members: number;
        next_quota_renewal_days: number;
        next_quota_renewal_date: string;
    };
}
