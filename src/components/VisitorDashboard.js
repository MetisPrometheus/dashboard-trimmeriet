// src/components/VisitorDashboard.js
"use client";

import React, { useState, useEffect } from "react";
import VisitorChart from "./VisitorChart";
import DateSelector from "./DateSelector";
import SummaryStats from "./SummaryStats";
import PredictionExplanation from "./PredictionExplanation";
import {
  fetchVisitorData,
  predictVisitors,
  fetchDataFromGitHub,
} from "@/utils/dataUtils";
import styles from "./VisitorDashboard.module.css";

const VisitorDashboard = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Function to load data for the selected date
  const loadData = async (useGitHub = false) => {
    setIsLoading(true);
    try {
      let data;

      // Use GitHub data source if specified
      if (useGitHub) {
        // Get all data from GitHub
        const allData = await fetchDataFromGitHub();
        // Filter for the selected date
        data = allData.filter((item) => item.date === selectedDate);
      } else {
        // Otherwise use the API route
        data = await fetchVisitorData(selectedDate);
      }

      setVisitorData(data);

      // Generate predictions for the current day if it's today
      const today = new Date().toISOString().split("T")[0];
      if (selectedDate === today) {
        const predictions = await predictVisitors(data);
        setPredictedData(predictions);
      } else {
        setPredictedData([]);
      }

      setError(null);
    } catch (err) {
      console.error("Failed to load visitor data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount and when selected date changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Use GitHub data source for initial load and when date changes
    loadData(true);

    // Set up auto-refresh for current day data (every 5 minutes)
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate === today) {
      const interval = setInterval(() => {
        // Use GitHub data for auto-refresh too
        loadData(true);
      }, 5 * 60 * 1000); // 5 minutes

      setRefreshInterval(interval);
    } else {
      // Clear any existing interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    // Cleanup on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRefresh = () => {
    // Always use GitHub data for manual refresh
    loadData(true);
  };

  // Calculate current time for display
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  return (
    <div className={styles.container}>
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      {isLoading && visitorData.length === 0 ? (
        <div className={styles.loadingContainer}>
          <div className={styles.textCenter}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading data...</p>
          </div>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button className={styles.errorButton} onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          {isToday && (
            <div className={styles.liveDataContainer}>
              <div>
                <h2 className={styles.liveDataTitle}>Live Data</h2>
                <p className={styles.liveDataTime}>
                  Current time: {currentTime}
                  {isToday && (
                    <span className={styles.liveIndicator}>
                      Auto-refreshing
                    </span>
                  )}
                </p>
              </div>
              <button className={styles.refreshButton} onClick={handleRefresh}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.refreshIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Now
              </button>
            </div>
          )}

          <SummaryStats visitorData={visitorData} selectedDate={selectedDate} />

          <VisitorChart
            visitorData={visitorData}
            predictedData={predictedData}
            selectedDate={selectedDate}
          />

          {isToday && predictedData.length > 0 && <PredictionExplanation />}
        </>
      )}
    </div>
  );
};

export default VisitorDashboard;
