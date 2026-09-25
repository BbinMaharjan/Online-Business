"use client";

import { Container, Box, Typography, LinearProgress, Grid } from "@mui/material";
import { notFound, useParams } from "next/navigation";
import { useBrands } from "@/services/api/brands";
import { useProducts } from "@/services/api/products";
import ProductCard from "@/components/product/ProductCard";

interface BrandCardProps {
  brand: any;
}

const BrandCardComponent = ({ brand }: BrandCardProps) => {
  return (
    <Grid item xs={12} md={6} lg={4} sx={{ pb: 2 }}>
      <Box sx={{ p: 3, borderRadius: 2, background: "#fff", transition: "transform 0.2s" }}>
        <Typography variant="h6" component="h3" style={{ textAlign: "center" }}>
          {brand.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" style={{ textAlign: "center", mt: 2 }}>
          {brand.products?.length || 0} products
        </Typography>
      </Box>
    </Grid>
  );
};

export default function BrandsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: brandData, isLoading: brandLoading, isError: brandError } = useBrands(slug);
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
            <Grid item xs={12} md={6} lg={4} key={i}>
              <ProductCard product={{ _id: `skeleton-${i}`, name: "Loading...", price: 0, images: [], brand: { name: "" }, category: { name: "" }, rating: 0, reviewCount: 0, stock: 0 } as any} />
            </Grid>
          ))
        ) : productsData?.data?.data?.length ? (
          productsData.data.data.map((product: any) => (
            <Grid item xs={12} md={6} lg={4} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8, width: "100%" }}>
            No products from this brand
          </Typography>
        )}
      </Grid>
    </Container>
  );
}