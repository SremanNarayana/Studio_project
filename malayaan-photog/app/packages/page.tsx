import type { Metadata } from "next";
import { Packages } from "@/components/sections/Packages";

export const metadata: Metadata = {
  title: "Photography Packages & Pricing — Wedding, Events & More",
  description:
    "Transparent photography packages & pricing for weddings, house warming (Griha Pravesh), events, maternity & baby shoots across Madurai, Melur, Chennai, Tirunelveli, Kanyakumari, Kodaikanal & all Tamil Nadu. Collections starting ₹15,000.",
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Photography Packages & Pricing | Malayaan Photography",
    description:
      "Wedding, event, maternity & baby photography collections across Tamil Nadu. Transparent pricing, fully customisable.",
    url: "/packages",
    type: "website",
  },
};

export default function PackagesPage() {
  return (
    <div className="pt-40 sm:pt-44">
      <Packages />
    </div>
  );
}
