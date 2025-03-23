// src/components/VisitorChart.js
"use client";

import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import styles from "./VisitorChart.module.css";

const VisitorChart = ({ visitorData, predictedData, selectedDate }) => {
  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  const currentTime = new Date()
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", ":");

  // Combine actual and predicted data
  const combinedData = [
    ...visitorData.map((d) => ({
      time: d.time,
      visitors: d.visitors,
      isPrediction: false,
    })),
  ];

  if (isToday && predictedData.length > 0) {
    // Add predictions for future times that don't have actual data
    const actualTimes = new Set(visitorData.map((d) => d.time));

    predictedData.forEach((p) => {
      if (!actualTimes.has(p.time)) {
        combinedData.push({
          time: p.time,
          predicted: p.predicted,
          visitors: null, // null for actual data at prediction times
          isPrediction: true,
        });
      }
    });
  }

  // Sort by time
  combinedData.sort((a, b) => {
    const timeA = a.time.split(":").map(Number);
    const timeB = b.time.split(":").map(Number);

    if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
    return timeA[1] - timeB[1];
  });

  // Add this function to find the nearest previous actual time point
  const findNearestPreviousActualTime = (currentTime, actualDataPoints) => {
    // Convert current time to minutes for comparison
    const [currentHours, currentMinutes] = currentTime.split(":").map(Number);
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    // Convert all actual data points to minutes
    const timePoints = actualDataPoints.map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return {
        time,
        totalMinutes: hours * 60 + minutes,
      };
    });

    // Filter to only include data points that are before or equal to current time
    const previousPoints = timePoints.filter(
      (point) => point.totalMinutes <= currentTotalMinutes
    );

    // If no previous points (rare case), return the earliest data point
    if (previousPoints.length === 0) {
      timePoints.sort((a, b) => a.totalMinutes - b.totalMinutes);
      return timePoints[0]?.time || currentTime;
    }

    // Find the most recent previous point
    previousPoints.sort((a, b) => b.totalMinutes - a.totalMinutes);
    return previousPoints[0].time;
  };

  // Get only the actual data time points (not predictions)
  const actualDataTimePoints = visitorData.map((d) => d.time);

  // Find the nearest previous actual data point
  const displayTime = findNearestPreviousActualTime(
    currentTime,
    actualDataTimePoints
  );

  // Console log for debugging
  useEffect(() => {
    console.log("Current time:", currentTime);
    console.log("Actual data time points:", actualDataTimePoints);
    console.log("Display time for reference line:", displayTime);
  }, [currentTime, actualDataTimePoints, displayTime]);

  // Create a custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ fontWeight: "bold" }}>{`Time: ${label}`}</p>
          {data.visitors !== null ? (
            <p
              style={{ color: "#1E40AF" }}
            >{`Actual Visitors: ${data.visitors}`}</p>
          ) : null}
          {data.predicted !== undefined ? (
            <p
              style={{ color: "#047857" }}
            >{`Predicted Visitors: ${data.predicted}`}</p>
          ) : null}
        </div>
      );
    }

    return null;
  };

  // Format time for display
  const formatXAxis = (time) => {
    // Just show hour for cleaner display
    const [hour, minute] = time.split(":");
    return minute === "00" ? `${hour}:00` : time;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {isToday
          ? "Today's Visitor Pattern with Predictions"
          : "Historical Visitor Pattern"}
      </h2>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={combinedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
              tick={{ fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              allowDecimals={false}
              domain={[0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              payload={[
                { value: "Actual Visitors", type: "line", color: "#1E40AF" },
                {
                  value: "Predicted Visitors",
                  type: "line",
                  color: "#047857",
                  strokeDasharray: "5 5",
                },
              ]}
            />

            {/* Prediction confidence area */}
            {isToday && (
              <Area
                type="monotone"
                dataKey="predicted"
                fill="#047857"
                fillOpacity={0.1}
                stroke="none"
              />
            )}

            {/* Actual visitor data */}
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#1E40AF"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              connectNulls={false}
            />

            {/* Predicted visitor data */}
            {isToday && (
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#047857"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: "#047857", stroke: "#047857" }}
              />
            )}

            {/* Current time marker */}
            {isToday && (
              <ReferenceLine
                x={displayTime} // Use displayTime instead of currentTime
                stroke="#DC2626"
                strokeWidth={1.5}
                label={{
                  value: "Now",
                  position: "insideTopRight",
                  fill: "#DC2626",
                  fontSize: 14,
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {isToday && predictedData.length > 0 && (
        <div className={styles.legendContainer}>
          <div className={styles.legendItem}>
            <span
              className={`${styles.legendLine} ${styles.legendSolid}`}
            ></span>
            <span>Actual visitor counts</span>
          </div>
          <div className={styles.legendItem}>
            <span
              className={`${styles.legendLine} ${styles.legendDashed}`}
            ></span>
            <span>Predicted visitors</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendVertical}`}></span>
            <span>Current time</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorChart;
