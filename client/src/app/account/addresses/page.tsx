"use client";

import { Container, Box, Typography, Paper, Button, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, LinearProgress, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAddresses } from "@/services/api/addresses";
import { useUser } from "@/services/api/auth";
import { Edit, Delete, Add, LocationOn, CheckCircle } from "@mui/icons-material";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function AddressesPage() {
  const router = useRouter();
  const { data: userData } = useUser();
  const { data: addressesData, isLoading, refetch } = useAddresses();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
    type: "SHIPPING" as "SHIPPING" | "BILLING",
    isDefault: false,
  });

  const addresses = addressesData?.data || [];

  const handleOpenDialog = (address?: any) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
        type: address.type,
        isDefault: address.isDefault || false,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "USA",
        postalCode: "",
        type: "SHIPPING",
        isDefault: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await apiClient.addresses.update(editingAddress._id, formData);
      } else {
        await apiClient.addresses.create(formData);
      }
      handleCloseDialog();
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await apiClient.addresses.delete(addressId);
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to delete address");
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: "center" }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h4">My Addresses</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Add New Address
          </Button>
        </Box>

        {addresses.length === 0 ? (
          <Paper elevation={1} sx={{ p: 6, textAlign: "center" }}>
            <LocationOn sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>No addresses saved</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add a shipping address to speed up checkout
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
              Add Your First Address
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {addresses.map((address: any) => (
              <Grid item xs={12} md={6} lg={4} key={address._id}>
                <Paper elevation={1} sx={{ p: 3, height: "100%", border: address.isDefault ? "2px solid" : 1, borderColor: address.isDefault ? "primary.main" : "divider" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>{address.fullName}</Typography>
                    {address.isDefault && (
                      <Chip icon={<CheckCircle />} label="Default" size="small" color="primary" variant="outlined" />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {address.addressLine1}
                    {address.addressLine2 && ", " + address.addressLine2}
                    <br />
                    {address.city}, {address.state} {address.postalCode}, {address.country}
                    <br />
                    Phone: {address.phone}
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button variant="outlined" size="small" onClick={() => handleOpenDialog(address)} startIcon={<Edit />}>
                      Edit
                    </Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(address._id)} startIcon={<Delete />}>
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 1"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 2 (Optional)"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <input
                        type="radio"
                        id="type-shipping"
                        name="type"
                        value="SHIPPING"
                        checked={formData.type === "SHIPPING"}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as "SHIPPING" | "BILLING" })}
                      />
                      <label htmlFor="type-shipping">Shipping</label>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <input
                        type="radio"
                        id="type-billing"
                        name="type"
                        value="BILLING"
                        checked={formData.type === "BILLING"}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as "SHIPPING" | "BILLING" })}
                      />
                      <label htmlFor="type-billing">Billing</label>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      />
                      <label htmlFor="isDefault">Set as default</label>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" type="submit" form="address-form" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingAddress ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}