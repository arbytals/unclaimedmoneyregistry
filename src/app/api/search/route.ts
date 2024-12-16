import { chromium, type Browser, type Page } from "playwright";
import { load } from "cheerio";
import {
  SearchParams,
  SearchResult,
  SearchResponse,
  SearchError,
} from "@/types/search";
import { NextResponse } from "next/server";

// Utility function for waiting and handling page load
async function waitForPageLoad(page: Page, timeout: number = 120000) {
  try {
    await Promise.all([
      page.waitForLoadState("domcontentloaded", { timeout }),
      page.waitForLoadState("networkidle", { timeout }),
    ]);
  } catch (error) {
    console.warn("Page load wait partial timeout:", error);
  }
}

// Robust result extraction function
function extractResults(html: string): SearchResult[] {
  try {
    const $ = load(html);
    const results: SearchResult[] = [];

    // Target the main results table inside the #printdiv11 div
    const table = $("#printdiv11 table#example");

    // Process each row in tbody
    table.find("tbody tr").each((_, row) => {
      const $row = $(row);
      const cells = $row.find("td.search_row");

      // Only process if we have the expected cells
      if (cells.length >= 4) {
        const result: SearchResult = {
          name: $(cells[0]).text().trim(),
          address: $(cells[1]).text().trim(),
          amount: (() => {
            const rawAmount = $(cells[2]).text().trim();
            // More robust amount parsing
            const cleanAmount = rawAmount.replace(/[^\d.]/g, "");
            return parseFloat(cleanAmount) || 0;
          })(),
          type: $(cells[3]).text().trim(),
        };

        // Additional validation
        if (result.name && result.address && result.amount > 0 && result.type) {
          results.push(result);
        }
      }
    });

    return results;
  } catch (error) {
    console.error("Result extraction error:", error);
    return [];
  }
}

// Comprehensive scraping function with multiple strategies
async function scrapeWebsite(
  page: Page,
  params: SearchParams,
  retries: number = 3
): Promise<SearchResult[]> {
  const searchSelectors = {
    companyNameInput: [
      "#company_name",
      'input[name="company_name"]',
      'input[placeholder="Company Name"]',
    ],
    companySearchButton: [
      "input.searchbutton_input2",
      'button[type="submit"].company-search',
      'input[value="Search Company"]',
    ],
    firstNameInput: [
      "#first_name",
      'input[name="first_name"]',
      'input[placeholder="First Name"]',
    ],
    lastNameInput: [
      "#sur_name",
      'input[name="last_name"]',
      'input[placeholder="Last Name"]',
    ],
    personalSearchButton: [
      "input.searchbutton_input1",
      'button[type="submit"].personal-search',
      'input[value="Search Name"]',
    ],
  };

  // Dynamic selector finding helper
  async function findSelector(selectors: string[]): Promise<string> {
    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 100000 });
        return selector;
      } catch {}
    }
    throw new Error("No valid selector found");
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Scraping attempt ${attempt}...`);

      // Navigate to the website
      await page.goto("https://findunclaimedmoney.com.au", {
        waitUntil: "networkidle",
        timeout: 90000,
      });

      // Wait for initial page load
      await waitForPageLoad(page);

      // Perform search based on input type
      if ("companyName" in params) {
        const companyInputSelector = await findSelector(
          searchSelectors.companyNameInput
        );
        const companyButtonSelector = await findSelector(
          searchSelectors.companySearchButton
        );

        await page.fill(companyInputSelector, params.companyName);
        await page.click(companyButtonSelector);
      } else {
        const firstNameSelector = await findSelector(
          searchSelectors.firstNameInput
        );
        const lastNameSelector = await findSelector(
          searchSelectors.lastNameInput
        );
        const personalButtonSelector = await findSelector(
          searchSelectors.personalSearchButton
        );

        await page.fill(firstNameSelector, params.firstName);
        await page.fill(lastNameSelector, params.lastName);
        await page.click(personalButtonSelector);
      }

      // Wait for results with multiple strategies
      await Promise.race([
        page.waitForSelector("#printdiv11 table#example tbody tr", {
          timeout: 100000,
        }),
        page.waitForSelector(".search-results", { timeout: 80000 }),
      ]);

      // Get page content
      const html = await page.content();

      // Extract results
      const results = extractResults(html);

      // If results found, return them
      if (results.length > 0) {
        return results;
      }

      // If no results, throw error to trigger retry
      if (attempt === retries) {
        throw new Error("No results found after all attempts");
      }

      // Wait before retrying
      await page.waitForTimeout(1500);
    } catch (error) {
      console.error(`Scraping attempt ${attempt} failed:`, error);

      // If last attempt, rethrow the error
      if (attempt === retries) {
        throw error;
      }
    }
  }

  // Fallback return (should not reach here due to earlier throw)
  return [];
}

// Main API handler
export async function POST(
  request: Request
): Promise<NextResponse<SearchResponse | SearchError>> {
  let browser: Browser | null = null;

  try {
    // Parse and validate input parameters
    const params = (await request.json()) as SearchParams;

    // Input validation
    if ("companyName" in params) {
      if (!params.companyName?.trim()) {
        return NextResponse.json(
          { error: "Company name is required" },
          { status: 400 }
        );
      }
    } else {
      if (!params.firstName?.trim() || !params.lastName?.trim()) {
        return NextResponse.json(
          { error: "First name and last name are required" },
          { status: 400 }
        );
      }
    }

    // Launch browser with comprehensive options
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
    });

    // Create a new browser context with custom settings
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      viewport: { width: 1280, height: 800 },
    });

    // Create a new page
    const page = await context.newPage();

    // Set page-level timeouts
    page.setDefaultTimeout(100000);
    page.setDefaultNavigationTimeout(100000);

    // Perform scraping
    const results = await scrapeWebsite(page, params);

    // Return results with metadata
    return NextResponse.json({
      results,
      metadata: {
        totalResults: results.length,
        searchParams: params,
      },
    });
  } catch (error) {
    console.error("Comprehensive API error:", error);

    // Detailed error response
    return NextResponse.json(
      {
        error: "Failed to perform search",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // Ensure browser is closed
    if (browser) await browser.close();
  }
}
