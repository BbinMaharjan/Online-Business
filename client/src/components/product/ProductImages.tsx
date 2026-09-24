"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Expand as ExpandIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { getImageUrl } from "@/lib/utils";

interface ProductImagesProps {
  images: string[];
  alt?: string;
  priority?: boolean;
}

export function ProductImages({ images, alt = "Product", priority = false }: ProductImagesProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const mainImageRef = useRef<HTMLDivElement>(null);

  const validImages = images.filter(Boolean).length > 0 ? images : ["/placeholder-product.jpg"];

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!fullscreenOpen) return;
    if (e.key === "ArrowLeft") {
      setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    } else if (e.key === "ArrowRight") {
      setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    } else if (e.key === "Escape") {
      setFullscreenOpen(false);
    }
  };

  useEffect(() => {
    if (fullscreenOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [fullscreenOpen]);

  const openFullscreen = () => {
    setFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setFullscreenOpen(false);
  };

  if (validImages.length === 1) {
    return (
      <Box
        ref={mainImageRef}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "grey.100",
        }}
      >
        <Image
          src={getImageUrl(validImages[0])}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          style={{ objectFit: "cover", transition: "opacity 0.3s" }}
          onLoad={() => handleImageLoad(0)}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 1,
            }}
          >
            <IconButton
              onClick={openFullscreen}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(4px)",
                "&:hover": { backgroundColor: "white" },
              }}
              aria-label="View fullscreen"
            >
              <ExpandIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <>
      <Box
        ref={mainImageRef}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "grey.100",
        }}
        onClick={!isMobile ? openFullscreen : undefined}
      >
        {validImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              inset: 0,
              opacity: selectedIndex === index ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden={selectedIndex !== index}
          >
            <Image
              src={getImageUrl(image)}
              alt={`${alt} ${index + 1}`}
              fill
              priority={priority && index === 0}
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              onLoad={() => handleImageLoad(index)}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
          </Box>
        ))}

        {validImages.length > 1 && !isMobile && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
              }}
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(4px)",
                "&:hover": { backgroundColor: "white" },
                zIndex: 2,
              }}
              aria-label="Previous image"
              disabled={selectedIndex === 0}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
              }}
              sx={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(4px)",
                "&:hover": { backgroundColor: "white" },
                zIndex: 2,
              }}
              aria-label="Next image"
              disabled={selectedIndex === validImages.length - 1}
            >
              <ChevronRightIcon />
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 2,
              }}
            >
              <IconButton
                onClick={openFullscreen}
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(4px)",
                  "&:hover": { backgroundColor: "white" },
                }}
                aria-label="View fullscreen"
              >
                <ExpandIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        )}
      </Box>

      {validImages.length > 1 && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 1,
            overflowX: "auto",
            pb: 1,
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": { background: "grey.400", borderRadius: 2 },
          }}
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {validImages.map((image, index) => (
            <Button
              key={index}
              variant={selectedIndex === index ? "contained" : "outlined"}
              size="small"
              disableRipple
              onClick={() => setSelectedIndex(index)}
              sx={{
                flexShrink: 0,
                width: isMobile ? 70 : 90,
                height: isMobile ? 70 : 90,
                padding: 0,
                borderRadius: 1,
                backgroundColor: selectedIndex === index ? "primary.main" : "transparent",
                borderColor: selectedIndex === index ? "primary.main" : "divider",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: selectedIndex === index ? "primary.dark" : "action.hover",
                },
              }}
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={`View image ${index + 1}`}
            >
              <Box sx={{ position: "relative", width: "100%", height: "100%", borderRadius: 1, overflow: "hidden" }}>
                <Image
                  src={getImageUrl(image)}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  sizes="90px"
                  style={{ objectFit: "cover" }}
                  onLoad={() => handleImageLoad(index)}
                />
              </Box>
            </Button>
          ))}
        </Box>
      )}

      <Dialog
        open={fullscreenOpen}
        onClose={closeFullscreen}
        fullScreen
        maxWidth={false}
        PaperProps={{ sx: { backgroundColor: "#000", p: 0 } }}
        BackdropProps={{ sx: { backgroundColor: "#000" } }}
      >
        <DialogContent sx={{ overflow: "hidden" }}>
          <IconButton
            onClick={closeFullscreen}
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1400,
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
            }}
            aria-label="Close fullscreen"
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))}
              sx={{
                position: "absolute",
                left: 24,
                color: "white",
                backgroundColor: "rgba(255,255,255,0.2)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
              }}
              aria-label="Previous image"
              disabled={validImages.length === 1}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>

            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 4 }}>
              <Image
                src={getImageUrl(validImages[selectedIndex])}
                alt={`${alt} ${selectedIndex + 1}`}
                width={1200}
                height={1200}
                style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain" }}
                priority
              />
            </Box>

            <IconButton
              onClick={() => setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))}
              sx={{
                position: "absolute",
                right: 24,
                color: "white",
                backgroundColor: "rgba(255,255,255,0.2)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
              }}
              aria-label="Next image"
              disabled={validImages.length === 1}
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </Box>

          {validImages.length > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                p: 2,
                overflowX: "auto",
              }}
            >
              {validImages.map((image, index) => (
                <Button
                  key={index}
                  variant={selectedIndex === index ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setSelectedIndex(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    padding: 0,
                    borderRadius: 1,
                    color: "white",
                    borderColor: selectedIndex === index ? "primary.main" : "rgba(255,255,255,0.5)",
                    backgroundColor: selectedIndex === index ? "primary.main" : "transparent",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: selectedIndex === index ? "primary.dark" : "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative", width: "100%", height: "100%", borderRadius: 1, overflow: "hidden" }}>
                    <Image
                      src={getImageUrl(image)}
                      alt={`${alt} thumbnail ${index + 1}`}
                      fill
                      sizes="80px"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                </Button>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductImages;