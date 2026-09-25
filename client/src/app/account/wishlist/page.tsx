"use client";

import { Container, Box, Typography, Paper, Grid, Button, IconButton, Alert, LinearProgress, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/services/api/wishlist";
import { useCart, useAddToCart } from "@/services/api/cart";
import { useUser } from "@/services/api/auth";
import ProductCard from "@/components/product/ProductCard";
import { Icons } from "@/lib/icons";

const { FavoriteBorder, AddShoppingCart, Delete } = Icons;
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const router = useRouter();
  const { data: userData } = useUser();
  const { data: wishlistData, isLoading, refetch } = useWishlist();
  const { data: cartData } = useCart();
  const addToCart = useAddToCart();

  const wishlist = wishlistData?.data || [];
  const cartItems = cartData?.data?.items || [];
  const cartProductIds = new Set(cartItems.map((item: any) => item.productId));

  const handleAddToCart = (product: any) => {
    const variantId = product.variants?.[0]?._id;
    addToCart.mutate({ productId: product._id, variantId, quantity: 1 });
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await apiClient.wishlist.remove(productId);
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to remove from wishlist");
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>My Wishlist</Typography>
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton variant="rectangular" height={350} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  if (!userData?.data) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please log in to view your wishlist
          </Alert>
          <Button variant="contained" component="a" href="/login?redirect=/account/wishlist">
            Log In
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>My Wishlist</Typography>

        {wishlist.length === 0 ? (
          <Paper elevation={1} sx={{ p: 6, textAlign: "center" }}>
            <FavoriteBorder sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>Your wishlist is empty</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Save items you love for later
            </Typography>
            <Button variant="contained" component="a" href="/products" startIcon={<AddShoppingCart />}>
              Explore Products
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body1" color="text.secondary">
                {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} in your wishlist
              </Typography>
              <Button variant="outlined" size="small" onClick={() => wishlist.forEach((item: any) => handleAddToCart(item.product))} startIcon={<AddShoppingCart />}>
                Add All to Cart
              </Button>
            </Box>
            <Grid container spacing={3}>
              {wishlist.map((item: any) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                  <ProductCard
                    product={item.product}
                    showWishlist={true}
                    onWishlistToggle={() => handleRemoveFromWishlist(item.product._id)}
                    inWishlist={true}
                    inCart={cartProductIds.has(item.product._id)}
                    onAddToCart={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Container>
  );
}

import { apiClient } from "@/lib/api-client";