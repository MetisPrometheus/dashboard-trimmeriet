// src/components/PredictionExplanation.js
"use client";

import React, { useState } from "react";
import styles from "./PredictionExplanation.module.css";

const PredictionExplanation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.titleContainer}>
          <div className={styles.iconContainer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.icon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className={styles.title}>How Predictions Work</h3>
        </div>

        <button className={styles.toggleButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${styles.toggleIcon} ${isOpen ? styles.rotate180 : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={styles.content}>
          <p>
            Our prediction system works by analyzing historical visitor patterns
            at your gym. Here's how it works:
          </p>

          <ol className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.strong}>Historical Data Analysis:</span>{" "}
              We analyze past visitor data from similar days (same day of week,
              similar weather conditions).
            </li>
            <li className={styles.listItem}>
              <span className={styles.strong}>Real-time Adjustments:</span>{" "}
              Today's actual visitor numbers are used to adjust predictions for
              the rest of the day.
            </li>
            <li className={styles.listItem}>
              <span className={styles.strong}>Pattern Recognition:</span> Our
              system identifies regular patterns in gym attendance throughout
              the day.
            </li>
          </ol>

          <div className={styles.note}>
            <p>
              <span className={styles.noteTitle}>Note:</span> Predictions are
              estimates and may vary based on unexpected events, holidays, or
              special circumstances.
            </p>
          </div>

          <p className={styles.smallText}>
            In the future, we plan to enhance our prediction model with more
            factors like weather forecasts, local events, and seasonal trends.
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionExplanation;
