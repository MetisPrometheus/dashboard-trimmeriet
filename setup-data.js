// This script sets up the data directory and downloads the CSV file from GitHub
const fs = require("fs");
const path = require("path");
const https = require("https");

// Create the data directory if it doesn't exist
const dataDir = path.join(__dirname, "public", "data");
if (!fs.existsSync(dataDir)) {
  console.log("Creating data directory...");
  fs.mkdirSync(dataDir, { recursive: true });
}

// Function to fetch and save the CSV file from GitHub
function fetchCSVFromGitHub() {
  return new Promise((resolve, reject) => {
    const csvUrl =
      "https://raw.githubusercontent.com/MetisPrometheus/datacollector-trimmeriet/main/data/visitor_counts.csv";
    const csvPath = path.join(dataDir, "visitor_counts.csv");

    console.log("Downloading CSV file from GitHub...");

    // Create a write stream
    const file = fs.createWriteStream(csvPath);

    https
      .get(csvUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download CSV: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log("CSV file downloaded successfully.");
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(csvPath, () => {}); // Delete the file on error
        console.error("Error downloading CSV file:", err.message);
        reject(err);
      });
  });
}

// If the CSV file doesn't exist or force update is required, fetch it
const csvPath = path.join(dataDir, "visitor_counts.csv");
const forceUpdate = process.argv.includes("--force");

if (!fs.existsSync(csvPath) || forceUpdate) {
  console.log(forceUpdate ? "Force update requested." : "CSV file not found.");

  fetchCSVFromGitHub()
    .then(() => {
      console.log("Setup completed successfully!");
    })
    .catch((error) => {
      console.error("Setup failed:", error.message);
      console.log("Creating a sample CSV file instead...");

      // Create a sample CSV file as fallback
      const sampleContent = fs.readFileSync(
        path.join(__dirname, "src", "app", "api", "visitor-data", "sample.csv"),
        "utf8"
      );
      fs.writeFileSync(csvPath, sampleContent);

      console.log("Sample CSV file created.");
    });
} else {
  console.log("CSV file already exists. Use --force to update it.");
}

// Create a sample CSV file in the API directory for fallback
const sampleCsvDir = path.join(__dirname, "src", "app", "api", "visitor-data");
if (!fs.existsSync(sampleCsvDir)) {
  fs.mkdirSync(sampleCsvDir, { recursive: true });
}

const sampleCsvPath = path.join(sampleCsvDir, "sample.csv");
if (!fs.existsSync(sampleCsvPath)) {
  console.log("Creating sample CSV file for fallback...");

  // Create sample CSV content based on the data in the paste.txt
  const sampleCsvContent = `timestamp,visitor_count,temperature,weather_category,is_raining,is_daytime,is_holiday,is_vacation_period,special_date_name
2025-03-22 07:00:00,0,7.6,clear,no,yes,no,no,
2025-03-22 07:15:00,4,7.3,clear,no,yes,no,no,
2025-03-22 07:30:00,4,7.3,clear,no,yes,no,no,
2025-03-22 07:45:00,4,7.3,clear,no,yes,no,no,
2025-03-22 08:00:00,7,8.1,clear,no,yes,no,no,
2025-03-22 08:15:00,8,8.1,clear,no,yes,no,no,
2025-03-22 08:30:00,9,8.1,clear,no,yes,no,no,
2025-03-22 08:45:00,12,8.3,clear,no,yes,no,no,
2025-03-22 09:00:00,12,8.3,clear,no,yes,no,no,
2025-03-22 09:15:00,14,9.5,clear,no,yes,no,no,
2025-03-22 09:30:00,12,9.5,clear,no,yes,no,no,
2025-03-22 09:45:00,15,9.5,clear,no,yes,no,no,
2025-03-22 10:00:00,15,10.4,clear,no,yes,no,no,
2025-03-22 10:15:00,11,10.4,clear,no,yes,no,no,
2025-03-22 10:30:00,9,10.4,clear,no,yes,no,no,
2025-03-22 10:45:00,12,10.3,clear,no,yes,no,no,
2025-03-22 11:00:00,11,10.3,clear,no,yes,no,no,
2025-03-22 11:15:00,11,11.1,clear,no,yes,no,no,
2025-03-22 11:30:00,11,11.1,clear,no,yes,no,no,
2025-03-22 11:45:00,13,11.1,clear,no,yes,no,no,
2025-03-22 12:00:00,17,11.6,clear,no,yes,no,no,
2025-03-22 12:15:00,14,11.6,clear,no,yes,no,no,
2025-03-22 12:30:00,15,11.6,clear,no,yes,no,no,
2025-03-22 12:45:00,14,11.7,clear,no,yes,no,no,
2025-03-22 13:00:00,14,11.7,clear,no,yes,no,no,
2025-03-22 13:30:00,13,12.1,clear,no,yes,no,no,
2025-03-22 13:45:00,11,12.1,clear,no,yes,no,no,
2025-03-22 14:15:00,11,12.3,clear,no,yes,no,no,
2025-03-22 14:30:00,13,12.3,clear,no,yes,no,no,
2025-03-22 14:45:00,14,12.5,clear,no,yes,no,no,
2025-03-22 15:00:00,10,12.5,clear,no,yes,no,no,
2025-03-22 15:15:00,13,12.3,clear,no,yes,no,no,
2025-03-22 15:30:00,13,12.3,clear,no,yes,no,no,
2025-03-22 15:45:00,13,12.3,clear,no,yes,no,no,
2025-03-22 16:00:00,8,11.9,clear,no,yes,no,no,
2025-03-22 16:15:00,7,11.9,clear,no,yes,no,no,`;

  fs.writeFileSync(sampleCsvPath, sampleCsvContent);
  console.log("Sample CSV file created for fallback.");
}

console.log("Setup process completed.");
