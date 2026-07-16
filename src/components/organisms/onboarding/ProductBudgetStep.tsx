"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Shield, Upload } from "lucide-react";
import { BudgetSliderField } from "@/components/molecules/onboarding/BudgetSliderField";
import { TagInput } from "@/components/molecules/onboarding/TagInput";
import { OnboardingLayout } from "@/components/organisms/onboarding/OnboardingLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOnboardingDraft } from "@/hooks/use-onboarding-draft";
import { onboardingCurrencies, formatCurrencyAmount } from "@/lib/currency";
import { demoImportedProducts } from "@/lib/onboarding/demo-products";
import { productBudgetSchema } from "@/lib/validations/onboarding";

export function ProductBudgetStep() {
  const router = useRouter();
  const { draft: globalDraft, updateProductBudget } = useOnboardingDraft();
  const [draft, setDraft] = useState(globalDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canImport =
    draft.connections.shopify.status === "connected" ||
    draft.connections.woo.status === "connected";

  const importableProducts = useMemo(
    () =>
      demoImportedProducts.filter((p) => {
        if (draft.connections.shopify.status === "connected" && p.source === "shopify")
          return true;
        if (draft.connections.woo.status === "connected" && p.source === "woo")
          return true;
        return false;
      }),
    [draft.connections],
  );

  const onDrop = useCallback((files: File[]) => {
    setDraft((d) => ({
      ...d,
      product: {
        ...d.product,
        imageNames: files.map((f) => f.name).slice(0, 5),
      },
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 5,
  });

  const duration = Math.ceil(draft.budget.totalCap / draft.budget.dailyCap);

  function importProduct(id: string) {
    const product = demoImportedProducts.find((p) => p.id === id);
    if (!product) return;
    setDraft((d) => ({
      ...d,
      product: {
        ...d.product,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        productUrl: product.productUrl,
        importedFrom: product.source,
      },
    }));
  }

  function handleContinue() {
    const payload = {
      name: draft.product.name,
      description: draft.product.description,
      price: draft.product.price,
      currency: draft.product.currency,
      productUrl: draft.product.productUrl || undefined,
      idealCustomer: draft.audience.idealCustomer,
      regions: draft.audience.regions,
      languages: draft.audience.languages,
      dailyCap: draft.budget.dailyCap,
      totalCap: draft.budget.totalCap,
    };

    const parsed = productBudgetSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? "form";
        next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    updateProductBudget(
      {
        product: draft.product,
        audience: draft.audience,
        budget: draft.budget,
      },
      4,
    );
    router.push("/onboarding/review");
  }

  return (
    <OnboardingLayout
      step={3}
      onContinue={handleContinue}
      nextDisabled={duration < 1}
    >
      <h1 className="mb-1.5 text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Product, audience & budget
      </h1>
      <p className="mb-7 max-w-[560px] text-[15px] text-text-muted">
        Tell SolAI what you&apos;re selling and how much you want to spend.
      </p>

      <section>
        <h3 className="mb-3 font-mono text-[11px] font-medium tracking-[0.08em] text-brand uppercase">
          Product
        </h3>

        {canImport && importableProducts.length > 0 && (
          <div className="mb-4">
            <Label className="text-xs">Import from connected store</Label>
            <Select onValueChange={importProduct}>
              <SelectTrigger className="mt-1 border-border bg-bg">
                <SelectValue placeholder="Choose a product to import" />
              </SelectTrigger>
              <SelectContent>
                {importableProducts.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.source})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="mb-4">
          <Label htmlFor="product-name">Product name</Label>
          <Input
            id="product-name"
            value={draft.product.name}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                product: { ...d.product, name: e.target.value },
              }))
            }
            className="mt-1 border-border bg-bg"
            placeholder="Ankara Print Tee — Indigo"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-danger">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="product-desc">Description</Label>
          <Textarea
            id="product-desc"
            rows={3}
            value={draft.product.description}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                product: { ...d.product, description: e.target.value },
              }))
            }
            className="mt-1 border-border bg-bg"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-danger">{errors.description}</p>
          )}
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Price</Label>
            <div className="mt-1 flex">
              <Select
                value={draft.product.currency}
                onValueChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    product: { ...d.product, currency: v },
                    budget: { ...d.budget, currency: v },
                  }))
                }
              >
                <SelectTrigger className="w-24 rounded-r-none border-border bg-surface font-mono text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {onboardingCurrencies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={draft.product.price}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    product: { ...d.product, price: e.target.value },
                  }))
                }
                className="tnum rounded-l-none border-border bg-bg font-mono"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-xs text-danger">{errors.price}</p>
            )}
          </div>
          <div>
            <Label htmlFor="product-url">Product URL</Label>
            <Input
              id="product-url"
              type="url"
              value={draft.product.productUrl}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  product: { ...d.product, productUrl: e.target.value },
                }))
              }
              className="mt-1 border-border bg-bg"
              placeholder="https://"
            />
            {errors.productUrl && (
              <p className="mt-1 text-xs text-danger">{errors.productUrl}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <Label>Product images</Label>
          <div
            {...getRootProps()}
            className={`mt-1 cursor-pointer rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
              isDragActive ? "border-brand bg-brand-soft/20" : "border-border"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-2 size-6 text-text-subtle" />
            <p className="text-sm text-text-muted">
              Drag images here or <span className="text-brand underline">browse</span>
            </p>
            <span className="mt-1 block text-xs text-text-subtle">
              Recommended: 3–5 images, 1080×1080px minimum
            </span>
            {draft.product.imageNames.length > 0 && (
              <p className="mt-2 text-xs text-text-muted">
                {draft.product.imageNames.join(", ")}
              </p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-mono text-[11px] font-medium tracking-[0.08em] text-brand uppercase">
          Target Audience
        </h3>
        <div className="mb-4">
          <Label htmlFor="ideal-customer">Describe your ideal customer</Label>
          <Textarea
            id="ideal-customer"
            rows={3}
            value={draft.audience.idealCustomer}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                audience: { ...d.audience, idealCustomer: e.target.value },
              }))
            }
            className="mt-1 border-border bg-bg"
          />
          {errors.idealCustomer && (
            <p className="mt-1 text-xs text-danger">{errors.idealCustomer}</p>
          )}
        </div>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Primary regions</Label>
            <TagInput
              className="mt-1"
              tags={draft.audience.regions}
              onChange={(regions) =>
                setDraft((d) => ({ ...d, audience: { ...d.audience, regions } }))
              }
            />
          </div>
          <div>
            <Label>Languages</Label>
            <TagInput
              className="mt-1"
              tags={draft.audience.languages}
              onChange={(languages) =>
                setDraft((d) => ({
                  ...d,
                  audience: { ...d.audience, languages },
                }))
              }
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-mono text-[11px] font-medium tracking-[0.08em] text-brand uppercase">
          Budget
        </h3>
        <p className="mb-3 text-[13px] text-text-subtle">
          Hard caps — SolAI will never spend beyond these limits.
        </p>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BudgetSliderField
            label="Daily spend cap"
            value={draft.budget.dailyCap}
            min={10}
            max={2000}
            step={10}
            currency={draft.budget.currency}
            onChange={(dailyCap) =>
              setDraft((d) => ({
                ...d,
                budget: { ...d.budget, dailyCap },
              }))
            }
          />
          <BudgetSliderField
            label="Total campaign cap"
            value={draft.budget.totalCap}
            min={100}
            max={50000}
            step={100}
            currency={draft.budget.currency}
            onChange={(totalCap) =>
              setDraft((d) => ({
                ...d,
                budget: { ...d.budget, totalCap },
              }))
            }
          />
        </div>
        {errors.totalCap && (
          <p className="mb-3 text-sm text-danger" role="alert">
            {errors.totalCap}
          </p>
        )}
        <div className="flex gap-3 rounded-md border border-border bg-surface px-4 py-3.5">
          <Shield className="mt-0.5 size-4 shrink-0 text-brand" />
          <div>
            <strong className="block text-sm text-text">
              At {formatCurrencyAmount(draft.budget.dailyCap, draft.budget.currency)}
              /day, your budget runs for {duration} days.
            </strong>
            <p className="mt-1 text-[13px] text-text-muted">
              SolAI enforces hard limits at Swarm, Agent, and Task levels. The
              circuit breaker trips if per-minute spend exceeds 3× your baseline.
            </p>
          </div>
        </div>
      </section>
    </OnboardingLayout>
  );
}
