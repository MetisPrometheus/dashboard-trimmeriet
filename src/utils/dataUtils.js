"use client";

import Papa from "papaparse";
import {
  format,
  parse,
  parseISO,
  startOfDay,
  addDays,
  addMinutes,
  isSameDay,
} from "date-fns";
import _ from "lodash";

// Mock data for fallback
const MOCK_DATA = [
  {
    time: "08:00",
    visitors: 7,
    temperature: 8.1,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "09:00",
    visitors: 12,
    temperature: 9.5,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "10:00",
    visitors: 15,
    temperature: 10.4,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "11:00",
    visitors: 11,
    temperature: 11.1,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "12:00",
    visitors: 17,
    temperature: 11.6,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "13:00",
    visitors: 14,
    temperature: 11.7,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "14:00",
    visitors: 13,
    temperature: 12.3,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "15:00",
    visitors: 13,
    temperature: 12.3,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "16:00",
    visitors: 8,
    temperature: 11.9,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "17:00",
    visitors: 6,
    temperature: 11.4,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "18:00",
    visitors: 5,
    temperature: 10.6,
    weather: "clear",
    isRaining: false,
    isDaytime: true,
  },
  {
    time: "19:00",
    visitors: 3,
    temperature: 9.5,
    weather: "clear",
    isRaining: false,
    isDaytime: false,
  },
  {
    time: "20:00",
    visitors: 2,
    temperature: 9.2,
    weather: "clear",
    isRaining: false,
    isDaytime: false,
  },
];

// Mock historical data
const MOCK_HISTORICAL_DATA = [
  { time: "08:00:00", visitor_count: 5, day_of_week: 6 },
  { time: "09:00:00", visitor_count: 10, day_of_week: 6 },
  { time: "10:00:00", visitor_count: 15, day_of_week: 6 },
  { time: "11:00:00", visitor_count: 12, day_of_week: 6 },
  { time: "12:00:00", visitor_count: 16, day_of_week: 6 },
  { time: "13:00:00", visitor_count: 14, day_of_week: 6 },
  { time: "14:00:00", visitor_count: 12, day_of_week: 6 },
  { time: "15:00:00", visitor_count: 11, day_of_week: 6 },
  { time: "16:00:00", visitor_count: 9, day_of_week: 6 },
  { time: "17:00:00", visitor_count: 7, day_of_week: 6 },
  { time: "18:00:00", visitor_count: 5, day_of_week: 6 },
  { time: "19:00:00", visitor_count: 3, day_of_week: 6 },
  { time: "20:00:00", visitor_count: 2, day_of_week: 6 },
];

export const fetchDataFromGitHub = async () => {
  try {
    const url =
      "https://raw.githubusercontent.com/MetisPrometheus/datacollector-trimmeriet/main/data/visitor_counts.csv";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch from GitHub: ${response.status}`);
    }

    const csvText = await response.text();

    // Parse the CSV data
    const data = parseCSVData(csvText);
    return data;
  } catch (error) {
    console.error("Error fetching data from GitHub:", error);
    throw error;
  }
};

// Function to fetch visitor data
export const fetchVisitorData = async (dateStr) => {
  try {
    console.log("Fetching data for date:", dateStr);
    // In a real app, we would fetch from an API or directly from GitHub
    // For now, let's use a mock implementation using the API route
    const response = await fetch(`/api/visitor-data?date=${dateStr}`);

    if (!response.ok) {
      console.log(
        `API returned error ${response.status}, using mock data instead`
      );
      return MOCK_DATA; // Return mock data on API error
    }

    const data = await response.json();
    console.log("Received data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching visitor data:", error);
    console.log("Error occurred, using mock data instead");
    return MOCK_DATA; // Return mock data on any error
  }
};

// Function to predict visitor counts for the remainder of the day
export const predictVisitors = async (todayData) => {
  try {
    // In a real app, we'd use a more sophisticated prediction model
    // For now, we'll use historical averages from our API
    const response = await fetch("/api/historical-data");

    let historicalData;
    if (!response.ok) {
      console.log("Failed to fetch historical data, using mock data");
      historicalData = MOCK_HISTORICAL_DATA;
    } else {
      historicalData = await response.json();
    }

    // Current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Get time slots for the rest of the day
    const predictions = [];
    const processedTimeSlots = new Set();

    // Create predictions for each 15-minute interval for the rest of the day
    for (let hour = currentHour; hour < 24; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        // Skip past time slots in the current hour
        if (hour === currentHour && minute <= currentMinute) continue;

        const timeSlot = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        // Skip if we already have actual data for this time
        if (todayData.some((d) => d.time === timeSlot)) continue;

        // Skip if we've already processed this time slot
        if (processedTimeSlots.has(timeSlot)) continue;

        // Find matching historical data points
        const historicalMatches = historicalData.filter((item) => {
          const itemTime = item.time.substring(0, 5);
          return itemTime === timeSlot;
        });

        if (historicalMatches.length > 0) {
          // Calculate average visitor count
          const avgVisitors = Math.round(
            historicalMatches.reduce(
              (sum, item) => sum + item.visitor_count,
              0
            ) / historicalMatches.length
          );

          predictions.push({
            time: timeSlot,
            predicted: avgVisitors,
          });

          processedTimeSlots.add(timeSlot);
        }
      }
    }

    // If we don't have many historical matches, use a simple trend-based approach
    if (predictions.length < 5 && todayData.length > 0) {
      // Get the most recent actual count
      const sortedActualData = [...todayData].sort((a, b) => {
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);

        if (timeA[0] !== timeB[0]) return timeB[0] - timeA[0];
        return timeB[1] - timeA[1];
      });

      const latestData = sortedActualData[0];
      let latestCount = latestData.visitors;

      // Generate predictions for missing time slots
      for (let hour = currentHour; hour < 24; hour++) {
        for (let minute of [0, 15, 30, 45]) {
          // Skip past time slots in the current hour
          if (hour === currentHour && minute <= currentMinute) continue;

          const timeSlot = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;

          // Skip if we already have a prediction for this time
          if (processedTimeSlots.has(timeSlot)) continue;

          // Apply a simple decay model for late hours
          if (hour >= 19) {
            latestCount = Math.max(0, latestCount - 1);
          } else if (hour >= 22) {
            latestCount = Math.max(0, latestCount - 2);
          }

          predictions.push({
            time: timeSlot,
            predicted: latestCount,
          });

          processedTimeSlots.add(timeSlot);
        }
      }
    }

    // Sort predictions by time
    return predictions.sort((a, b) => {
      const [hoursA, minutesA] = a.time.split(":").map(Number);
      const [hoursB, minutesB] = b.time.split(":").map(Number);

      if (hoursA !== hoursB) return hoursA - hoursB;
      return minutesA - minutesB;
    });
  } catch (error) {
    console.error("Error predicting visitor data:", error);

    // Generate some simple predictions as fallback
    const predictions = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let hour = currentHour + 1; hour < 22; hour++) {
      predictions.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        predicted: Math.max(0, 15 - Math.abs(hour - 12)),
      });
    }

    return predictions;
  }
};

// Helper function to parse CSV data
export const parseCSVData = (csvText) => {
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
};
