"use client";

import Papa from "papaparse";

/**
 * Fetches CSV data from GitHub
 * In a production environment, you'd use a more reliable approach,
 * but for this demo, we'll fetch directly from GitHub
 */
export async function fetchDataFromGitHub() {
  try {
    // GitHub URL for your repository's CSV file
    const url =
      "https://raw.githubusercontent.com/MetisPrometheus/datacollector-trimmeriet/main/data/visitor_counts.csv";

    // Fetch the CSV data
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const csvText = await response.text();

    // Parse the CSV text
    return parseCSVData(csvText);
  } catch (error) {
    console.error("Error fetching data from GitHub:", error);

    // Fallback to local API for development
    console.log("Falling back to local API...");
    return fetchDataFromLocalAPI();
  }
}

/**
 * Fetches data from our local API (used as fallback)
 */
export async function fetchDataFromLocalAPI() {
  try {
    const response = await fetch("/api/visitor-data");

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data from local API:", error);
    return [];
  }
}

/**
 * Parses CSV text into usable data
 */
export function parseCSVData(csvText) {
  try {
    const result = Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    if (result.errors && result.errors.length > 0) {
      console.error("CSV parsing errors:", result.errors);
    }

    // Transform the data into our expected format
    return result.data.map((row) => ({
      timestamp: row.timestamp,
      date: row.timestamp.split(" ")[0],
      time: row.timestamp.split(" ")[1].substring(0, 5),
      visitors: row.visitor_count,
      temperature: row.temperature,
      weather: row.weather_category,
      isRaining: row.is_raining === "yes",
      isDaytime: row.is_daytime === "yes",
      isHoliday: row.is_holiday === "yes",
      isVacationPeriod: row.is_vacation_period === "yes",
      specialDate: row.special_date_name,
    }));
  } catch (error) {
    console.error("Error parsing CSV data:", error);
    return [];
  }
}
