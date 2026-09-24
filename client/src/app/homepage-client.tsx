"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Rating,
  Divider,
  Carousel,
  CarouselItem,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  SupportAgent as SupportIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { useProducts, useCategories, useBrands } from "@/services/api";
import { ProductGrid, SkeletonProductGrid } from "@/components/product/ProductGrid";
import { ProductCard } from "@/components/product/ProductCard";
import { Footer } from "@/components/footer/Footer";
import { getImageUrl, formatPrice, calculateDiscountPrice } from "@/lib/utils";
import type { Product, Category, Brand } from "@/types";

const heroSlides = [
  {
    title: "Summer Collection 2024",
    subtitle: "Up to 50% off on selected items",
    cta: "Shop Now",
    href: "/products?sort=newest",
    image: "/hero-1.jpg",
  },
  {
    title: "New Arrivals",
    subtitle: "Be the first to get the latest trends",
    cta: "Explore",
    href: "/products?sort=newest",
    image: "/hero-2.jpg",
  },
  {
    title: "Best Sellers",
    subtitle: "Customer favorites at great prices",
    cta: "View All",
    href: "/products?sort=best-selling",
    image: "/hero-3.jpg",
  },
];

const features = [
  { icon: ShippingIcon, title: "Free Shipping", description: "On orders over $50" },
  { icon: VerifiedIcon, title: "Easy Returns", description: "30-day return policy" },
  { icon: SupportIcon, title: "24/7 Support", description: "Dedicated help team" },
  { icon: CartIcon, title: "Secure Checkout", description: "SSL encrypted payments" },
];

const categoryIcons: Record<string, React.ReactNode> = {
  electronics: "📱",
  clothing: "👕",
  home: "🏠",
  sports: "⚽",
  beauty: "💄",
  books: "📚",
  toys: "🧸",
  automotive: "🚗",
};

export function HomepageClient() {
  const [heroIndex, setHeroIndex] = useState(0);

  const { data: featuredProducts, isLoading: productsLoading } = useProducts({
    featured: true,
    limit: 8,
    sort: "featured",
  });

  const { data: bestSellers, isLoading: bestSellersLoading } = useProducts({
    limit: 8,
    sort: "best-selling",
  });

  const { data: newArrivals, isLoading: newArrivalsLoading } = useProducts({
    limit: 8,
    sort: "newest",
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();

  return (
    <Container maxWidth="xl">
      {/* Hero Carousel */}
      <Box sx={{ mb: 6, borderRadius: 3, overflow: "hidden", position: "relative" }}>
        <Carousel
          autoPlay
          interval={5000}
          showArrows
          showIndicators={false}
          selectedIndex={heroIndex}
          onChangeIndex={setHeroIndex}
          sx={{ borderRadius: 3 }}
        >
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <Box
                sx={{
                  position: "relative",
                  height: 400,
                  backgroundColor: "grey.100",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                  }}
                />
                <Box sx={{ position: "relative", zIndex: 1, px: 4, maxWidth: 600, color: "white" }}>
                  <Typography variant="h3" fontWeight={700} sx={{ mb: 2, lineHeight: 1.2 }}>
                    {slide.title}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
                    {slide.subtitle}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    href={slide.href}
                    passHref
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {slide.cta}
                  </Button>
                </Box>
              </Box>
            </CarouselItem>
          ))}
        </Carousel>
      </Box>

      {/* Features Bar */}
      <Box sx={{ mb: 6, py: 3, backgroundColor: "primary.main", color: "primary.contrastText", borderRadius: 2 }}>
        <Grid container spacing={2} sx={{ px: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
                <Box
                  sx={{
                    p: 1,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <feature.icon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            Shop by Category
          </Typography>
          <Button variant="text" component={Link} href="/categories" passHref>
            View All
          </Button>
        </Box>
        {categoriesLoading ? (
          <SkeletonCategoryGrid />
        ) : categories?.data?.length ? (
          <Grid container spacing={2}>
            {categories.data.slice(0, 8).map((category: Category) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={category._id} xs={6} sm={4} md={3} lg={2}>
                <Link href={`/categories/${category.slug}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
                  <Card sx={{ height: "100%", textAlign: "center", p: 3, transition: "all 0.2s", "&:hover": { boxShadow: 3, transform: "translateY(-4px)" } }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        backgroundColor: "primary.50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        fontSize: 32,
                      }}
                    >
                      {categoryIcons[category.slug] || categoryIcons[category.name.toLowerCase()] || "📦"}
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {category.name}
                    </Typography>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Box>

      {/* Featured Products */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            Featured Products
          </Typography>
          <Button variant="text" component={Link} href="/products" passHref>
            View All
          </Button>
        </Box>
        <ProductGrid
          products={featuredProducts?.data?.data || []}
          loading={productsLoading}
          variant="featured"
        />
      </Box>

      {/* Best Sellers */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            Best Sellers
          </Typography>
          <Button variant="text" component={Link} href="/products?sort=best-selling" passHref>
            View All
          </Button>
        </Box>
        <ProductGrid
          products={bestSellers?.data?.data || []}
          loading={bestSellersLoading}
        />
      </Box>

      {/* New Arrivals */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            New Arrivals
          </Typography>
          <Button variant="text" component={Link} href="/products?sort=newest" passHref>
            View All
          </Button>
        </Box>
        <ProductGrid
          products={newArrivals?.data?.data || []}
          loading={newArrivalsLoading}
        />
      </Box>

      {/* Brands */}
      <Box sx={{ mb: 6, py: 4, backgroundColor: "grey.50", borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            Trusted Brands
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We partner with the best brands to bring you quality products
          </Typography>
        </Box>
        {brandsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" width={120} height={50} />
            ))}
          </Box>
        ) : brands?.data?.length ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, flexWrap: "wrap", py: 2 }}>
            {brands.data.slice(0, 10).map((brand: Brand) => (
              <Box key={brand._id} sx={{ opacity: 0.6, transition: "opacity 0.2s", "&:hover": { opacity: 1 } }}>
                <Link href={`/brands/${brand.slug}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
                  <Typography variant="h6" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {brand.name}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Box>
        ) : null}
      </Box>

      {/* Newsletter */}
      <Box sx={{ mb: 6, py: 6, textAlign: "center", backgroundColor: "grey.900", color: "white", borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
          Subscribe to Our Newsletter
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 500, mx: "auto", color: "grey.300" }}>
          Get the latest updates on new products and upcoming sales
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, maxWidth: 400, mx: "auto", flexWrap: "wrap" }}>
          <Box sx={{ flexGrow: 1, minWidth: 250 }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 8,
                border: "none",
                fontSize: "1rem",
                backgroundColor: "grey.800",
                color: "white",
                "&::placeholder": { color: "grey.500" },
              }}
            />
          </Box>
          <Button variant="contained" size="large" sx={{ px: 4, backgroundColor: "secondary.main", "&:hover": { backgroundColor: "secondary.dark" } }}>
            Subscribe
          </Button>
        </Box>
        <Typography variant="caption" sx={{ mt: 2, color: "grey.500" }}>
          By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
        </Typography>
      </Box>

      <Footer />
    </Container>
  );
}

function SkeletonCategoryGrid() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
          <Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: "auto", mb: 2 }} />
            <Skeleton variant="text" width="60%" sx={{ mx: "auto" }} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}