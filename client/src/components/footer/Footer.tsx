"use client";

import Link from "next/link";
import { Grid, Box, Typography, IconButton } from "@mui/material";
import { Icons } from "@/lib/icons";

const { Facebook, Instagram } = Icons;
import { APP_CONFIG } from "@/constants/app-config";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box role="contentinfo" sx={{ backgroundColor: "background.default" }}>
      <Box sx={{ py: 2, borderTop: 1, borderColor: "divider" }}>
        <Grid
          container
          spacing={2}
          sx={{ maxWidth: 1400, mx: "auto", px: 3, alignItems: "center" }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Link
              href="/"
              passHref
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                © {currentYear} {APP_CONFIG.name}. All rights reserved.
              </Typography>
            </Link>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                gap: 2,
                flexWrap: "wrap",
              }}
            >
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
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Footer;
