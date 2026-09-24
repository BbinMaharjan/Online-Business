"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Stack,
  Chip,
  InputLabel,
  FormHelperText,
  Tooltip,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { getImageUrl, formatPrice } from "@/lib/utils";
import type { Product, Variant } from "@/types";

interface ProductVariantSelectorProps {
  product: Product;
  selectedVariant?: Variant | null;
  onVariantChange?: (variant: Variant | null) => void;
  onAddToCart?: (variant: Variant, quantity: number) => void;
  quantity?: number;
  disabled?: boolean;
  loading?: boolean;
}

export function ProductVariantSelector({
  product,
  selectedVariant: initialVariant,
  onVariantChange,
  onAddToCart,
  quantity = 1,
  disabled = false,
  loading = false,
}: ProductVariantSelectorProps) {
  const variants = product.variants || [];

  if (variants.length === 0) return null;

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(initialVariant || null);

  const groupedVariants = useMemo(() => {
    const groups: Record<string, Variant[]> = {};
    variants.forEach((variant) => {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        if (!groups[key]) groups[key] = [];
        if (!groups[key].some((v) => v.attributes[key] === value)) {
          groups[key].push(variant);
        }
      });
    });
    return groups;
  }, [variants]);

  const attributeKeys = Object.keys(groupedVariants);

  const filteredVariants = useMemo(() => {
    return variants.filter((variant) =>
      Object.entries(selectedAttributes).every(([key, value]) => variant.attributes[key] === value)
    );
  }, [variants, selectedAttributes]);

  const availableOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    attributeKeys.forEach((key) => {
      const values = new Set<string>();
      filteredVariants.forEach((v) => {
        if (v.attributes[key]) values.add(v.attributes[key]);
      });
      options[key] = Array.from(values);
    });
    return options;
  }, [attributeKeys, filteredVariants]);

  const isComplete = attributeKeys.length === 0 || attributeKeys.every((key) => selectedAttributes[key]);

  const autoSelectVariant = useMemo(() => {
    if (filteredVariants.length === 1 && isComplete) {
      return filteredVariants[0];
    }
    return null;
  }, [filteredVariants, isComplete]);

  useEffect(() => {
    if (autoSelectVariant && autoSelectVariant !== selectedVariant) {
      setSelectedVariant(autoSelectVariant);
      onVariantChange?.(autoSelectVariant);
    }
  }, [autoSelectVariant, onVariantChange]);

  const handleAttributeChange = (key: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [key]: value }));
    if (filteredVariants.length === 1 && isComplete) {
      const variant = filteredVariants[0];
      setSelectedVariant(variant);
      onVariantChange?.(variant);
    } else {
      setSelectedVariant(null);
      onVariantChange?.(null);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant && onAddToCart) {
      onAddToCart(selectedVariant, quantity);
    }
  };

  const getVariantImage = (variant: Variant) => {
    return variant.image || product.images?.[0];
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
        {attributeKeys.map((key) => {
          const options = availableOptions[key] || [];
          const isSelected = selectedAttributes[key];

          return (
            <Box key={key} sx={{ width: "100%" }}>
              <InputLabel sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 1 }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <span style={{ color: "red" }}>*</span>
              </InputLabel>
              <RadioGroup
                row
                value={isSelected || ""}
                onChange={(e) => handleAttributeChange(key, e.target.value)}
                sx={{ width: "100%" }}
              >
                {options.map((option) => {
                  const matchingVariants = filteredVariants.filter((v) => v.attributes[key] === option);
                  const inStock = matchingVariants.some((v) => v.stock > 0);
                  const minPrice = Math.min(...matchingVariants.map((v) => v.price));
                  const priceDelta = minPrice - product.price;

                  return (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={
                        <Radio
                          color="primary"
                          disabled={!inStock || disabled}
                          sx={{
                            "&.Mui-disabled": { opacity: 0.4 },
                          }}
                        />
                      }
                      label={
                        <Tooltip title={inStock ? "" : "Out of stock"}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              p: 1.5,
                              border: 2,
                              borderColor: isSelected === option ? "primary.main" : inStock ? "divider" : "grey.300",
                              borderRadius: 2,
                              backgroundColor: isSelected === option ? "primary.50" : inStock ? "transparent" : "grey.50",
                              cursor: inStock ? "pointer" : "not-allowed",
                              transition: "all 0.2s",
                              minWidth: 80,
                              textAlign: "center",
                              opacity: inStock ? 1 : 0.5,
                            }}
                          >
                            {key === "color" && (
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  backgroundColor: option.toLowerCase(),
                                  border: "2px solid",
                                  borderColor: isSelected === option ? "primary.main" : "divider",
                                  mb: 1,
                                  boxShadow: isSelected === option ? "0 0 0 2px white, 0 0 0 4px var(--palette-primary-main)" : "none",
                                }}
                              />
                            )}
                            <Typography variant="body2" fontWeight={isSelected === option ? 600 : 400}>
                              {option}
                            </Typography>
                            {priceDelta !== 0 && (
                              <Typography variant="caption" color={priceDelta > 0 ? "text.secondary" : "success.main"}>
                                {priceDelta > 0 ? `+${formatPrice(priceDelta)}` : formatPrice(priceDelta)}
                              </Typography>
                            )}
                          </Box>
                        </Tooltip>
                      }
                      disabled={!inStock || disabled}
                    />
                  );
                })}
              </RadioGroup>
              {attributeKeys.indexOf(key) < attributeKeys.length - 1 && !isSelected && (
                <FormHelperText sx={{ mt: 1, color: "text.secondary" }}>
                  Please select {key} to see available options
                </FormHelperText>
              )}
            </Box>
          );
        })}

        {selectedVariant && (
          <Box
            sx={{
              p: 2,
              border: 1,
              borderColor: "primary.main",
              borderRadius: 2,
              backgroundColor: "primary.50",
            }}
          >
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    overflow: "hidden",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Image
                    src={getImageUrl(getVariantImage(selectedVariant))}
                    alt={product.name}
                    fill
                    sizes="60px"
                    style={{ objectFit: "cover" }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Object.entries(selectedVariant.attributes)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    SKU: {selectedVariant.sku}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 150 }}>
                <Typography variant="h5" fontWeight={700}>
                  {formatPrice(selectedVariant.price)}
                </Typography>
                {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                    {formatPrice(selectedVariant.compareAtPrice)}
                  </Typography>
                )}
                <Chip
                  label={selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock})` : "Out of Stock"}
                  size="small"
                  color={selectedVariant.stock > 0 ? "success" : "error"}
                  icon={selectedVariant.stock > 0 ? "check_circle" : "cancel"}
                />
              </Box>
            </Stack>
          </Box>
        )}

        {!isComplete && attributeKeys.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please select all options to see price and availability
          </Alert>
        )}

        {selectedVariant && selectedVariant.stock === 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            This variant is currently out of stock
          </Alert>
        )}

        {onAddToCart && (
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!isComplete || !selectedVariant || selectedVariant.stock === 0 || disabled || loading}
            onClick={handleAddToCart}
            startIcon={loading ? <Box sx={{ width: 20, height: 20 }}><span className="MuiCircularProgress-root" style={{ width: 20, height: 20 }} /></Box> : undefined}
            sx={{ py: 1.5, fontWeight: 600, borderRadius: 2 }}
          >
            {loading ? "Adding..." : isComplete && selectedVariant ? "Add to Cart" : "Select Options"}
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default ProductVariantSelector;