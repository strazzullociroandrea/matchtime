import puppeteer, { type Browser, type Page } from "puppeteer";
import { TRPCError } from "@trpc/server";
/**
 * Function to open a browser using Puppeteer, set up the download behavior, and return the page instance.
 *
 * @param downloadPath The temporary path where the file will be downloaded
 * @return A Promise that resolves to the Page instance of the opened browser
 * @throws TRPCError if there is an error during the browser opening process
 */
const openBrowser = async (downloadPath: string): Promise<Page> => {
  try {
    const browser: Browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
    const page: Page = await browser.newPage();

    const client = await page.createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadPath,
    });
    return page;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to open browser.",
      cause: err,
    });
  }
};

export default openBrowser;
