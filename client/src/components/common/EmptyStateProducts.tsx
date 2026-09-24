"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, Stack, Button, IconButton } from "@mui/material";
import { Search as SearchIcon, FilterListOff as ClearFiltersIcon, ShoppingBag as ShopIcon, Home as HomeIcon } from "@mui/icons-material";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  primaryAction?: { label: string; href: string; onClick?: () => void };
  secondaryAction?: { label: string; href: string; onClick?: () => void };
  suggestions?: string[];
}

export function EmptyState({
  icon,
  title,
  message,
  primaryAction,
  secondaryAction,
  suggestions,
}: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: "center", py: 10, px: 4 }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "primary.50",
          color: "primary.main",
          mb: 4,
        }}
      >
        {icon || <ShopIcon fontSize="large" sx={{ fontSize: 48 }} />}
      </Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
        {title}
      </Typography>
      {message && <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: "auto" }}>{message}</Typography>}

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: "wrap", mb: 4 }}>
        {primaryAction && (
          <Button
            variant="contained"
            size="large"
            component={primaryAction.href ? Link : "button"}
            href={primaryAction.href}
            onClick={primaryAction.onClick}
            startIcon={primaryAction.href === "/products" ? <SearchIcon /> : undefined}
          >
            {primaryAction.label}
          </Button>
        )}
        {secondaryAction && (
          <Button
            variant="outlined"
            size="large"
            component={secondaryAction.href ? Link : "button"}
            href={secondaryAction.href}
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </Stack>

      {suggestions && suggestions.length > 0 && (
        <Box sx={{ mt: 4, textAlign: "left", maxWidth: 400, mx: "auto" }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, display: "block" }}>
            Try:
          </Typography>
          <Stack direction="column" spacing={1}>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="text"
                size="small"
                component={Link}
                href="/products"
                startIcon={<SearchIcon fontSize="small" />}
                sx={{ justifyContent: "flex-start", textTransform: "none", color: "text.secondary", "&:hover": { color: "primary.main" } }}
              >
                {suggestion}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export function EmptyStateProducts({
  message = "We couldn't find any products matching your criteria.",
  onClearFilters,
  onSearch,
}: { message?: string; onClearFilters?: () => void; onSearch?: () => void } = {}) {
  return (
    <EmptyState
      icon={<ShopIcon fontSize="large" sx={{ fontSize: 48 }} />}
      title="No products found"
      message={message}
      primaryAction={{
        label: "Clear all filters",
        href: "/products",
        onClick: onClearFilters,
      }}
      secondaryAction={{
        label: "Browse all products",
        href: "/products",
        onClick: onSearch,
      }}
      suggestions={[
        "Remove some filters",
        "Try a different search term",
        "Check spelling",
        "Browse by category",
      ]}
    />
  );
}

export function EmptyStateCart() {
  return (
    <EmptyState
      icon={<ShopIcon fontSize="large" sx={{ fontSize: 48 }} />}
      title="Your cart is empty"
      message="Looks like you haven't added any products yet."
      primaryAction={{
        label: "Continue Shopping",
        href: "/products",
      }}
      secondaryAction={{
        label: "View Wishlist",
        href: "/account/wishlist",
      }}
    />
  );
}

export function EmptyStateWishlist() {
  return (
    <EmptyState
      icon={<IconButton sx={{ p: 0 }}><ShopIcon fontSize="large" sx={{ fontSize: 48 }} /></IconButton>}
      title="Your wishlist is empty"
      message="Save items you love for later."
      primaryAction={{
        label: "Explore Products",
        href: "/products",
      }}
    />
  );
}

export function EmptyStateOrders() {
  return (
    <EmptyState
      icon={<ShopIcon fontSize="large" sx={{ fontSize: 48 }} />}
      title="No orders yet"
      message="When you place an order, it will appear here."
      primaryAction={{
        label: "Start Shopping",
        href: "/products",
      }}
    />
  );
}

export function EmptyStateSearch({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<SearchIcon fontSize="large" sx={{ fontSize: 48, color: "primary.main" }} />}
      title={query ? `No results for "${query}"` : "No search results"}
      message={query
        ? "Try adjusting your search or browse our categories."
        : "Enter a search term to find products."}
      primaryAction={{
        label: "Browse All Products",
        href: "/products",
      }}
      suggestions={query
        ? [
            'Try a different keyword',
            'Check spelling',
            'Use fewer words',
            'Browse by category',
          ]
        : []}
    />
  );
}

export function EmptyStateAccount() {
  return (
    <EmptyState
      icon={<HomeIcon fontSize="large" sx={{ fontSize: 48 }} />}
      title="Please log in"
      message="Sign in to access your account, view orders, and manage your profile."
      primaryAction={{
        label: "Log In",
        href: "/login",
      }}
      secondaryAction={{
        label: "Create Account",
        href: "/register",
      }}
    />
  );
}

export default EmptyState;