"use client";

import { Container, Box, Typography, Grid, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser } from "@/services/api/auth";
import { useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { data: userData, isLoading } = useUser();
  const user = userData?.data;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Container sx={{ py: 8, px: 1, maxWidth: 800, margin: "0 auto" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container sx={{ py: 8, px: 1, maxWidth: 800, margin: "0 auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Welcome back, {user.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account, orders, and preferences.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Link href="/account/orders">
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                height: "100%",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                My Orders
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View your order history and track current orders
              </Typography>
            </Box>
          </Link>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Link href="/account/profile">
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                height: "100%",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Profile Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Update your personal information and preferences
              </Typography>
            </Box>
          </Link>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Link href="/account/addresses">
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                height: "100%",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Addresses
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage your shipping and billing addresses
              </Typography>
            </Box>
          </Link>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Link href="/account/wishlist">
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                height: "100%",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Wishlist
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View and manage your saved items
              </Typography>
            </Box>
          </Link>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Link href="/account/reviews">
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                height: "100%",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                My Reviews
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View and manage your product reviews
              </Typography>
            </Box>
          </Link>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Account Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1">{user.role}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Member Since
            </Typography>
            <Typography variant="body1">
              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}