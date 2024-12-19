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
const PAGE_TIMEOUT = 14500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function extractResults(html: string): Promise<SearchResult[]> {
  try {
    const $ = load(html);
    const results: SearchResult[] = [];
    const table = $("#printdiv11 table#example");

    table.find("tbody tr").each((_, row) => {
      const $row = $(row);
      const cells = $row.find("td.search_row");

      if (cells.length >= 4) {
        const result: SearchResult = {
          name: $(cells[0]).text().trim(),
          address: $(cells[1]).text().trim(),
          amount: (() => {
            const rawAmount = $(cells[2]).text().trim();
            const cleanAmount = rawAmount.replace(/[^\d.]/g, "");
            return parseFloat(cleanAmount) || 0;
          })(),
          type: $(cells[3]).text().trim(),
        };

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

async function getBrowser(): Promise<Browser> {
   if (IS_PRODUCTION) {
     // Skip font loading to save time
     chromium.setHeadlessMode = true;
   }

  const executablePath = IS_PRODUCTION
    ? await chromium.executablePath()
    : process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "/usr/bin/google-chrome";

  return await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
    ignoreDefaultArgs: ["--disable-extensions"],
  });
}

async function setupPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();

  if (IS_PRODUCTION) {
    await page.setRequestInterception(true);
  page.on("request", (request) => {
    const resourceType = request.resourceType();
    if (["image", "stylesheet", "font", "media", "other"].includes(resourceType)) {
      request.abort();
    } else {
      request.continue();
    }
  });
  }

  page.on("console", (msg) => console.log("Browser console:", msg.text()));
  page.on("requestfailed", (request) => {
    console.log(`Request failed: ${request.url()}`);
    const failure = request.failure();
    console.log(`Error: ${failure?.errorText ?? "Unknown error"}`);
  });

  await page.setDefaultNavigationTimeout(PAGE_TIMEOUT);
  await page.setDefaultTimeout(PAGE_TIMEOUT);

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
  });

  return page;
}

async function performSearch(page: Page, params: SearchParams): Promise<void> {
  await page.waitForSelector("#company_name, #first_name", {
    timeout: PAGE_TIMEOUT,
  });

  console.log("Form found, proceeding with search");

  if ("companyName" in params) {
    await page.evaluate(() => {
      const element = document.querySelector<HTMLInputElement>("#company_name");
      if (element) element.value = "";
    });
    await page.type("#company_name", params.companyName, { delay: 100 });

    const button = await page.waitForSelector("input.searchbutton_input2", {
      timeout: PAGE_TIMEOUT,
    });
    if (!button) throw new Error("Search button not found");

    await Promise.all([
      page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: PAGE_TIMEOUT,
      }),
      button.click(),
    ]);
  } else {
    await page.evaluate(() => {
      const firstNameEl =
        document.querySelector<HTMLInputElement>("#first_name");
      const surNameEl = document.querySelector<HTMLInputElement>("#sur_name");
      if (firstNameEl) firstNameEl.value = "";
      if (surNameEl) surNameEl.value = "";
    });

    await page.type("#first_name", params.firstName, { delay: 100 });
    await page.type("#sur_name", params.lastName, { delay: 100 });

    const button = await page.waitForSelector("input.searchbutton_input1", {
      timeout: PAGE_TIMEOUT,
    });
    if (!button) throw new Error("Search button not found");

    await Promise.all([
      page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: PAGE_TIMEOUT,
      }),
      button.click(),
    ]);
  }

  try {
    await Promise.race([
      page.waitForSelector("#printdiv11 table#example", {
        timeout: PAGE_TIMEOUT,
      }),
      page.waitForSelector(".no-results", { timeout: PAGE_TIMEOUT }),
      page.waitForSelector("#no-results", { timeout: PAGE_TIMEOUT }),
      page.waitForSelector("text/No records found", { timeout: PAGE_TIMEOUT }),
    ]);
  } catch (error) {
    if (!IS_PRODUCTION) {
      await page.screenshot({ path: "debug-screenshot.png", fullPage: true });
    }
    console.log("Current page URL:", page.url());
    console.log("Page content:", await page.content());
    throw error;
  }
}

async function scrapeWithRetry(
  params: SearchParams,
  retryCount = 0
): Promise<SearchResult[]> {
  const browser = await getBrowser();
  let page: Page | null = null;

  try {
    page = await setupPage(browser);
    console.log("Starting navigation to website");

    await page.goto("https://findunclaimedmoney.com.au", {
      waitUntil: "networkidle0",
      timeout: PAGE_TIMEOUT,
    });

    console.log("Navigation complete, performing search");
    await performSearch(page, params);

    console.log("Search complete, extracting results");
    const html = await page.content();
    return await extractResults(html);
  } catch (error) {
    console.error(`Attempt ${retryCount + 1} failed:`, error);

    if (retryCount < MAX_RETRIES) {
      console.log(
        `Retrying... Attempt ${retryCount + 2} of ${MAX_RETRIES + 1}`
      );
      await sleep(RETRY_DELAY);
      return scrapeWithRetry(params, retryCount + 1);
    }
    throw error;
  } finally {
    if (page) await page.close();
    await browser.close();
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<SearchResponse | SearchError>> {
  try {
    const params = (await request.json()) as SearchParams;

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

    console.log("Starting search with params:", params);
    const results = await scrapeWithRetry(params);
    console.log("Search completed, results:", results.length);

    return NextResponse.json({
      results,
      metadata: {
        totalResults: results.length,
        searchParams: params,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform search",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
