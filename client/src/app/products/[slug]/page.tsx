"use client";

import { Container, Box, LinearProgress, Alert, Typography, Button } from "@mui/material";
import { notFound, useParams } from "next/navigation";
import { useProductBySlug } from "@/services/api/products";
import { generateProductSeo } from "@/lib/seo";
import ProductImages from "@/components/product/ProductImages";
import ProductVariantSelector from "@/components/product/ProductVariantSelector";
import ProductDetails from "@/components/product/ProductDetails";
import { useEffect } from "react";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, isError } = useProductBySlug(slug);

  useEffect(() => {
    if (data?.data) {
      const seo = generateProductSeo(data.data);
      document.title = seo.title;
    }
  }, [data]);

  if (isLoading) return <LinearProgress />;
  if (isError || !data?.data) notFound();

  const product = data.data;

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {product.name}
          </Typography>
          <Alert severity="info">
            SKU: {product.sku || "N/A"}
          </Alert>
        </Box>

        <ProductImages images={product.images || []} />

        <ProductVariantSelector product={product} />

        <ProductDetails product={product} />

        <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            Price: {formatPrice(product.price)}
          </Typography>
          {product.compareAtPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
              {formatPrice(product.compareAtPrice)}
            </Typography>
          )}
          {product.stock && product.stock > 0 && (
            <Button variant="contained" size="large" sx={{ mt: 2, minWidth: 200 }}>
              Add to cart
            </Button>
          )}
          {product.stock === 0 && (
            <Typography variant="body2" color="error">
              Out of stock
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}