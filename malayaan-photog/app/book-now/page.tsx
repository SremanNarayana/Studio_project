import type { Metadata } from "next";
import { BookNow } from "@/components/sections/BookNow";

export const metadata: Metadata = {
  title: "Book Now — Photography Session Enquiry",
  description:
    "Book your photography session with Malayaan Photography. Share your event details for weddings, receptions, maternity, baby, corporate & commercial shoots across Tamil Nadu and our team will contact you with the best-suited package and pricing.",
  alternates: { canonical: "/book-now" },
  openGraph: {
    title: "Book Your Photography Session | Malayaan Photography",
    description:
      "Tell us about your event and our team will contact you with the most suitable package and pricing.",
    url: "/book-now",
    type: "website",
  },
};

export default function BookNowPage() {
  return (
    <div className="pt-40 sm:pt-44">
      <BookNow />
    </div>
  );
}
