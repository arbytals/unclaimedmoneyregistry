export interface SearchResult {
  name: string;
  address: string;
  amount: number;
  type: string;
}

export interface PersonSearchParams {
  firstName: string;
  lastName: string;
}

export interface CompanySearchParams {
  companyName: string;
}

export type SearchParams = PersonSearchParams | CompanySearchParams;

export interface SearchResponse {
  results: SearchResult[];
  metadata: {
    totalResults: number;
    searchParams: SearchParams;
  };
}

export interface SearchError {
  error: string;
  details?: string;
}

export interface FormData {
  firstName?: string;
  lastName?: string;
  companyName?: string;
}
