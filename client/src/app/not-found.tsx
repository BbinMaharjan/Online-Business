import { Metadata } from "next";
import Link from "next/link";
import { Container, Box, Typography, Button, Link as MuiLink } from "@mui/material";
import { Home, Search, ShoppingCart, ArrowBack } from "@mui/icons-material";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: "noindex",
};

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Box
          sx={{
            fontSize: "12rem",
            fontWeight: 900,
            color: "primary.main",
            lineHeight: 1,
            mb: 2,
            textShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          404
        </Box>

        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
          Page Not Found
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, color: "text.secondary", maxWidth: 500, mx: "auto" }}>
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/"
            passHref
            startIcon={<Home />}
            sx={{ px: 4 }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/products"
            passHref
            startIcon={<Search />}
            sx={{ px: 4 }}
          >
            Browse Products
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/cart"
            passHref
            startIcon={<ShoppingCart />}
            sx={{ px: 4 }}
          >
            View Cart
          </Button>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Or go back to the previous page
          </Typography>
          <Button
            variant="text"
            onClick={() => window.history.back()}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
        </Box>

        <Divider sx={{ my: 6 }} />

        <Box sx={{ textAlign: "left", maxWidth: 500, mx: "auto" }}>
          <Typography variant="subtitle1" sx={{ mb: 2, display: "block" }}>
            Popular destinations:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
            {[
              { href: "/products", label: "All Products" },
              { href: "/categories", label: "Categories" },
              { href: "/brands", label: "Brands" },
              { href: "/account", label: "My Account" },
              { href: "/cart", label: "Shopping Cart" },
              { href: "/contact", label: "Contact Us" },
              { href: "/faq", label: "Help Center" },
            ].map((item) => (
              <MuiLink key={item.href} href={item.href} sx={{ px: 2, py: 1, color: "primary.main", fontSize: "0.875rem", border: "1px solid", borderColor: "primary.light", borderRadius: 2, textDecoration: "none", "&:hover": { backgroundColor: "primary.50" } }}>
                {item.label}
              </MuiLink>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}