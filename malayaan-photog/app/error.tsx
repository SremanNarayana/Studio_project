"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface caught render errors for observability; only runs when one occurs.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-6 text-center">
      <div className="eyebrow mb-4">— Something interrupted the shoot</div>
      <h1 className="font-display text-6xl sm:text-7xl mb-4">
        Something <span className="italic gold-text">Went Wrong</span>
      </h1>
      <p className="text-ivory-100/60 max-w-md mb-8">
        An unexpected error occurred. You can try again, or head back to the story.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
        <Link href="/" className="btn-ghost">
          Return Home
        </Link>
      </div>
    </div>
  );
}
