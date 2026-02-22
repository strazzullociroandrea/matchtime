import { TRPCError } from "@trpc/server";
import openBrowser from "@/server/api/routers/api/getInfo/openBrowser";
import asyncJob from "@/server/api/routers/api/asyncJob";
import fs from "fs";
/**
 * Function to navigate to the specified URL, set the category and team, click the download button, and handle the downloaded file.
 *
 * @param downloadPath The temporary path where the file will be downloaded
 * @param category The category to select on the page
 * @param team The team to select on the page
 * @param urlDownloadSite The URL of the site from which to download the Excel file
 * @throws TRPCError if there is an error during the data retrieval process
 * @returns A Promise that resolves when the data retrieval process is complete
 */
const getExcel = async ({
  downloadPath,
  category,
  team,
  urlDownloadSite,
}: {
  downloadPath: string;
  category: string;
  team: string;
  urlDownloadSite: string;
}) => {
  const browser = await asyncJob(
    "Opening browser to retrieve Excel data...",
    () => openBrowser(downloadPath),
    "Browser opened successfully.",
  );
  try {
    await browser.goto(urlDownloadSite, {
      waitUntil: "networkidle2",
    });

    await asyncJob(
      "Setting category to retrieve Excel data...",
      async () => {
        try {
          const categorySelector = "#available-categorie";
          await browser.click(categorySelector);
          const categoryOption = `li[role="option"] ::-p-text(${category})`;
          await browser.waitForSelector(categoryOption, {
            visible: true,
            timeout: 5000,
          });
          await browser.click(categoryOption);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await browser.waitForNetworkIdle();
        } catch (err) {
          throw new Error("Error setting category: " + err);
        }
      },
      "Category set successfully.",
    );

    await asyncJob(
      "Setting team...",
      async () => {
        try {
          const teamSelector = "#available-teams";
          await browser.type(teamSelector, team, { delay: 100 });
          const squadraOption = `li.MuiAutocomplete-option ::-p-text(${team})`;
          await browser.waitForSelector(squadraOption, {
            visible: true,
            timeout: 5000,
          });
          await browser.click(squadraOption);
        } catch (err) {
          throw new Error("Error setting team: " + err);
        }
      },
      "Team set successfully.",
    );

    return await asyncJob(
      "Download match data in Excel format...",
      async () => {
        try {
          const button = await browser.waitForSelector(
            'xpath///button[contains(., "Scarica Excel")]',
          );
          if (!button) throw new Error("Download button not found");
          await button.click();

          return await asyncJob(
            "Waiting for file to download...",
            async () => {
              await new Promise((res) => setTimeout(res, 5000));
              try {
                const files = fs.readdirSync(downloadPath);

                const validFiles = files.filter(
                  (f) =>
                    !f.startsWith(".") &&
                    (f.endsWith(".xlsx") || f.includes("xlsx")),
                );

                const fileName = validFiles[0] as string;
                return fileName;
              } catch (e) {
                throw new Error(
                  `Error during file processing: ${e instanceof Error ? e.message : e}`,
                );
              }
            },
            "File downloaded successfully",
          );
        } catch (err) {
          throw new Error("Error setting team: " + err);
        }
      },
      "Excel data downloaded successfully.",
    );
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve Excel data.",
      cause: error,
    });
  } finally {
    await browser.close();
  }
};

export default getExcel;
