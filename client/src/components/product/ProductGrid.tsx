"use client";

import React from "react";
import { Grid, Skeleton, Box, Typography, Pagination, useMediaQuery, useTheme } from "@mui/material";
import { ProductCard } from "./ProductCard";
import { SkeletonProductCard } from "@/components/loading/SkeletonProductCard";
import { EmptyStateProducts } from "@/components/common/EmptyStateProducts";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  variant?: "default" | "compact" | "featured";
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

export function ProductGrid({
  products,
  loading = false,
  emptyMessage = "No products found",
  variant = "default",
  columns = { xs: 2, sm: 2, md: 3, lg: 4, xl: 5 },
  onLoadMore,
  hasMore,
  loadingMore,
}: ProductGridProps) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  const getColumns = () => {
    if (isXs) return columns.xs || 2;
    if (isSm) return columns.sm || 2;
    if (isMd) return columns.md || 3;
    if (isLg) return columns.lg || 4;
    if (isXl) return columns.xl || 5;
    return columns.lg || 4;
  };

  const cols = getColumns();

  if (loading) {
    const skeletonCount = Math.min(cols * 2, 8);
    return (
      <Grid container spacing={2}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={`skeleton-${i}`}>
            <SkeletonProductCard />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (products.length === 0) {
    return <EmptyStateProducts message={emptyMessage} />;
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={Math.floor(12 / cols)} key={product._id}>
            <ProductCard product={product} variant={variant} />
          </Grid>
        ))}
      </Grid>

      {(hasMore || loadingMore) && (
        <Box sx={{ textAlign: "center", mt: 4, mb: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onLoadMore}
            disabled={loadingMore}
            startIcon={loadingMore ? <Skeleton variant="circular" width={20} height={20} /> : undefined}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </Box>
      )}
    </Box>
  );
}

interface PaginatedProductGridProps {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading?: boolean;
  onPageChange: (page: number) => void;
  variant?: "default" | "compact" | "featured";
}

export function PaginatedProductGrid({
  products,
  pagination,
  loading = false,
  onPageChange,
  variant = "default",
}: PaginatedProductGridProps) {
  return (
    <Box>
      <ProductGrid
        products={products}
        loading={loading}
        variant={variant}
      />
      {pagination.totalPages > 1 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
            boundaryCount={1}
            siblingCount={1}
            disabled={loading}
          />
        </Box>
      )}
    </Box>
  );
}

export default ProductGrid;