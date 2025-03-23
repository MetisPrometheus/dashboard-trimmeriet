// src/app/page.js
"use client";

import VisitorDashboard from "@/components/VisitorDashboard";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Trimmeriet Gym Visitor Dashboard</h1>
        <p className={styles.subtitle}>
          Track visitors and predict gym occupancy in real-time
        </p>
      </header>

      <main className={styles.main}>
        <VisitorDashboard />
      </main>

      <footer className={styles.footer}>
        {/* <p>© {new Date().getFullYear()} Trimmeriet</p> */}
      </footer>
    </div>
  );
}
