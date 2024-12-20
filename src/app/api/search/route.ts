import { load } from "cheerio";
import type {
  SearchParams,
  SearchResult,
  SearchResponse,
  SearchError,
} from "@/types/search";
import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer, { Browser, Page } from "puppeteer-core";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const MAX_RETRIES = 4;
const RETRY_DELAY = 200;
const PAGE_TIMEOUT = 30000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getBrowser(): Promise<Browser> {
  const options = {
    args: [
      ...chromium.args, 
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // Important for Render
      "--disable-extensions",
    ],
    defaultViewport: {
      width: 1024,
      height: 768,
    },
    executablePath: IS_PRODUCTION
      ? await chromium.executablePath()
      : process.platform === "win32"
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "/usr/bin/google-chrome",
    headless: true,
    ignoreHTTPSErrors: true,
  };

  return await puppeteer.launch(options);
}

async function setupPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();

  // Minimal request interception
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const resourceType = request.resourceType();
    if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
      request.abort();
    } else {
      request.continue();
    }
  });

  // Set minimal required headers
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  );

  return page;
}

async function performSearch(page: Page, params: SearchParams): Promise<void> {
  try {
    await page.goto("https://findunclaimedmoney.com.au", {
      waitUntil: "networkidle0",
      timeout: PAGE_TIMEOUT,
    });

    // Wait for either input to be available
    await Promise.race([
      page.waitForSelector("#company_name"),
      page.waitForSelector("#first_name"),
    ]);

    if ("companyName" in params) {
      await page.type("#company_name", params.companyName);
      await Promise.all([
        page.click("input.searchbutton_input2"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);
    } else {
      await page.type("#first_name", params.firstName);
      await page.type("#sur_name", params.lastName);
      await Promise.all([
        page.click("input.searchbutton_input1"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);
    }

    // Wait for results or no results indicator
    await page.waitForFunction(
      () => {
        const table = document.querySelector("#printdiv11 table#example");
        const noResults = document.querySelector(".no-results, #no-results");
        return table || noResults;
      },
      { timeout: PAGE_TIMEOUT }
    );
  } catch (error) {
    console.error(
      "Search error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
}

async function extractResults(html: string): Promise<SearchResult[]> {
  const $ = load(html);
  const results: SearchResult[] = [];

  $("#printdiv11 table#example tbody tr").each((_, row) => {
    const cells = $(row).find("td.search_row");
    if (cells.length >= 4) {
      const result: SearchResult = {
        name: $(cells[0]).text().trim(),
        address: $(cells[1]).text().trim(),
        amount:
          parseFloat(
            $(cells[2])
              .text()
              .replace(/[^\d.]/g, "")
          ) || 0,
        type: $(cells[3]).text().trim(),
      };

      if (result.name && result.amount > 0) {
        results.push(result);
      }
    }
  });

  return results;
}

async function scrapeWithRetry(
  params: SearchParams,
  retryCount = 0
): Promise<SearchResult[]> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await getBrowser();
    page = await setupPage(browser);

    await performSearch(page, params);

    const content = await page.content();
    return await extractResults(content);
  } catch (error) {
    console.error(
      `Attempt ${retryCount + 1} failed:`,
      error instanceof Error ? error.message : "Unknown error"
    );

    if (retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY * (retryCount + 1));
      return scrapeWithRetry(params, retryCount + 1);
    }
    throw error;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<SearchResponse | SearchError>> {
  try {
    const params = (await request.json()) as SearchParams;

    // Validate params
    if ("companyName" in params) {
      if (!params.companyName?.trim()) {
        return NextResponse.json(
          { error: "Company name is required" },
          { status: 400 }
        );
      }
    } else if (!params.firstName?.trim() || !params.lastName?.trim()) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    const results = await scrapeWithRetry(params);

    return NextResponse.json({
      results,
      metadata: {
        totalResults: results.length,
        searchParams: params,
      },
    });
  } catch (error) {
    // Only log minimal error information
    console.error(
      "Search failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      {
        error: "Failed to perform search",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
