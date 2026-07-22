"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Check } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { MarketingButton } from "@/components/molecules/MarketingButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adSpendOptions, platformOptions } from "@/lib/data/contact";
import { delay } from "@/lib/async-utils";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      monthlyAdSpend: "Under US$ 1,000",
      platform: "Shopify",
      message: "",
    },
  });

  function onSubmit() {
    startTransition(async () => {
      await delay();
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-border bg-surface px-5 py-10 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success/12 text-success">
          <Check className="size-8" strokeWidth={1.5} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-text">
          We&apos;ll be in touch within 24 hours.
        </h3>
        <p className="mb-4 text-sm text-text-muted">
          Check your inbox for a confirmation. In the meantime, you can start a
          free account immediately.
        </p>
        <MarketingButton href="/signup" variant="cta">
          Start free now
        </MarketingButton>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-8">
      <h3 className="mb-5 text-lg font-semibold text-text">Request a demo</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kalisa Mugisha"
                      className="border-border bg-bg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="kalisa@inema.rw"
                      className="border-border bg-bg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Inema Boutique"
                    className="border-border bg-bg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="monthlyAdSpend"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly ad spend</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-border bg-bg">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adSpendOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-border bg-bg">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platformOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anything we should know?</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Tell us about your products, target market, or questions..."
                    className="border-border bg-bg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="cta"
            disabled={isPending}
            className="w-full justify-center"
          >
            <Send className="size-4" />
            {isPending ? "Sending..." : "Send request"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
