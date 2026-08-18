import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Project",
  description:
    "Enter your Malayaan Photography booking ID to view live progress on your wedding or event photography project — from shoot to final delivery.",
  alternates: { canonical: "/track" },
  openGraph: {
    title: "Track Your Project | Malayaan Photography",
    description: "Follow your photography project's progress in real time.",
    url: "/track",
    type: "website",
  },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
