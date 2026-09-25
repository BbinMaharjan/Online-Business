"use client";

import { Container, Box, Typography, LinearProgress, Table, TableBody, TableCell, TableContainer, TableRow, Button, IconButton, Link } from "@mui/material";
import { useCart, useUpdateCartItem, useRemoveFromCart, useInvalidateCart } from "@/services/api/cart";
import EmptyState from "@/components/common/EmptyStateProducts";

export default function CartPage() {
  const { data: cartData, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const invalidateCart = useInvalidateCart();

  const items = cartData?.data?.items || [];
  const { subtotal, tax, shipping, total, discount, coupon } = cartData?.data || {};

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ py: 8 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (!cartData?.data || items.length === 0) {
    return (
      <Container>
        <Box sx={{ py: 8 }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Cart is empty
          </Typography>
          <Button variant="contained" component={Link} href="/products" sx={{ mt: 2 }}>
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Cart Summary
        </Typography>
      </Box>

      <TableContainer component="table">
        <Table sx={{ minWidth: 600 }}>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell />
          </TableRow>

          {items.map((item: any) => (
            <TableRow key={item._id}>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={item.image || "/placeholder-product.jpg"}
                    alt={item.productName}
                    style={{ width: 50, height: 50, objectFit: "cover", mr: 2 }}
                  />
                  <Typography variant="body2">{item.productName}</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">${item.price.toFixed(2)}</TableCell>
              <TableCell align="right">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  sx={{ width: 60, textAlign: "center" }}
                  onChange={(e) => updateCartItem.mutate({ itemId: item._id, quantity: Number(e.target.value) })}
                />
              </TableCell>
              <TableCell align="right">${item.subtotal?.toFixed(2) || 0}</TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeFromCart.mutate(item._id)}
                  aria-label="Remove from cart"
                >
                  <span>🗑</span>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          <TableRow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <TableCell colSpan={5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Subtotal</Typography>
                <Typography variant="h6">${subtotal?.toFixed(2) || 0}</Typography>
              </Box>
            </TableCell>
          </TableRow>

          {discount && coupon && (
            <TableRow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
              <TableCell colSpan={5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Discount ({coupon})</Typography>
                  <Typography variant="body2" color="success">-${discount?.toFixed(2) || 0}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}

          {tax && (
            <TableRow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
              <TableCell colSpan={5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">${tax?.toFixed(2) || 0}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}

          {shipping && (
            <TableRow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
              <TableCell colSpan={5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">${shipping?.toFixed(2) || 0}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}

          <TableRow sx={{ fontWeight: 700, borderTop: "2px solid", borderColor: "divider" }}>
            <TableCell colSpan={5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5">Total</Typography>
                <Typography variant="h5">${total?.toFixed(2) || 0}</Typography>
              </Box>
            </TableCell>
          </TableRow>
        </Table>
      </TableContainer>

      <Box sx={{ py: 4, px: 1 }}>
        <Button variant="contained" size="large" component={Link} href="/checkout" sx={{ width: "100%", mb: 2 }}>
          Proceed to checkout
        </Button>
        <Button variant="outlined" size="large" sx={{ width: "100%" }} onClick={() => invalidateCart()}>
          Clear cart
        </Button>
      </Box>
    </Container>
  );
}