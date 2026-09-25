"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs as MUIBreadcrumbs, Link as MUILink, Box } from "@mui/material";
import { Home as HomeIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeLabels: Record<string, string> = {
  products: "Products",
  categories: "Categories",
  brands: "Brands",
  search: "Search",
  cart: "Cart",
  checkout: "Checkout",
  account: "My Account",
  login: "Login",
  register: "Register",
  "forgot-password": "Forgot Password",
  "reset-password": "Reset Password",
  "verify-email": "Verify Email",
  profile: "Profile",
  orders: "Orders",
  addresses: "Addresses",
  wishlist: "Wishlist",
  reviews: "Reviews",
  about: "About Us",
  contact: "Contact Us",
  faq: "FAQ",
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  shipping: "Shipping Info",
  returns: "Returns",
  help: "Help Center",
  track: "Track Order",
  success: "Order Confirmation",
};

function formatLabel(segment: string): string {
  const cleanSegment = segment.replace(/^\[(.*)\]$/, "").replace(/-/g, " ");
  return cleanSegment
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function Breadcrumbs({ className, separator = <ChevronRightIcon fontSize="small" /> }: { className?: string; separator?: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const isDynamic = segment.startsWith("[") || /^[a-f\d]{24}$/i.test(segment);

    let label = routeLabels[segment] || formatLabel(segment);

    if (isDynamic && !isLast) {
      label = "...";
    }

    items.push({
      label,
      href: isLast || isDynamic ? undefined : currentPath,
    });
  });

  return (
    <Box
      component="nav"
      aria-label="Breadcrumb"
      sx={{
        mb: 2,
        overflow: "hidden",
        "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" },
        "& .MuiBreadcrumbs-li": { flexShrink: 0 },
        "& .MuiTypography-root": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
      }}
      className={cn("breadcrumbs", className)}
    >
      <MUIBreadcrumbs separator={separator}>
        {items.map((item) => (
          <MUILink
            key={item.href || item.label}
            component={item.href ? Link : "span"}
            href={item.href}
            underline="hover"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: item.href ? "text.primary" : "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            {item.label === "Home" && <HomeIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />}
            {item.label}
          </MUILink>
        ))}
      </MUIBreadcrumbs>
    </Box>
  );
}

export default Breadcrumbs;