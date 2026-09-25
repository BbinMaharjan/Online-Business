"use client";

import { Container, Box, Typography, LinearProgress, Grid } from "@mui/material";
import { notFound, useParams } from "next/navigation";
import { useBrandBySlug } from "@/services/api/brands";
import { useProducts } from "@/services/api/products";
import ProductCard from "@/components/product/ProductCard";

export default function BrandsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: brandData, isLoading: brandLoading, isError: brandError } = useBrandBySlug(slug);
  const { data: productsData, isLoading: productsLoading } = useProducts({
    brand: slug,
    limit: 12,
  });

  if (brandLoading) return <LinearProgress />;

  if (brandError || !brandData?.data) {
    notFound();
  }

  const brand = brandData.data;

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, display: "inline-block" }}>
          {brand.name}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ pt: 2 }}>
        {productsLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={i}>
              <ProductCard product={{ _id: `skeleton-${i}`, name: "Loading...", price: 0, images: [], brand: { name: "" }, category: { name: "" }, rating: 0, reviewCount: 0, stock: 0 } as any} />
            </Grid>
          ))
        ) : productsData?.data?.length ? (
          productsData.data.map((product: any) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
              No products from this brand
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}