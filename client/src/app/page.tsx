import { Metadata } from "next";
import { HomepageClient } from "./homepage-client";

export const metadata: Metadata = {
  title: "Storefront - Your Online Shop",
  description: "Discover quality products at great prices. Fast shipping, easy returns, secure checkout.",
  openGraph: {
    title: "Storefront - Your Online Shop",
    description: "Discover quality products at great prices.",
    type: "website",
  },
};

export default function Homepage() {
  return <HomepageClient />;
}