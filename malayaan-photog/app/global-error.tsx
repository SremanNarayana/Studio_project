"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Rendered only when the root layout itself fails, so it cannot depend on the
  // app's stylesheet/fonts — styles are inlined to guarantee a graceful fallback.
  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
          background: "#ffffff",
          color: "#1c1a22",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#a4863a",
            marginBottom: "16px",
          }}
        >
          Malayaan Photography
        </p>
        <h1 style={{ fontSize: "40px", fontWeight: 600, margin: "0 0 16px" }}>
          Something Went Wrong
        </h1>
        <p style={{ color: "#6b6571", maxWidth: "28rem", margin: "0 0 32px" }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "14px 28px",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #a4863a, #c2a14b)",
            color: "#ffffff",
            fontSize: "13px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
