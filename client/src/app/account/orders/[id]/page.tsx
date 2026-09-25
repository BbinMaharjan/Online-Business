"use client";

import { Container, Box, Typography, Paper, Divider, Table, TableBody, TableCell, TableHead, TableRow, Chip, LinearProgress, Alert, Button, Accordion, AccordionSummary, AccordionDetails, Avatar } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useOrder } from "@/services/api/orders";
import { useCancelOrder } from "@/services/api/orders";
import { formatPrice } from "@/lib/utils";
import { LocalShipping, CreditCard, Person, CalendarToday, ExpandMore, Cancel, Refresh } from "@mui/icons-material";
import { useState } from "react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: orderData, isLoading, isError } = useOrder(orderId);
  const cancelOrder = useCancelOrder();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const order = orderData?.data;

  const handleCancel = async () => {
    try {
      await cancelOrder.mutateAsync(orderId);
      setShowCancelDialog(false);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "success";
      case "SHIPPED": return "info";
      case "PROCESSING": return "primary";
      case "CONFIRMED": return "secondary";
      case "PENDING": return "warning";
      case "CANCELLED": return "error";
      case "REFUNDED": return "default";
      default: return "default";
    }
  };

  const canCancel = (status: string) => ["PENDING", "CONFIRMED"].includes(status);

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: "center" }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Order not found</Alert>
        <Button variant="contained" onClick={() => router.back()}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>Order Details</Typography>
            <Typography variant="body1" color="text.secondary">
              Order Number: <strong>{order.orderNumber}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Chip
              label={order.orderStatus}
              size="large"
              color={getStatusColor(order.orderStatus) as any}
              variant="filled"
            />
            <Chip
              label={order.paymentStatus}
              size="large"
              color={order.paymentStatus === "PAID" ? "success" : order.paymentStatus === "PENDING" ? "warning" : "error"}
              variant="outlined"
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShipping /> Shipping Address
              </Typography>
              <Box>
                <Typography variant="body1" fontWeight={600}>{order.shippingAddress?.fullName}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                  {order.shippingAddress?.addressLine1}{" "}
                  {order.shippingAddress?.addressLine2 && ", " + order.shippingAddress?.addressLine2}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                  Phone: {order.shippingAddress?.phone}
                </Typography>
              </Box>
            </Paper>

            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <CreditCard /> Payment Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography>
                  <strong>Method:</strong> {order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit/Debit Card"}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {order.paymentStatus}
                </Typography>
                {order.paymentMethod !== "cod" && order.paymentStatus === "PAID" && (
                  <Typography>
                    <strong>Paid on:</strong> {order.paidAt ? new Date(order.paidAt).toLocaleString() : "N/A"}
                  </Typography>
                )}
              </Box>
            </Paper>

            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <Person /> Order Items
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items?.map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Typography variant="body1">{item.productName}</Typography>
                          {item.variant && <Typography variant="caption" color="text.secondary">{item.variant}</Typography>}
                        </TableCell>
                        <TableCell align="right">{formatPrice(item.price)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatPrice(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </Paper>
            </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, mb: 3, height: "fit-content", position: "sticky", top: 100 }}>
              <Typography variant="h6" sx={{ mb: 3, borderBottom: 1, borderColor: "divider", pb: 2 }}>
                Order Summary
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Subtotal ({order.items?.length || 0} items)</Typography>
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
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.25rem" }}>
                  <Typography>Total</Typography>
                  <Typography>{formatPrice(order.total)}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Refresh />}
                  onClick={() => router.refresh()}
                >
                  Refresh Status
                </Button>
                {canCancel(order.orderStatus) && (
                  <Button
                    variant="outlined"
                    fullWidth
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => setShowCancelDialog(true)}
                    disabled={cancelOrder.isPending}
                  >
                    Cancel Order
                  </Button>
                )}
              </Box>
            </Paper>

            <Paper elevation={1} sx={{ p: 3, height: "fit-content", position: "sticky", top: 280 }}>
              <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday /> Order Timeline
              </Typography>
              <Box sx={{ borderLeft: "2px solid", borderColor: "divider", pl: 3, ml: 1 }}>
                <TimelineItem
                  label="Order Placed"
                  time={order.createdAt}
                  active={true}
                  completed={true}
                />
                <TimelineItem
                  label="Order Confirmed"
                  time={order.orderStatus !== "PENDING" ? order.createdAt : null}
                  active={order.orderStatus === "CONFIRMED"}
                  completed={["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.orderStatus)}
                />
                <TimelineItem
                  label="Processing"
                  time={order.orderStatus !== "PENDING" && order.orderStatus !== "CONFIRMED" ? order.updatedAt : null}
                  active={order.orderStatus === "PROCESSING"}
                  completed={["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.orderStatus)}
                />
                <TimelineItem
                  label="Shipped"
                  time={["SHIPPED", "DELIVERED"].includes(order.orderStatus) ? order.updatedAt : null}
                  active={order.orderStatus === "SHIPPED"}
                  completed={order.orderStatus === "DELIVERED"}
                />
                <TimelineItem
                  label="Delivered"
                  time={order.orderStatus === "DELIVERED" ? order.updatedAt : null}
                  active={order.orderStatus === "DELIVERED"}
                  completed={order.orderStatus === "DELIVERED"}
                />
                {order.orderStatus === "CANCELLED" && (
                  <TimelineItem
                    label="Cancelled"
                    time={order.updatedAt}
                    active={true}
                    completed={true}
                    color="error"
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Button variant="text" onClick={() => router.back()} sx={{ mt: 2 }} startIcon={<CreditCard />}>
          Back to Orders
        </Button>
      </Box>
    </Container>
  );
}

function TimelineItem({ label, time, active, completed, color = "primary" }: any) {
  return (
    <Box sx={{ position: "relative", mb: 3, display: "flex", alignItems: "flex-start" }}>
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: completed ? "none" : "2px solid",
          borderColor: completed ? color : "divider",
          backgroundColor: completed ? color : active ? color : "background.paper",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: completed ? "white" : "transparent",
          fontSize: 10,
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {completed && "✓"}
      </Box>
      <Box sx={{ ml: 3, flex: 1 }}>
        <Typography variant="body1" fontWeight={completed || active ? 600 : 400} color={completed || active ? "text.primary" : "text.secondary"}>
          {label}
        </Typography>
        {time && (
          <Typography variant="caption" color="text.secondary">
            {new Date(time).toLocaleString()}
          </Typography>
        )}
      </Box>
    </Box>
  );
}