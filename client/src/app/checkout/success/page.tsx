"use client";

import { Container, Box, Typography, Alert, Button, LinearProgress, Paper, Divider } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrder } from "@/services/api/orders";
import { Icons } from "@/lib/icons";

const { CheckCircle } = Icons;
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data: orderData, isLoading, isError } = useOrder(orderId || "");

  const order = orderData?.data;

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: "center" }}>
          <LinearProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>Loading order details...</Typography>
        </Box>
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            Order not found. Please check your order history in your account.
          </Alert>
          <Link href="/account/orders" passHref>
            <Button variant="contained">View My Orders</Button>
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "success.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 4,
            fontSize: 40,
            color: "white",
          }}
        >
          <CheckCircle />
        </Box>

        <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
          Order Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your order, {order.shippingAddress?.fullName?.split(" ")[0] || "Customer"}!
        </Typography>

        <Alert severity="success" sx={{ mb: 4, textAlign: "left" }}>
          <strong>Order Number: </strong>
          {order.orderNumber}
          <br />
          <strong>Order Date: </strong>
          {new Date(order.createdAt).toLocaleDateString()}
          <br />
          <strong>Payment Status: </strong>
          {order.paymentStatus}
          <br />
          <strong>Order Status: </strong>
          {order.orderStatus}
        </Alert>

        <Paper elevation={1} sx={{ p: 3, mb: 4, textAlign: "left" }}>
          <Typography variant="h6" sx={{ mb: 3, borderBottom: 1, borderColor: "divider", pb: 2 }}>
            Order Summary
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Shipping Address</Typography>
            <Box>
              <Typography>{order.shippingAddress?.fullName}</Typography>
              <Typography>{order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2 && ", " + order.shippingAddress?.addressLine2}</Typography>
              <Typography>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</Typography>
              <Typography>Phone: {order.shippingAddress?.phone}</Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Items</Typography>
            {order.items?.map((item: any) => (
              <Box key={item._id} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: 1, borderColor: "divider" }}>
                <Box>
                  <Typography variant="body1">{item.productName}</Typography>
                  <Typography variant="body2" color="text.secondary">Qty: {item.quantity} × {formatPrice(item.price)}</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatPrice(item.subtotal)}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Payment Method</Typography>
            <Typography>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit/Debit Card"}</Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Subtotal</Typography>
              <Typography>{formatPrice(order.subtotal)}</Typography>
            </Box>
            {order.discount > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between", color: "success.main" }}>
                <Typography>Discount</Typography>
                <Typography>-{formatPrice(order.discount)}</Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Shipping</Typography>
              <Typography>{formatPrice(order.shippingFee)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Tax</Typography>
              <Typography>{formatPrice(order.tax)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.25rem" }}>
              <Typography>Total</Typography>
              <Typography>{formatPrice(order.total)}</Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/account/orders/${order._id}`} passHref>
            <Button variant="contained" size="large">View Order Details</Button>
          </Link>
          <Link href="/products" passHref>
            <Button variant="outlined" size="large">Continue Shopping</Button>
          </Link>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
          A confirmation email has been sent to {order.shippingAddress?.email || "your email address"}.
          You can track your order status in your account.
        </Typography>
      </Box>
    </Container>
  );
}