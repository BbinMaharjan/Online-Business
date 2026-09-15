import { Container, Box, Typography, Grid } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuthUser } from "../../features/auth/authSlice";

const AccountPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <Container sx={{ py: 8, px: 1, maxWidth: 600, margin: "0 auto" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Redirecting to login...
          </Typography>
        </Box>
      </Container>
    );
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
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              height: "100%",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: 3 },
            }}
            onClick={() => navigate("/account/orders")}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              My Orders
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              View your order history and track current orders
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              height: "100%",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: 3 },
            }}
            onClick={() => navigate("/account/profile")}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Profile Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Update your personal information and preferences
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              height: "100%",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: 3 },
            }}
            onClick={() => navigate("/account/addresses")}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Addresses
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Manage your shipping and billing addresses
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              height: "100%",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: 3 },
            }}
            onClick={() => navigate("/account/wishlist")}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Wishlist
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              View and manage your saved items
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Account Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1">{user.role}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
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
};

export default AccountPage;