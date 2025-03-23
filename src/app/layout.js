// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "Trimmeriet Gym Visitor Tracker",
  description: "Track and predict gym visitor patterns",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
