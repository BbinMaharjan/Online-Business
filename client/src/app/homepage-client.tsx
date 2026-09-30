"use client";

import { ProductGrid } from "@/components/product/ProductGrid";
import { Icons } from "@/lib/icons";
import { useProducts } from "@/services/api";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const {
  ShoppingCart: CartIcon,
  LocalShipping: ShippingIcon,
  VerifiedUser: VerifiedIcon,
  SupportAgent: SupportIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} = Icons;

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

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
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
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                }}
              />
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  px: 4,
                  maxWidth: 600,
                  color: "white",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, mb: 2, lineHeight: 1.2 }}
                >
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
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 1,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                currentIndex === index ? "white" : "rgba(255,255,255,0.5)",
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
  {
    icon: ShippingIcon,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: VerifiedIcon,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: SupportIcon,
    title: "24/7 Support",
    description: "Dedicated help team",
  },
  {
    icon: CartIcon,
    title: "Secure Checkout",
    description: "SSL encrypted payments",
  },
];

export function HomepageClient() {
  const { data: featuredProducts, isLoading: productsLoading } = useProducts({
    limit: 8,
    sort: "featured",
  });

  return (
    <Container maxWidth="xl">
      {/* Hero Carousel */}
      <Box
        sx={{
          mb: 2,
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          mt: 2,
        }}
      >
        <HeroCarousel slides={heroSlides} />
      </Box>

      {/* Features Bar */}
      <Box
        sx={{
          mb: 6,
          py: 3,
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} sx={{ px: 4 }}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}
              >
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

      {/* Featured Products */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Featured Products
          </Typography>
          <Link href="/products" passHref>
            <Button variant="text">View All</Button>
          </Link>
        </Box>
        <ProductGrid
          products={featuredProducts?.data || []}
          loading={productsLoading}
          variant="featured"
        />
      </Box>
    </Container>
  );
}
