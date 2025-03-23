// src/components/SummaryStats.js
"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import styles from "./SummaryStats.module.css";

const SummaryStats = ({ visitorData, selectedDate }) => {
  // Calculate total visitors
  const totalVisitors = visitorData.reduce(
    (sum, data) => sum + data.visitors,
    0
  );

  // Calculate current visitors (latest entry for today)
  const today = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === today;

  // Find current visitors (if today, use the most recent entry)
  let currentVisitors = 0;
  if (isToday && visitorData.length > 0) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Find entries from the current time backwards
    const recentEntries = [...visitorData]
      .sort((a, b) => {
        const [hoursA, minutesA] = a.time.split(":").map(Number);
        const [hoursB, minutesB] = b.time.split(":").map(Number);

        // Sort in descending order (most recent first)
        if (hoursA !== hoursB) return hoursB - hoursA;
        return minutesB - minutesA;
      })
      .filter((entry) => {
        const [hours, minutes] = entry.time.split(":").map(Number);
        return (
          hours < currentHour ||
          (hours === currentHour && minutes <= currentMinute)
        );
      });

    if (recentEntries.length > 0) {
      currentVisitors = recentEntries[0].visitors;
    }
  }

  // Find peak time
  let peakTime = { time: "N/A", visitors: 0 };
  if (visitorData.length > 0) {
    peakTime = visitorData.reduce(
      (max, data) => (data.visitors > max.visitors ? data : max),
      { time: "", visitors: 0 }
    );
  }

  // Calculate average occupancy
  const averageVisitors =
    visitorData.length > 0
      ? Math.round(
          totalVisitors / visitorData.filter((d) => d.visitors > 0).length
        ) || 0
      : 0;

  // Format the time for display
  const formatTimeForDisplay = (timeString) => {
    if (!timeString || timeString === "N/A") return "N/A";

    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.statCard}>
        <div className={styles.statContent}>
          <div className={`${styles.iconContainer} ${styles.iconBlue}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.statIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statLabel}>Total Visitors</h3>
            <p className={styles.statValue}>{totalVisitors}</p>
          </div>
        </div>
      </div>

      {isToday && (
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={`${styles.iconContainer} ${styles.iconGreen}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.statIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <h3 className={styles.statLabel}>Current Visitors</h3>
              <p className={styles.statValue}>{currentVisitors}</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.statCard}>
        <div className={styles.statContent}>
          <div className={`${styles.iconContainer} ${styles.iconPurple}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.statIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statLabel}>Peak Time</h3>
            <p className={styles.statValue}>
              {formatTimeForDisplay(peakTime.time)}
            </p>
            <p className={styles.statSubtext}>{peakTime.visitors} visitors</p>
          </div>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statContent}>
          <div className={`${styles.iconContainer} ${styles.iconYellow}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.statIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
              />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statLabel}>Average Visitors</h3>
            <p className={styles.statValue}>{averageVisitors}</p>
            <p className={styles.statSubtext}>when gym is open</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
