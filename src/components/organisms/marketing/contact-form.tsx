"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

import { CtaButtonLink } from "@/components/atoms/cta-button-link";
import { Button } from "@/components/ui/button";
import { FORM_CONTROL_CLASSES, FormField } from "@/components/molecules/form-field";
import {
  AD_SPEND_OPTIONS,
  CONTACT_FORM_COPY,
  CONTACT_SUCCESS_COPY,
  PLATFORM_OPTIONS,
} from "@/data/marketing/contact";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-success/12 text-success">
          <Check size={32} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-text">
          {CONTACT_SUCCESS_COPY.heading}
        </h3>
        <p className="mb-4 text-sm text-text-muted">{CONTACT_SUCCESS_COPY.body}</p>
        <CtaButtonLink cta={CONTACT_SUCCESS_COPY.cta} variant="cta" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <h3 className="mb-5 text-lg font-semibold text-text">
        {CONTACT_FORM_COPY.formHeading}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Full name" htmlFor="contact-name">
          <input
            id="contact-name"
            type="text"
            required
            placeholder={CONTACT_FORM_COPY.namePlaceholder}
            className={FORM_CONTROL_CLASSES}
          />
        </FormField>
        <FormField label="Email" htmlFor="contact-email">
          <input
            id="contact-email"
            type="email"
            required
            placeholder={CONTACT_FORM_COPY.emailPlaceholder}
            className={FORM_CONTROL_CLASSES}
          />
        </FormField>
      </div>

      <FormField label="Company" htmlFor="contact-company">
        <input
          id="contact-company"
          type="text"
          placeholder={CONTACT_FORM_COPY.companyPlaceholder}
          className={FORM_CONTROL_CLASSES}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Monthly ad spend" htmlFor="contact-ad-spend">
          <select id="contact-ad-spend" className={FORM_CONTROL_CLASSES}>
            {AD_SPEND_OPTIONS.map((option) => (
              <option key={option.label}>{option.label}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Platform" htmlFor="contact-platform">
          <select id="contact-platform" className={FORM_CONTROL_CLASSES}>
            {PLATFORM_OPTIONS.map((option) => (
              <option key={option.label}>{option.label}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Anything we should know?" htmlFor="contact-message">
        <textarea
          id="contact-message"
          rows={3}
          placeholder={CONTACT_FORM_COPY.messagePlaceholder}
          className={FORM_CONTROL_CLASSES}
        />
      </FormField>

      <Button type="submit" variant="cta" className="w-full justify-center">
        <Send size={16} /> {CONTACT_FORM_COPY.submitLabel}
      </Button>
    </form>
  );
}
