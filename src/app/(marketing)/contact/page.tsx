import { PageHeader } from "@/components/molecules/page-header";
import { ContactForm } from "@/components/organisms/marketing/contact-form";
import { ContactInfo } from "@/components/organisms/marketing/contact-info";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your growth."
        subCopy="Book a demo, ask a question, or start building immediately."
      />
      <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-lg border border-border bg-surface p-8">
            <ContactForm />
          </div>
          <ContactInfo />
        </div>
      </section>
    </>
  );
}
