import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-6 text-center">
      <div className="eyebrow mb-4">— Lost in the gallery</div>
      <h1 className="font-display text-6xl sm:text-7xl mb-4">
        404 <span className="italic gold-text">Not Found</span>
      </h1>
      <p className="text-ivory-100/60 max-w-md mb-8">
        This page seems to have wandered off. Let&rsquo;s get you back to the story.
      </p>
      <Link href="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
}
