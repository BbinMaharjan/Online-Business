"use client";

import React from "react";
import Link from "next/link";
import {
  Grid,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Icons } from "@/lib/icons";

const { Facebook, Instagram, Lock, LocalShipping: TruckIcon, SupportAgent: SupportIcon, VerifiedUser: VerifiedIcon } = Icons;
import { APP_CONFIG } from "@/constants/app-config";

const trustBadges = [
  { icon: Lock, label: "Secure Checkout", description: "SSL encrypted payments" },
  { icon: TruckIcon, label: "Free Shipping", description: "On orders over $50" },
  { icon: SupportIcon, label: "24/7 Support", description: "Dedicated help team" },
  { icon: VerifiedIcon, label: "Easy Returns", description: "30-day return policy" },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box role="contentinfo" sx={{ backgroundColor: "background.default" }}>
      <Box sx={{ py: 4, borderBottom: 1, borderColor: "divider" }}>
        <Grid container spacing={4} sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
          {trustBadges.map((badge, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <badge.icon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {badge.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {badge.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ py: 6, borderBottom: 1, borderColor: "divider" }}>
        <Grid container spacing={6} sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Box sx={{ maxWidth: 280 }}>
              <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: "-0.02em", mb: 2 }}>
                  {APP_CONFIG.name}
                </Typography>
              </Link>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your trusted online marketplace for quality products at great prices.
                Fast shipping, easy returns, and exceptional customer service.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>
                © {currentYear} {APP_CONFIG.name}. All rights reserved.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    size="small"
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "50%",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: "primary.light",
                        color: "primary.contrastText",
                      },
                    }}
                  >
                    <social.icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ py: 2, borderTop: 1, borderColor: "divider" }}>
        <Grid container spacing={2} sx={{ maxWidth: 1400, mx: "auto", px: 3, alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: { xs: "center", md: "left" } }}>
              Made with care for customers everywhere.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" }, gap: 2, flexWrap: "wrap" }}>
              <Link href="/privacy" passHref style={{ textDecoration: "none", color: "inherit" }}>
                <Typography variant="caption" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                  Privacy Policy
                </Typography>
              </Link>
              <Link href="/terms" passHref style={{ textDecoration: "none", color: "inherit" }}>
                <Typography variant="caption" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                  Terms of Service
                </Typography>
              </Link>
              <Link href="/cookies" passHref style={{ textDecoration: "none", color: "inherit" }}>
                <Typography variant="caption" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                  Cookie Policy
                </Typography>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Footer;