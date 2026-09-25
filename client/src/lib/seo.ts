import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  openGraph?: {
    title: string;
    description: string;
    images?: { url: string }[];
    type?: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images?: string[];
  };
  keywords?: string[];
  authors?: { name: string }[];
  type?: string;
}

export const generateProductSeo = (product: any): SEOProps => {
  const {
    name,
    brand,
    description,
    price,
    compareAtPrice,
    slug,
  } = product;

  const title = name || "E-Commerce Storefront";
  const descriptionMeta =
    description ||
    "High-quality products at competitive prices";

  const brandName = brand?.name || "";

  return {
    title: `${title} - ${brandName || "Store"}`,
    description: descriptionMeta,
    openGraph: {
      title,
      description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
    keywords: [
      name,
      brandName,
      ...(product.tags || []),
    ],
    authors: [{ name: "E-Commerce Storefront" }],
    type: "website",
  };
};

export const generateCategorySeo = (category: any): SEOProps => {
  const { name, description, slug } = category;

  return {
    title: `${name || "Category"} - ${name || "Store"}`,
    description: description || "Browse products in this category",
    openGraph: {
      title: name || "Category",
      description: description || "Browse products in this category",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: name || "Category",
      description: description || "Browse products in this category",
    },
  };
};

export const generateBrandSeo = (brand: any): SEOProps => {
  const { name, description } = brand;

  return {
    title: `${name || "Brand"} - ${name || "Store"}`,
    description: description || "Products from this brand",
    openGraph: {
      title: name || "Brand",
      description: description || "Products from this brand",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: name || "Brand",
      description: description || "Products from this brand",
    },
  };
};

export const metadata = (title: string, description: string): Metadata => {
  return {
    title,
    description,
  };
};