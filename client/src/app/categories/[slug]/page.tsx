"use client";

import { Container, Box, Typography, LinearProgress, Grid } from "@mui/material";
import { notFound, useParams } from "next/navigation";
import { useCategories } from "@/services/api/categories";
import { useProducts } from "@/services/api/products";
import ProductGrid from "@/components/product/ProductGrid";

interface CategoryCardProps {
  category: any;
}

const CategoryCardComponent = ({ category }: CategoryCardProps) => {
  return (
    <Grid item xs={12} md={6} lg={4} sx={{ pb: 2 }}>
      <Box sx={{ p: 3, borderRadius: 2, background: "#fff", transition: "transform 0.2s" }}>
        <Typography variant="h6" component="h3" style={{ textAlign: "center" }}>
          {category.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" style={{ textAlign: "center", mt: 2 }}>
          {category.products?.length || 0} products
        </Typography>
      </Box>
    </Grid>
  );
};

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

      <Grid container sx={{ pt: 2 }}>
        {productsLoading ? (
          <ProductGrid products={[]} loading={true} />
        ) : productsData?.data?.data?.length ? (
          <ProductGrid products={productsData.data.data} />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8, width: "100%" }}>
            No products in this category
          </Typography>
        )}
      </Grid>
    </Container>
  );
}