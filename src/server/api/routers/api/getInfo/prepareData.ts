import { TRPCError } from "@trpc/server";
import getExcel from "@/server/api/routers/api/getInfo/getExcel";
import asyncJob from "@/server/api/routers/api/asyncJob";
import { PartitaVolley } from "@/lib/schemas/match-schema";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

/**
 * Function to get the value of an Excel cell, handling different types of cell values (null, rich text, etc.)
 * @param cell  The ExcelJS Cell object from which to extract the value
 * @returns A string representation of the cell's value, or an empty string if the cell is null or undefined
 */
const getVal = (cell: ExcelJS.Cell): string => {
  if (cell.value === null || cell.value === undefined) {
    return "NA";
  }
  if (typeof cell.value === "object" && "richText" in cell.value) {
    return cell.value.richText.map((part) => part.text).join("");
  }
  return String(cell.value);
};

/**
 * Function to check if the date of the match has already passed compared to the current date. It takes a date string in the format "dd/MM/yyyy" and compares it with today's date.
 * @param dateStr A string representing the date of the match in the format "dd/MM/yyyy"
 * @return A boolean value indicating whether the match date has already passed (true) or is still upcoming (false)
 */
const isDayPassed = (dateStr: string): boolean => {
  const [day, month, year] = dateStr.split("/").map(Number);
  const matchDate = new Date(year, month - 1, day);
  const today = new Date();
  return matchDate < today;
};

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
  const [day, month, year] = dateStr.split("/").map(Number);

  const sameYear: boolean = year === todayYear;
  const sameMonth: boolean = month === todayMonth;
  const sameWeek: boolean = Math.abs(day - todayDay) <= 7;

  return sameYear && sameMonth && sameWeek;
};

/**
 * Function to format the place string by splitting it on hyphens, trimming whitespace, and joining the parts with commas. If the input string is empty or null, it returns "NA".
 * @param place A string representing the place of the match, which may contain hyphens and extra whitespace
 * @returns  A formatted string with the place information, where hyphens are replaced with commas and extra whitespace is removed. If the input is empty or null, it returns "NA".
 */
const formattedPlace = (place: string): string => {
  if (!place || place === "NA") return "NA";

  return place
    .split("-")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => {
      const items: string[] = item.split(" ");
      const components: string[] = items.map(
        (comp) => comp.charAt(0).toUpperCase() + comp.slice(1).toLowerCase(),
      );

      return components.join(" ");
    })
    .join(", ");
};

const formattedTeam = (team: string): string => {
  if (!team || team === "NA") return "NA";

  return team
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Function to prepare the data for retrieval, which includes opening the browser, setting the category and team, downloading the Excel file, and parsing its contents to create an array of PartitaVolley objects.
 *
 * @param downloadPath The temporary path where the file will be downloaded
 * @param category The category to select on the page
 * @param team The team to select on the page
 * @param homePlace The name of the home place to determine if the match is a home match or an away match
 * @param urlDownloadSite The URL of the site from which to download the Excel file
 * @throws TRPCError if there is an error during the data retrieval process
 * @returns  A Promise that resolves to an array of PartitaVolley objects containing the match information extracted from the Excel file
 */
const prepareData = async ({
  downloadPath,
  category,
  team,
  homePlace,
  urlDownloadSite,
}: {
  downloadPath: string;
  category: string;
  team: string;
  homePlace: string;
  urlDownloadSite: string;
}): Promise<PartitaVolley[]> => {
  try {
    const fileName = await asyncJob(
      "Preparing data for retrieval...",
      async () => {
        return await getExcel({
          downloadPath,
          category,
          team,
          urlDownloadSite,
        });
      },
      "Data prepared successfully.",
    );

    if (!fileName) {
      throw new Error("No file was downloaded.");
    }

    if (!fileName.endsWith(".xlsx")) {
      throw new Error(`Downloaded file is not an Excel file: ${fileName}`);
    }

    if (!path.join(downloadPath, fileName)) {
      throw new Error(
        `Downloaded file not found at expected path: ${path.join(downloadPath, fileName)}`,
      );
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(downloadPath, fileName));
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) throw new Error("Internal error: Worksheet not found");
    const match: PartitaVolley[] = [];

    worksheet.eachRow((row, rowNumber) => {
      const place = formattedPlace(getVal(row.getCell(7)));

      if (rowNumber > 3) {
        const matchTmp: PartitaVolley = {
          day: getVal(row.getCell(1)),
          number: getVal(row.getCell(2)),
          date: getVal(row.getCell(3)),
          hour: getVal(row.getCell(4)),
          home: formattedTeam(getVal(row.getCell(5))),
          guest: formattedTeam(getVal(row.getCell(6))),
          place: place,
          isHome: place === homePlace,
          status:
            getVal(row.getCell(3)) !== "NA" && getVal(row.getCell(4)) !== "NA"
              ? isDayPassed(getVal(row.getCell(3)))
                ? "Conclusa"
                : thisWeek(getVal(row.getCell(3)))
                  ? "Prossima"
                  : "In programma"
              : "Rinviata",
        };
        match.push(matchTmp);
      }
    });

    try {
      fs.unlinkSync(path.join(downloadPath, fileName));
    } catch (e) {
      throw new Error(
        `Error deleting file: ${e instanceof Error ? e.message : e}`,
      );
    }

    return match;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error preparing data.",
      cause: error instanceof Error ? error : undefined,
    });
  }
};

export default prepareData;
