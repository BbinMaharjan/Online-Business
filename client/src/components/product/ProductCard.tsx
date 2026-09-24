"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Stack,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon, ShoppingCart as CartIcon } from "@mui/icons-material";
import { useAddToCart, useToggleWishlist } from "@/services/api";
import { formatPrice, getImageUrl, calculateDiscountPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  showAddToCart?: boolean;
  showWishlist?: boolean;
  showQuickView?: boolean;
}

export function ProductCard({
  product,
  variant = "default",
  showAddToCart = true,
  showWishlist = true,
  showQuickView = false,
}: ProductCardProps) {
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { mutate: toggleWishlist, isPending: togglingWishlist } = useToggleWishlist();

  const isInWishlist = false;
  const { discount, discountPercent } = calculateDiscountPrice(product.price, product.compareAtPrice);
  const imageUrl = getImageUrl(product.images?.[0]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants?.length > 0) {
      // Navigate to product page for variant selection
      window.location.href = `/products/${product.slug}`;
    } else {
      addToCart({ productId: product._id, quantity: 1 });
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const isOutOfStock = product.stock === 0 || (product.variants?.length > 0 && product.variants.every((v) => v.stock === 0));

  if (variant === "compact") {
    return (
      <Link href={`/products/${product.slug}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
        <Card sx={{ display: "flex", height: 100, width: "100%" }}>
          <Box sx={{ width: 80, height: 80, flexShrink: 0, position: "relative" }}>
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="80px"
              style={{ objectFit: "cover", borderRadius: 1 }}
            />
            {isOutOfStock && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" color="white" fontWeight={600}>
                  Out of Stock
                </Typography>
              </Box>
            )}
          </Box>
          <CardContent sx={{ p: 1.5, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {product.name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {formatPrice(product.price)}
              </Typography>
              {product.compareAtPrice && (
                <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                  {formatPrice(product.compareAtPrice)}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.slug}`} passHref style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: 3,
            transform: "translateY(-4px)",
          },
        }}
      >
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={product.name}
            sx={{
              height: variant === "featured" ? 280 : 220,
              objectFit: "cover",
              transition: "transform 0.3s ease-in-out",
            }}
          />
          {discountPercent > 0 && (
            <Chip
              label={`${discountPercent}% OFF`}
              size="small"
              color="error"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                fontWeight: 700,
                borderRadius: 1,
                height: 24,
              }}
            />
          )}
          {isOutOfStock && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="white" fontWeight={600} sx={{ textTransform: "uppercase" }}>
                Out of Stock
              </Typography>
            </Box>
          )}
          {showWishlist && (
            <Tooltip title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
              <IconButton
                onClick={handleToggleWishlist}
                disabled={togglingWishlist}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(4px)",
                  "&:hover": { backgroundColor: "white" },
                }}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist ? (
                  <FavoriteIcon color="error" fontSize="medium" />
                ) : (
                  <FavoriteBorderIcon fontSize="medium" />
                )}
              </IconButton>
            </Tooltip>
          )}
          {showQuickView && (
            <Tooltip title="Quick View">
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(4px)",
                  "&:hover": { backgroundColor: "white" },
                }}
                aria-label="Quick View"
              >
                <Typography variant="caption" fontWeight={600} sx={{ px: 1 }}>
                  Quick View
                </Typography>
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2 }}>
          {product.brand && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
              {product.brand.name}
            </Typography>
          )}

          <Typography
            variant={variant === "featured" ? "h6" : "subtitle1"}
            component="h3"
            fontWeight={600}
            sx={{ mb: 1, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {product.name}
          </Typography>

          {product.rating && product.rating > 0 && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Rating
                name="rating"
                value={product.rating}
                size="small"
                readOnly
                precision={0.5}
              />
              <Typography variant="caption" color="text.secondary">
                ({product.reviewCount || 0})
              </Typography>
            </Stack>
          )}

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant={variant === "featured" ? "h6" : "subtitle1"} fontWeight={700}>
              {formatPrice(product.price)}
            </Typography>
            {product.compareAtPrice && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                {formatPrice(product.compareAtPrice)}
              </Typography>
            )}
            {discountPercent > 0 && (
              <Chip
                label={`${discountPercent}% OFF`}
                size="small"
                color="error"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.625rem", fontWeight: 700 }}
              />
            )}
          </Stack>

          {product.tags?.length && variant !== "compact" && (
            <Box sx={{ mb: 1.5 }}>
              {product.tags.slice(0, 3).map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>
          )}
        </CardContent>

        {showAddToCart && !isOutOfStock && (
          <Box sx={{ p: 2, pt: 0, borderTop: "1px solid", borderColor: "divider" }}>
            <Button
              fullWidth
              variant="contained"
              size="medium"
              startIcon={<CartIcon fontSize="small" />}
              onClick={handleAddToCart}
              disabled={addingToCart}
              sx={{
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </Box>
        )}

        {isOutOfStock && showAddToCart && (
          <Box sx={{ p: 2, pt: 0, borderTop: "1px solid", borderColor: "divider" }}>
            <Button
              fullWidth
              variant="outlined"
              size="medium"
              disabled
              sx={{ py: 1.5, color: "error.main", borderColor: "error.main" }}
            >
              Out of Stock
            </Button>
          </Box>
        )}
      </Card>
    </Link>
  );
}

export default ProductCard;