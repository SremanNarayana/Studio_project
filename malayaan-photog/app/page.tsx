import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Process } from "@/components/sections/Process";
import { FAQ } from "@/components/sections/FAQ";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { faqJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      {/* SEO H1 — visually hidden, crawlable. The hero is intentionally text-free. */}
      <h1 className="sr-only">
        Malayaan Photography — Best Wedding, Pre-Wedding, Maternity & Event
        Photographer in Madurai, Melur, Chennai, Tirunelveli,
        Kanyakumari, Kodaikanal and across Tamil Nadu
      </h1>
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <WhyChooseUs />
      <Process />
      <FAQ />
      <WhatsAppFloat />
    </>
  );
}
