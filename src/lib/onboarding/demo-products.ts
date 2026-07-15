export interface DemoImportedProduct {
  id: string;
  source: "shopify" | "woo";
  name: string;
  description: string;
  price: string;
  currency: string;
  productUrl: string;
}

export const demoImportedProducts: DemoImportedProduct[] = [
  {
    id: "shopify-ankara-tee",
    source: "shopify",
    name: "Ankara Print Tee — Indigo",
    description:
      "Hand-cut Ankara wax-print t-shirt in indigo colourway. 100% cotton. Sizes XS–3XL. Made in Kigali.",
    price: "35.00",
    currency: "US$",
    productUrl: "https://inema.rw/products/ankara-tee-indigo",
  },
  {
    id: "shopify-kitenge-wrap",
    source: "shopify",
    name: "Kitenge Wrap Skirt — Sunrise",
    description:
      "Vibrant kitenge wrap skirt with adjustable waist tie. One size fits most. Handmade in Kigali.",
    price: "48.00",
    currency: "US$",
    productUrl: "https://inema.rw/products/kitenge-wrap-sunrise",
  },
  {
    id: "woo-ceramic-bowl",
    source: "woo",
    name: "Inema Ceramic Bowl — Earth",
    description:
      "Wheel-thrown ceramic serving bowl with matte earth glaze. Dishwasher safe. 28cm diameter.",
    price: "42000",
    currency: "RWF",
    productUrl: "https://inema.rw/shop/ceramic-bowl-earth",
  },
];
