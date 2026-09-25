"use client";

import { useState, useEffect, useCallback } from "react";
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
  IconButton,
  Skeleton,
} from "@mui/material";
import { Icons } from "@/lib/icons";

const { ShoppingCart: CartIcon, LocalShipping: ShippingIcon, VerifiedUser: VerifiedIcon, SupportAgent: SupportIcon, KeyboardArrowLeft, KeyboardArrowRight } = Icons;
import { useProducts, useCategories, useBrands } from "@/services/api";
import { ProductGrid } from "@/components/product/ProductGrid";
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

function HeroCarousel({ slides }: { slides: typeof heroSlides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goToNext = useCallback(() => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Box key={index} sx={{ flexShrink: 0, width: "100%" }}>
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
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.2 }}>
                  {slide.title}
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
                  {slide.subtitle}
                </Typography>
                <Link href={slide.href} passHref>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {slide.cta}
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <IconButton
        onClick={goToPrev}
        aria-label="Previous slide"
        sx={{
          position: "absolute",
          top: "50%",
          left: 16,
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          zIndex: 1,
        }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={goToNext}
        aria-label="Next slide"
        sx={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          zIndex: 1,
        }}
      >
        <KeyboardArrowRight />
      </IconButton>
      <Box sx={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 1 }}>
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: currentIndex === index ? "white" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

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
        <HeroCarousel slides={heroSlides} />
      </Box>

      {/* Features Bar */}
      <Box sx={{ mb: 6, py: 3, backgroundColor: "primary.main", color: "primary.contrastText", borderRadius: 2 }}>
        <Grid container spacing={2} sx={{ px: 4 }}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
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
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Shop by Category
          </Typography>
          <Link href="/categories" passHref>
            <Button variant="text">View All</Button>
          </Link>
        </Box>
        {categoriesLoading ? (
          <SkeletonCategoryGrid />
        ) : categories?.data?.length ? (
          <Grid container spacing={2}>
            {categories.data.slice(0, 8).map((category: Category) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={category._id}>
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
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
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
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Featured Products
          </Typography>
          <Link href="/products" passHref>
            <Button variant="text">View All</Button>
          </Link>
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
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Best Sellers
          </Typography>
          <Link href="/products?sort=best-selling" passHref>
            <Button variant="text">View All</Button>
          </Link>
        </Box>
        <ProductGrid
          products={bestSellers?.data?.data || []}
          loading={bestSellersLoading}
        />
      </Box>

      {/* New Arrivals */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            New Arrivals
          </Typography>
          <Link href="/products?sort=newest" passHref>
            <Button variant="text">View All</Button>
          </Link>
        </Box>
        <ProductGrid
          products={newArrivals?.data?.data || []}
          loading={newArrivalsLoading}
        />
      </Box>

      {/* Brands */}
      <Box sx={{ mb: 6, py: 4, backgroundColor: "grey.50", borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
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
                  <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
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
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
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
        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={i}>
          <Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: "auto", mb: 2 }} />
            <Skeleton variant="text" width="60%" sx={{ mx: "auto" }} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}