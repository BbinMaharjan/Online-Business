"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Grid,
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Truck as TruckIcon,
  Support as SupportIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { APP_CONFIG } from "@/constants/app-config";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  marketing: z.boolean().optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Brands", href: "/brands" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Best Sellers", href: "/products?sort=best-selling" },
    { label: "Sale", href: "/products?sort=price-asc" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Affiliates", href: "/affiliates" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "FAQs", href: "/faq" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Track Order", href: "/track-order" },
    { label: "Contact Support", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ],
};

const paymentMethods = [
  { label: "Visa", icon: "💳" },
  { label: "Mastercard", icon: "💳" },
  { label: "American Express", icon: "💳" },
  { label: "PayPal", icon: "🅿️" },
  { label: "Apple Pay", icon: "🍎" },
  { label: "Google Pay", icon: "🅶" },
];

const trustBadges = [
  { icon: LockIcon, label: "Secure Checkout", description: "SSL encrypted payments" },
  { icon: TruckIcon, label: "Free Shipping", description: "On orders over $50" },
  { icon: SupportIcon, label: "24/7 Support", description: "Dedicated help team" },
  { icon: VerifiedIcon, label: "Easy Returns", description: "30-day return policy" },
];

const socialLinks = [
  { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
  { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { icon: YouTubeIcon, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      // In production, call API to subscribe
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Thanks for subscribing!");
      setNewsletterSubmitted(true);
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" sx={{ backgroundColor: "background.default" }}>
      <Box sx={{ py: 4, borderBottom: 1, borderColor: "divider" }}>
        <Grid container spacing={4} sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
          {trustBadges.map((badge, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                  <Typography variant="subtitle2" fontWeight={600}>
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
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box sx={{ maxWidth: 280 }}>
              <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: "-0.02em", mb: 2 }}>
                  {APP_CONFIG.name}
                </Typography>
              </Link>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                Your trusted online marketplace for quality products at great prices.
                Fast shipping, easy returns, and exceptional customer service.
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
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

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Shop
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.shop.map((link) => (
                <Link key={link.href} href={link.href} passHref style={{ textDecoration: "none", color: "inherit" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.company.map((link) => (
                <Link key={link.href} href={link.href} passHref style={{ textDecoration: "none", color: "inherit" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Support
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.support.map((link) => (
                <Link key={link.href} href={link.href} passHref style={{ textDecoration: "none", color: "inherit" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.legal.map((link) => (
                <Link key={link.href} href={link.href} passHref style={{ textDecoration: "none", color: "inherit" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ py: 4 }}>
        <Grid container spacing={4} sx={{ maxWidth: 1400, mx: "auto", px: 3, alignItems: "center" }}>
          <Grid item xs={12} md={6}>
            {newsletterSubmitted ? (
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography variant="body2" color="success.main" sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" }, gap: 1 }}>
                  <EmailIcon fontSize="small" /> Thanks for subscribing! Check your inbox for updates.
                </Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "stretch" }}>
                <Box sx={{ flexGrow: 1 }}>
                  <TextField
                    {...register("email")}
                    label="Email address"
                    placeholder="Enter your email"
                    size="small"
                    fullWidth
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <EmailIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                      ),
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5 }}>
                  <FormControlLabel
                    control={<Checkbox {...register("marketing")} size="small" />}
                    label="Receive marketing emails"
                    labelPlacement="end"
                    sx={{ typography: { variant: "caption", color: "text.secondary" } }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={isSubmitting}
                    sx={{ whiteSpace: "nowrap", minHeight: 40 }}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </Box>
              </form>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Secure Payment Methods
              </Typography>
              <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" }, gap: 1.5, flexWrap: "wrap" }}>
                {paymentMethods.map((method) => (
                  <Box
                    key={method.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1.5,
                      py: 0.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      backgroundColor: "background.paper",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    <span>{method.icon}</span>
                    {method.label}
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ py: 2, borderTop: 1, borderColor: "divider" }}>
        <Grid container spacing={2} sx={{ maxWidth: 1400, mx: "auto", px: 3, alignItems: "center" }}>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: { xs: "center", md: "left" } }}>
              Made with care for customers everywhere.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" }, gap: 2, flexWrap: "wrap" }}>
              {footerLinks.legal.slice(0, 3).map((link) => (
                <Link key={link.href} href={link.href} passHref style={{ textDecoration: "none", color: "inherit" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </footer>
  );
}

export default Footer;