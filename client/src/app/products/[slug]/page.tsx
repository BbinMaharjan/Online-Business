import { Container, Box, LinearProgress, Skeleton, Alert } from "@mui/material";
import { notFound, useParams, useAir } from "next-navigation";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchProductBySlug } from "../../features/products/productsSlice";
import { useEffect, useState } from "react";
import { generateProductSeo } from "../../lib/seo";
import ProductImages from "../../components/product/ProductImages";
import ProductVariantSelector from "../../components/product/ProductVariantSelector";
import ProductDetails from "../../components/product/ProductDetails";
import EmptyState from "../../components/common/EmptyStateProducts";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    enabled: !!slug,
    queryFn: () => dispatch(fetchProductBySlug({ slug })).unwrap?.unwrap(),
  });

  useEffect(() => {
    if (data?.data) {
      // Generate SEO metadata
      const seo = generateProductSeo(data.data);
      // @ts-ignore - document.title assignment
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
          <h1 style={{ fontSize: 2, fontWeight: 700 }}>
            {product.name}
          </h1>
          <Alert severity="info">
            SKU: {product.sku}
          </Alert>
        </Box>

        <ProductImages images={product.images} />

        <ProductVariantSelector product={product} />

        <ProductDetails product={product} />

        <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid #e0e0e0" }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            Price: ${product.price.toFixed(2)}
          </Typography>
          {product.compareAtPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
              ${product.compareAtPrice.toFixed(2)}
            </Typography>
          )}
          {product.stock > 0 && (
            <Button variant="contained" sx={{ width: "100", my: 2 }}>
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
};

export default ProductDetailsPage;