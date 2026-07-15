import type { Metadata } from "next";
import { PageHeader } from "@/components/organisms/PageHeader";
import { ContactForm } from "@/components/organisms/ContactForm";
import { ContactInfo } from "@/components/organisms/ContactInfo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a demo, ask a question, or start building immediately. Reach SolAI via email, WhatsApp, or our Kigali office.",
};

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <PageHeader
        label="Contact"
        title="Let's talk about your growth."
        description="Book a demo, ask a question, or start building immediately."
      />
      <section className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr]">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </div>
  );
}
