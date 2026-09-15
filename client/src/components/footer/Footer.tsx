import { Grid, Box, Typography, Divider, Link } from "@mui/material";

const Footer = () => {
  return (
    <Grid container direction="column" sx={{ py: 6, px: 1, bgcolor: "#f5f5f5" }}>
      <Grid item>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>
          Storefront
        </Typography>
        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} E-Commerce Storefront. All rights reserved.
        </Typography>
      </Grid>

      <Grid item sx={{ mt: 4 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Shop
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item>
            <Link href="/products" style={{ textDecoration: "none", color: "inherit" }}>
              Products
            </Link>
          </Grid>
          <Grid item>
            <Link href="/categories" style={{ textDecoration: "none", color: "inherit" }}>
              Categories
            </Link>
          </Grid>
          <Grid item>
            <Link href="/brands" style={{ textDecoration: "none", color: "inherit" }}>
              Brands
            </Link>
          </Grid>
        </Grid>
      </Grid>

      <Grid item sx={{ mt: 4 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Company
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item>
            <Link href="/about" style={{ textDecoration: "none", color: "inherit" }}>
              About
            </Link>
          </Grid>
          <Grid item>
            <Link href="/contact" style={{ textDecoration: "none", color: "inherit" }}>
              Contact
            </Link>
          </Grid>
          <Grid item>
            <Link href="/faq" style={{ textDecoration: "none", color: "inherit" }}>
              FAQ
            </Link>
          </Grid>
        </Grid>
      </Grid>

      <Grid item sx={{ mt: 4 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Support
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item>
            <Link href="/terms" style={{ textDecoration: "none", color: "inherit" }}>
              Terms
            </Link>
          </Grid>
          <Grid item>
            <Link href="/privacy" style={{ textDecoration: "none", color: "inherit" }}>
              Privacy
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Footer;