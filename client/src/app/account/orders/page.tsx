"use client";

import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Chip, LinearProgress, Alert, IconButton, Menu, MenuItem, ListItemIcon, Avatar } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrders } from "@/services/api/orders";
import { useCancelOrder } from "@/services/api/orders";
import { useUser } from "@/services/api/auth";
import { formatPrice } from "@/lib/utils";
import { Cancel, Visibility, MoreVert, Refresh } from "@mui/icons-material";
import { useState } from "react";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: userData } = useUser();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const status = searchParams.get("status") || undefined;

  const { data, isLoading, isError } = useOrders({ page, limit: 10, status });
  const cancelOrder = useCancelOrder();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, orderId: string) => {
    setAnchorEl(event.currentTarget);
    setOrderToCancel(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOrderToCancel(null);
  };

  const handleCancel = async () => {
    if (orderToCancel) {
      try {
        await cancelOrder.mutateAsync(orderToCancel);
      } catch (error) {
        // Error handled in mutation
      }
    }
    handleMenuClose();
  };

  const orders = data?.data?.data || [];
  const pagination = data?.data?.meta?.pagination;

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4, textAlign: "center" }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error">Failed to load orders</Alert>
      </Container>
    );
  }

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

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h4">My Orders</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant={!status ? "contained" : "outlined"}
              onClick={() => router.push("/account/orders")}
            >
              All
            </Button>
            <Button
              variant={status === "PENDING" ? "contained" : "outlined"}
              onClick={() => router.push("/account/orders?status=PENDING")}
            >
              Pending
            </Button>
            <Button
              variant={status === "PROCESSING" ? "contained" : "outlined"}
              onClick={() => router.push("/account/orders?status=PROCESSING")}
            >
              Processing
            </Button>
            <Button
              variant={status === "DELIVERED" ? "contained" : "outlined"}
              onClick={() => router.push("/account/orders?status=DELIVERED")}
            >
              Delivered
            </Button>
            <Button
              variant={status === "CANCELLED" ? "contained" : "outlined"}
              onClick={() => router.push("/account/orders?status=CANCELLED")}
            >
              Cancelled
            </Button>
          </Box>
        </Box>

        {orders.length === 0 ? (
          <Paper elevation={1} sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>No orders found</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {status ? "No orders with this status" : "You haven't placed any orders yet"}
            </Typography>
            <Button variant="contained" component="a" href="/products">
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Payment</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order._id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight={600}>{order.orderNumber}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order.items?.length || 0} item(s)</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={600}>{formatPrice(order.total)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={order.orderStatus}
                          size="small"
                          color={getStatusColor(order.orderStatus) as any}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={order.paymentStatus}
                          size="small"
                          color={order.paymentStatus === "PAID" ? "success" : order.paymentStatus === "PENDING" ? "warning" : "error"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                          <IconButton size="small" onClick={() => router.push(`/account/orders/${order._id}`)} aria-label="View order">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, order._id)} aria-label="More actions">
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {pagination && pagination.totalPages > 1 && (
              <TablePagination
                component="div"
                count={pagination.total}
                page={page - 1}
                onPageChange={(_, newPage) => router.push(`/account/orders?page=${newPage + 1}${status ? `&status=${status}` : ""}`)}
                rowsPerPage={pagination.limit}
                rowsPerPageOptions={[10, 20, 50]}
              />
            )}
          </>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {orderToCancel && (
            <MenuItem onClick={handleCancel} disabled={cancelOrder.isPending}>
              <ListItemIcon>
                <Cancel fontSize="small" color="error" />
              </ListItemIcon>
              Cancel Order
            </MenuItem>
          )}
          <MenuItem onClick={() => { router.push(`/account/orders/${orderToCancel}`); handleMenuClose(); }}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            View Details
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
}