import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import {TRPCError} from "@trpc/server";
import {type Page, type Browser} from "puppeteer";
import ExcelJS from 'exceljs';
import {unstable_cache} from 'next/cache';


/**
 * Interface representing a volleyball match, containing details such as the matchday, number, date, time, home team, away team, and address.
 */
interface PartitaVolley {
    Giornata: string | number;
    Numero: string | number;
    Data: string;
    Ora: string;
    Casa: string;
    Trasferta: string;
    Indirizzo: string;
    Done: boolean;
    ThisWeek: boolean;
    IsHome: boolean;
}

/**
 * Function that wraps a job with start and end messages, useful for logging and user feedback. The job can be synchronous or asynchronous.
 *
 * @param startMessage Initial Message to indicate the start of the job
 * @param job Function that performs the job, can return a value or a Promise
 * @param endMessage Final Message to indicate the completion of the job
 *
 * @return The result of the job, if it returns a value or a Promise that resolves to a value
 */
const jobWithMessage = async <T>(startMessage: string, job: () => T | Promise<T>, endMessage: string) => {
    const formattedDate = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    try {
        console.log(`${formattedDate} - [LOG] ${startMessage}`);
        const result = await job();
        console.log(`${formattedDate} - [LOG] ${endMessage}`);
        return result;
    } catch (e) {
        if (e instanceof TRPCError) {
            console.error(`${formattedDate} - [ERROR] tRPC Error: ${e.message},\ncause: ${e.cause}`);
            throw e;
        }
        console.log(`${formattedDate} - [ERROR] Error during job execution: ${e}`);
        throw new Error(`Error during job execution: ${e}`,
            {cause: e instanceof Error ? e : undefined});

    }
}

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
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
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
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to open browser.',
            cause: err,
        });
    }
}

/**
 * Function to navigate to the specified URL, set the category and team, click the download button, and handle the downloaded file.
 *
 * @param page The Page instance of the opened browser
 * @param downloadPath The temporary path where the file will be downloaded
 * @throws TRPCError if there is an error during the data retrieval process
 * @returns A Promise that resolves when the data retrieval process is complete
 */
const getExcel = async (page: Page, downloadPath: string) => {
    try {

        await page.goto(process.env.URL_DOWNLOAD_SITE!, {waitUntil: 'networkidle2'});

        await jobWithMessage("Setting category...", async () => {
            try {
                const categorySelector = '#available-categorie';
                await page.click(categorySelector);
                const targetCategory = process.env.CATEGORY_TARGET;
                const categoryOption = `li[role="option"] ::-p-text(${targetCategory})`;
                await page.waitForSelector(categoryOption, {visible: true, timeout: 5000});
                await page.click(categoryOption);
                await new Promise(resolve => setTimeout(resolve, 2000));
                await page.waitForNetworkIdle();
            } catch (err) {
                throw new Error("Error setting category: " + err);
            }

        }, "Category set successfully");

        await jobWithMessage("Setting team...", async () => {
            try {
                const teamSelector = '#available-teams';
                const targetSquadra = process.env.TEAM_CATEGORY!;
                console.log("Ricerca squadra: " + targetSquadra);
                await page.type(teamSelector, targetSquadra, {delay: 100});
                const squadraOption = `li.MuiAutocomplete-option ::-p-text(${targetSquadra})`;
                await page.waitForSelector(squadraOption, {visible: true, timeout: 5000});
                await page.click(squadraOption);
            } catch (err) {
                throw new Error("Error setting team: " + err);
            }

        }, "Team set successfully");

        return await jobWithMessage("Downloading data...", async () => {

            const button = await page.waitForSelector('xpath///button[contains(., "Scarica Excel")]');
            if (!button) throw new Error("Download button not found");
            await button.click();

            return await jobWithMessage("Waiting for file to download...", async () => {

                    await new Promise(res => setTimeout(res, 5000));
                    try {
                        const files = fs.readdirSync(downloadPath);

                        const validFiles = files.filter(f =>
                            !f.startsWith('.') &&
                            (f.endsWith('.xlsx') || f.includes('xlsx'))
                        );

                        const fileName = validFiles[0] as string;
                        return fileName;

                    } catch
                        (e) {
                        throw new Error(`Error during file processing: ${e instanceof Error ? e.message : e}`);
                    }
                }
                ,
                "File downloaded successfully"
            )
                ;

        }, "Data downloaded successfully");

    } catch
        (err) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed get data.',
            cause: err,
        });
    } finally {
        await page.close();
    }
}

/**
 * Function to check if the date of the match has already passed compared to the current date. It takes a date string in the format "dd/MM/yyyy" and compares it with today's date.
 * @param dateStr A string representing the date of the match in the format "dd/MM/yyyy"
 * @return A boolean value indicating whether the match date has already passed (true) or is still upcoming (false)
 */
const isDayPassed = (dateStr: string): boolean => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const matchDate = new Date(year, month - 1, day);
    const today = new Date();
    return matchDate < today;
}

/**
 * Function to check if the match date is in the current week.
 * @param dateStr A string representing the date of the match in the format "dd/MM/yyyy"
 * @returns A boolean value indicating whether the match date is in the current week (true) or not (false)
 */
const thisWeek = (dateStr: string): boolean => {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();
    const [day, month, year] = dateStr.split('/').map(Number);
                    
    const sameYear: boolean = year === todayYear;
    const sameMonth: boolean = month === todayMonth;
    const sameWeek: boolean = Math.abs(day - todayDay) <= 7;
                    
    return sameYear && sameMonth && sameWeek;
}
/**
 * Function to read the downloaded Excel file, extract the relevant data, and return it as an array of PartitaVolley objects.
 *
 * @param downloadPath The path where the file was downloaded
 * @param fileName The name of the downloaded file
 * @returns A Promise that resolves to an array of PartitaVolley objects containing the extracted data
 * @throws Error if the file is not found, is empty, or if there is an error during file processing
 */
const readFile = async (downloadPath: string, fileName: string): Promise<PartitaVolley[]> => {
    const fullPath = path.join(downloadPath, fileName);
    let ready = false;

    for (let i = 0; i < 10; i++) {
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 0) {
            ready = true;
            break;
        }
        await new Promise(res => setTimeout(res, 1000));
    }

    if (!ready) throw new Error("File not found or empty");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(fullPath);
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) throw new Error("Internal error: Worksheet not found");

    const match: PartitaVolley[] = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 3) {

            const getVal = (col: number): string => {
                const cell = row.getCell(col).value;

                if (cell === null || cell === undefined) return "";

                if (typeof cell === 'object' && 'result' in cell) {
                    return String(cell.result ?? "").trim();
                }
                if (cell instanceof Date) {
                    return cell.toLocaleDateString('it-IT');
                }

                return String(cell).trim();
            };

            const partita: PartitaVolley = {
                Giornata: getVal(1),
                Numero: getVal(2),
                Data: getVal(3),
                Ora: getVal(4),
                Casa: getVal(5),
                Trasferta: getVal(6),
                Indirizzo: getVal(7),
                Done: isDayPassed(getVal(3)),
                ThisWeek: thisWeek(getVal(3)),
                IsHome: getVal(7).toLowerCase() === process.env.HOME_TEAM_PLACE!.toLowerCase()
            };

            match.push(partita);
        }
    });

    return match;
}

/**
 * Function to sort the matches based on their status (Done or Not Done).
 * @param matches An array of PartitaVolley objects representing the matches to be sorted
 * @returns A sorted array of PartitaVolley objects.
 */
const orderByStatus = (matches: PartitaVolley[]): PartitaVolley[] => {
    return matches.sort((a,b)=>{
        if(a.Done === b.Done) return 0;
        return a.Done ? 1 : -1;
    })
}

let isWorking = false; 
/**
 * tRPC router for handling requests related to retrieving volleyball match information. It defines a single procedure `getInfo` that performs the entire process of opening a browser, navigating to the specified URL, setting the category and team, downloading the Excel file, and processing it to extract the relevant data.
 */
export const orarioRouter = createTRPCRouter({
    getInfo: publicProcedure
        .query(async () => {

            const getCachedMatches = unstable_cache(
                async () => {
                    if (isWorking) {
                        throw new TRPCError({
                            code: 'TOO_MANY_REQUESTS',
                            message: 'Data retrieval in progress. Please try again later.',
                        });
                    }

                    try {
                        isWorking = true;

                        const downloadPath = path.join(process.cwd(), "public", "download");
                        if (!fs.existsSync(downloadPath))
                            fs.mkdirSync(downloadPath, {recursive: true});

                        const page = await openBrowser(downloadPath);
                        const fileName = await getExcel(page, downloadPath);
                        const matches = await readFile(downloadPath, fileName);

                        try {
                            fs.unlinkSync(path.join(downloadPath, fileName));
                        } catch (e) {
                        }

                        const orderedMatches = orderByStatus(matches);
                        const lastUpdate = new Date();
                        return { matches: orderedMatches, lastUpdate };
                    } finally {
                        isWorking = false;
                    }
                },
                ['volleyball-matches-data'],
                {
                    revalidate: 86400,
                    tags: ['matches']
                }
            );

            try {
                return await jobWithMessage("Starting data retrieval process...", async () => {
                    const data = await getCachedMatches();
                    return data;
                }, "Data retrieval process completed successfully");

            } catch (err) {
                if (err instanceof TRPCError) throw err;

                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to retrieve match data.',
                    cause: err,
                });
            }
        }) 
});