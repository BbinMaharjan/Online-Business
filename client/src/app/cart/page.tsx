import { Container, Box, Typography, LinearProgress, Table, TableBody, TableCell, TableContainer, TableRow, Alert } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { selectCartItems, selectCartTotal } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../features/cart/cartSlice";
import EmptyState from "../../components/common/EmptyStateProducts";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: () => dispatch(fetchCart()).unwrap?.unwrap(),
  });

  const items = cartData?.data?.items || [];
  const { subtotal, tax, shipping, total } = cartData?.data || {};

  if (!cartData?.data) {
    return (
      <Container>
        <Box sx={{ py: 8 }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Cart is empty
          </Typography>
          <Button variant="contained" sx={{ mx: 2 }} component="a" href="/products">
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

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <TableContainer component="table">
          <Table sx={{ minWidth: 600 }}>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
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
                    sx={{ width: 50 }}
                    onChange={(e) => dispatch(updateCartItem(item._id, Number(e.target.value)))}
                  />
                </TableCell>
                <TableCell align="right">${item.subtotal?.toFixed(2) || 0}</TableCell>
              </TableRow>
            ))}

            <TableRow sx={{ borderTop: "1px solid #e0e0e0", paddingTop: 2 }}>
              <TableCell colSpan={4}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Subtotal</Typography>
                  <Typography variant="h6">${subtotal?.toFixed(2) || 0}</Typography>
                </Box>
              </TableCell>
            </TableRow>

            {tax && (
              <TableRow sx={{ borderTop: "1px solid #e0e0e0", paddingTop: 2 }}>
                <TableCell colSpan={4}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">${tax?.toFixed(2) || 0}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {shipping && (
              <TableRow sx={{ borderTop: "1px solid #e0e0e0", paddingTop: 2 }}>
                <TableCell colSpan={4}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2">${shipping?.toFixed(2) || 0}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            <TableRow sx={{ fontWeight: 700, borderTop: "2px solid #e0e0e0", paddingTop: 2 }}>
              <TableCell colSpan={4}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h5">Total</Typography>
                  <Typography variant="h5">${total?.toFixed(2) || 0}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          </Table>
        </Table>
      )}

      <Box sx={{ py: 4, px: 1 }}>
        <Button variant="contained" sx={{ width: "100%", mb: 2 }} component="a" href="/checkout">
          Proceed to checkout
        </Button>
        <Button variant="outlined" sx={{ width: "100%" }} onClick={() => dispatch(clearCart())}>
          Clear cart
        </Button>
      </Box>
    </Container>
  );
};

export default CartPage;