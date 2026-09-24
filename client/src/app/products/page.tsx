import { Metadata } from "next";
import { ProductsPageClient } from "./products-page-client";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete product catalog. Filter by category, brand, price, and more.",
  openGraph: {
    title: "All Products - Storefront",
    description: "Browse our complete product catalog.",
    type: "website",
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}