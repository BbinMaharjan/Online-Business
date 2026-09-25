"use client";

import { Container, Box, Typography, LinearProgress, Grid } from "@mui/material";
import { notFound, useParams } from "next/navigation";
import { useCategories } from "@/services/api/categories";
import { useProducts } from "@/services/api/products";
import ProductGrid from "@/components/product/ProductGrid";

export default function CategoriesPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useCategories(slug);
  const { data: productsData, isLoading: productsLoading } = useProducts({
    category: slug,
    limit: 10,
  });

  if (categoryLoading) return <LinearProgress />;

  if (categoryError || !categoryData?.data) {
    notFound();
  }

  const category = categoryData.data;

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, display: "inline-block" }}>
          {category.name}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ pt: 2 }}>
        {productsLoading ? (
          <Grid size={12}>
            <ProductGrid products={[]} loading={true} />
          </Grid>
        ) : productsData?.data?.data?.length ? (
          <Grid size={12}>
            <ProductGrid products={productsData.data.data} />
          </Grid>
        ) : (
          <Grid size={12}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
              No products in this category
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}