"use client";

import { Container, Box, Typography, Paper, Grid, Button } from "@mui/material";
import { useWishlist } from "@/services/api/wishlist";
import { useUser } from "@/services/api/auth";
import { useAddToCart } from "@/services/api/cart";
import ProductCard from "@/components/product/ProductCard";
import { Icons } from "@/lib/icons";

const { FavoriteBorder, AddShoppingCart } = Icons;

export default function WishlistPage() {
  const { data: userData } = useUser();
  const { data: wishlistData, isLoading } = useWishlist();
  const addToCart = useAddToCart();

  const wishlist = wishlistData?.data || [];

  const handleAddToCart = (product: any) => {
    const variantId = product.variants?.[0]?._id;
    addToCart.mutate({ productId: product._id, variantId, quantity: 1 });
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>My Wishlist</Typography>
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                <Paper elevation={0} sx={{ height: 350, backgroundColor: "grey.100" }} />
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
          <Typography variant="h5" sx={{ mb: 2 }}>Please log in to view your wishlist</Typography>
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
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item._id}>
                  <ProductCard
                    product={item.product}
                    showWishlist={true}
                    showAddToCart={true}
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