import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET(request) {
  try {
    // Path to the CSV file
    // In a real implementation, you would fetch from GitHub API
    // For now, we'll read from the local file system for development
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "visitor_counts.csv"
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // For development, provide mock data if file doesn't exist
      console.warn("CSV file not found, using mock data");
      return NextResponse.json(getMockHistoricalData());
    }

    // Read and parse the CSV file
    const fileContent = fs.readFileSync(filePath, "utf8");
    const result = Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    if (result.errors && result.errors.length > 0) {
      console.error("Error parsing CSV:", result.errors);
      throw new Error("Failed to parse CSV data");
    }

    // Transform data for historical analysis
    const historicalData = result.data.map((row) => {
      // Extract date information
      const timestamp = new Date(row.timestamp);
      const dayOfWeek = timestamp.getDay(); // 0 = Sunday, 1 = Monday, ...
      const hour = timestamp.getHours();
      const minute = timestamp.getMinutes();

      return {
        time: row.timestamp.split(" ")[1],
        date: row.timestamp.split(" ")[0],
        dayOfWeek,
        day_name: getDayName(dayOfWeek),
        hour,
        minute,
        visitor_count: row.visitor_count,
        temperature: row.temperature,
        weather_category: row.weather_category,
        is_raining: row.is_raining === "yes",
        is_daytime: row.is_daytime === "yes",
        is_holiday: row.is_holiday === "yes",
        is_vacation_period: row.is_vacation_period === "yes",
      };
    });

    return NextResponse.json(historicalData);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}

// Helper function to get day name from day index
function getDayName(dayIndex) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayIndex];
}

// Mock data for development
function getMockHistoricalData() {
  // Generate mock historical data for the past week
  const mockData = [];

  // Start date for our historical data (7 days ago)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  // Generate data for each day
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);

    const dateStr = currentDate.toISOString().split("T")[0];
    const dayOfWeek = currentDate.getDay();
    const dayName = getDayName(dayOfWeek);

    // Generate hourly data for this day (simplified)
    // In a real app, this would come from your CSV or database
    for (let hour = 7; hour < 20; hour++) {
      // Typical pattern:
      // - Morning: gradual increase (7-10)
      // - Midday peak: (11-13)
      // - Afternoon: stable/slight decrease (14-16)
      // - Evening: gradual decrease (17-19)
      let baseVisitors;

      if (hour >= 7 && hour <= 9) {
        // Morning ramp-up
        baseVisitors = Math.round((hour - 7) * 4 + 2);
      } else if (hour >= 10 && hour <= 13) {
        // Midday peak
        baseVisitors = 12 + Math.round(Math.random() * 5);
      } else if (hour >= 14 && hour <= 16) {
        // Afternoon stable
        baseVisitors = 10 + Math.round(Math.random() * 4);
      } else {
        // Evening decline
        baseVisitors = Math.max(0, 16 - (hour - 14) * 3);
      }

      // Weekend vs weekday variations
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend
        baseVisitors = Math.round(baseVisitors * 1.2); // 20% more visitors on weekends
      }

      // Add some random variation
      const visitors = Math.max(
        0,
        baseVisitors + Math.round((Math.random() - 0.5) * 4)
      );

      // Generate entries for each hour (at 15 minute intervals)
      for (let minute of [0, 15, 30, 45]) {
        // Slight variation within the hour
        const minuteVariation = Math.round((Math.random() - 0.5) * 2);
        const finalVisitors = Math.max(0, visitors + minuteVariation);

        const timeStr = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:00`;
        const timestamp = `${dateStr} ${timeStr}`;

        mockData.push({
          time: timeStr,
          date: dateStr,
          dayOfWeek,
          day_name: dayName,
          hour,
          minute,
          visitor_count: finalVisitors,
          temperature: 10 + Math.round(Math.random() * 5),
          weather_category: "clear",
          is_raining: false,
          is_daytime: hour >= 7 && hour <= 18,
          is_holiday: false,
          is_vacation_period: false,
        });
      }
    }
  }

  return mockData;
}
