"use client";

import React, { useState } from "react";
import { Container, Box, Grid, Typography, Button, TextField, InputAdornment, Select, MenuItem, Paper, Chip, IconButton, Skeleton } from "@mui/material";
import { Search, FilterList, ShoppingCart, FavoriteBorder } from "@mui/icons-material";
import { useProducts } from "@/services/api/products";
import { useCategories } from "@/services/api/categories";
import { useBrands } from "@/services/api/brands";
import { useAddToCart } from "@/services/api/cart";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/services/api/wishlist";
import ProductCard from "@/components/product/ProductCard";
import ProductGrid from "@/components/product/ProductGrid";
import { PRODUCT_SORT_OPTIONS } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

export function ProductsPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: productsData, isLoading: productsLoading } = useProducts({
    search: debouncedSearch,
    category: selectedCategory || undefined,
    brand: selectedBrand || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    sort: sortBy,
    page,
    limit: 12,
  });

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { data: wishlistData } = useWishlist();

  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const products = productsData?.data?.data || [];
  const pagination = productsData?.data?.meta?.pagination;
  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];
  const wishlistIds = new Set(wishlistData?.data?.map((item: any) => item.productId) || []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setPage(1);
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange([0, 1000]);
    setSortBy("featured");
    setPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedBrand || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          All Products
        </Typography>

        <Grid container spacing={3}>
          {/* Sidebar Filters */}
          <Grid item xs={12} md={3}>
            <Paper elevation={1} sx={{ p: 3, height: "fit-content", position: "sticky", top: 100 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6">Filters</Typography>
                {hasActiveFilters && (
                  <Button variant="text" size="small" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, display: "block" }}>Search</Typography>
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, display: "block" }}>Category</Typography>
                <Select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); handleFilterChange(); }}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat: any) => (
                    <MenuItem key={cat._id} value={cat.slug}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, display: "block" }}>Brand</Typography>
                <Select
                  value={selectedBrand}
                  onChange={(e) => { setSelectedBrand(e.target.value); handleFilterChange(); }}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">All Brands</MenuItem>
                  {brands.map((brand: any) => (
                    <MenuItem key={brand._id} value={brand.slug}>{brand.name}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, display: "block" }}>
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    size="small"
                    inputProps={{ min: 0, max: 1000 }}
                  />
                  <TextField
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                    size="small"
                    inputProps={{ min: 0, max: 1000 }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, display: "block" }}>Sort By</Typography>
                <Select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  fullWidth
                  size="small"
                >
                  {PRODUCT_SORT_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Paper>
          </Grid>

          {/* Products List */}
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {pagination ? `Showing ${(page - 1) * 12 + 1}–${Math.min(page * 12, pagination.total)} of ${pagination.total} products` : "No products found"}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton onClick={() => setViewMode("grid")} aria-label="Grid view" color={viewMode === "grid" ? "primary" : "default"}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, width: 20, height: 20 }}>
                    <Box sx={{ backgroundColor: "grey.300", borderRadius: 1 }} />
                    <Box sx={{ backgroundColor: "grey.300", borderRadius: 1 }} />
                    <Box sx={{ backgroundColor: "grey.300", borderRadius: 1 }} />
                    <Box sx={{ backgroundColor: "grey.300", borderRadius: 1 }} />
                  </Box>
                </IconButton>
                <IconButton onClick={() => setViewMode("list")} aria-label="List view" color={viewMode === "list" ? "primary" : "default"}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 20, height: 20 }}>
                    <Box sx={{ backgroundColor: "grey.300", borderRadius: 1, height: 6 }} />
                    <Box sx={{ backgroundColor: "grey.300", borderRadius: 1, height: 6 }} />
                    <Box sx={{ backgroundColor: "grey.300", borderRadius: 1, height: 6 }} />
                  </Box>
                </IconButton>
              </Box>
            </Box>

            {productsLoading ? (
              <ProductGrid products={[]} loading={true} />
            ) : products.length > 0 ? (
              <ProductGrid products={products} viewMode={viewMode} />
            ) : (
              <Paper elevation={1} sx={{ p: 6, textAlign: "center" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>No products found</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your filters or search terms
                </Typography>
                <Button variant="contained" onClick={clearFilters}>Clear Filters</Button>
              </Paper>
            )}

            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 1 }}>
                <Button
                  variant={page === 1 ? "outlined" : "text"}
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let pageNum = i + 1;
                  if (pagination.totalPages > 5) {
                    if (page > 3 && page < pagination.totalPages - 2) {
                      pageNum = page - 2 + i;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    }
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "contained" : "outlined"}
                      onClick={() => handlePageChange(pageNum)}
                      sx={{ minWidth: 40 }}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant={page === pagination.totalPages ? "outlined" : "text"}
                  disabled={page === pagination.totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}