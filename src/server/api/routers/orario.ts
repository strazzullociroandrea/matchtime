import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import {TRPCError} from "@trpc/server";
import {type Page, type Browser} from "puppeteer";
import ExcelJS from 'exceljs';
import {unstable_cache} from 'next/cache';

interface PartitaVolley {
    Giornata: string | number;
    Numero: string | number;
    Data: string;
    Ora: string;
    Casa: string;
    Trasferta: string;
    Indirizzo: string;
    Done: boolean;
}

const jobWithMessage = async <T>(startMessage: string, job: () => T | Promise<T>, endMessage: string) => {
    try {
        console.log(`[LOG] ${startMessage}`);
        const result = await job();
        console.log(`[LOG] ${endMessage}`);
        return result;
    } catch (e) {
        if (e instanceof TRPCError) {
            console.error(`[ERROR] tRPC Error: ${e.message},\ncause: ${e.cause}`);
            throw e;
        }
        console.log("[ERROR] Error during job execution: " + e);
        throw new Error(`Error during job execution: ${e}`,
            {cause: e instanceof Error ? e : undefined});
    }
}

const openBrowser = async (downloadPath: string): Promise<Page> => {
    try {
        const browser: Browser = await puppeteer.launch({
            headless: true
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
                const files = fs.readdirSync(downloadPath);
                const validFiles = files.filter(f => !f.startsWith('.') && (f.endsWith('.xlsx') || f.includes('xlsx')));
                if (validFiles.length === 0) throw new Error("File non scaricato");
                return validFiles[0] as string;
            }, "File downloaded successfully");
        }, "Data downloaded successfully");

    } catch (err) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed get data.',
            cause: err,
        });
    } finally {
        await page.close();
    }
}

const isDayPassed = (dateStr: string): boolean => {
    const [day, month, year] = dateStr.split('/').map(Number);
    if (!day || !month || !year) return false;
    const matchDate = new Date(year, month - 1, day);
    const today = new Date();
    return matchDate < today;
}

const readFile = async (downloadPath: string, fileName: string): Promise<PartitaVolley[]> => {
    const fullPath = path.join(downloadPath, fileName);
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
                if (typeof cell === 'object' && 'result' in cell) return String(cell.result ?? "").trim();
                if (cell instanceof Date) return cell.toLocaleDateString('it-IT');
                return String(cell).trim();
            };

            const dataPartita = getVal(3);
            match.push({
                Giornata: getVal(1),
                Numero: getVal(2),
                Data: dataPartita,
                Ora: getVal(4),
                Casa: getVal(5),
                Trasferta: getVal(6),
                Indirizzo: getVal(7),
                Done: isDayPassed(dataPartita)
            });
        }
    });

    fs.unlinkSync(fullPath);
    return match;
}

export const orarioRouter = createTRPCRouter({
    getInfo: publicProcedure
        .query(async () => {
            const getCachedMatches = unstable_cache(
                async () => {
                    const downloadPath = path.join(process.cwd(), "public", "download");
                    if (!fs.existsSync(downloadPath))
                        fs.mkdirSync(downloadPath, {recursive: true});

                    const page = await openBrowser(downloadPath);
                    const fileName = await getExcel(page, downloadPath);
                    const matches = await readFile(downloadPath, fileName);

                    if (!matches || matches.length === 0) {
                        throw new Error("Data not found.");
                    }

                    const browser = page.browser();
                    await browser.close();

                    return matches;
                },
                ['volleyball-matches-data'],
                {
                    revalidate: 86400,
                    tags: ['matches']
                }
            );

            try {
                return await jobWithMessage("Retrieving cached data...", async () => await getCachedMatches(), "Cached data retrieved successfully");
            } catch (err) {
                console.log("[ERROR] Scraping fallito, riproverò al prossimo caricamento: " + err);
                return [];
            }
        })
});