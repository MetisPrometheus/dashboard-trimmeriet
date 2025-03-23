// src/components/DateSelector.js
"use client";

import React from "react";
import { format, subDays, addDays, parseISO } from "date-fns";
import styles from "./DateSelector.module.css";

const DateSelector = ({ selectedDate, onDateChange }) => {
  const today = new Date().toISOString().split("T")[0];

  // Get yesterday's date
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  // Format the selected date for display
  const formatDateForDisplay = (dateStr) => {
    const date = parseISO(dateStr);
    return format(date, "EEEE, MMMM d, yyyy");
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const date = parseISO(selectedDate);
    onDateChange(format(subDays(date, 1), "yyyy-MM-dd"));
  };

  // Navigate to next day (but not beyond today)
  const goToNextDay = () => {
    const date = parseISO(selectedDate);
    const nextDay = format(addDays(date, 1), "yyyy-MM-dd");

    // Prevent going beyond today
    if (nextDay <= today) {
      onDateChange(nextDay);
    }
  };

  // Check if we can go to the next day
  const canGoToNextDay = selectedDate < today;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Date display and navigation */}
        <div className={styles.navButtons}>
          <button
            onClick={goToPreviousDay}
            className={styles.navButton}
            aria-label="Previous day"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <h2 className={styles.dateDisplay}>
            {formatDateForDisplay(selectedDate)}
          </h2>

          <button
            onClick={goToNextDay}
            className={`${styles.navButton} ${
              !canGoToNextDay ? styles.navButtonDisabled : ""
            }`}
            disabled={!canGoToNextDay}
            aria-label="Next day"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Quick select buttons */}
        <div className={styles.quickButtons}>
          <button
            className={`${styles.quickButton} ${
              selectedDate === yesterday
                ? styles.quickButtonActive
                : styles.quickButtonInactive
            }`}
            onClick={() => onDateChange(yesterday)}
          >
            Yesterday
          </button>

          <button
            className={`${styles.quickButton} ${
              selectedDate === today
                ? styles.quickButtonActive
                : styles.quickButtonInactive
            }`}
            onClick={() => onDateChange(today)}
          >
            Today
          </button>

          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              max={today}
              className={styles.dateInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
