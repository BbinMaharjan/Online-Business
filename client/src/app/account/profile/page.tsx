"use client";

import { Container, Box, Typography, Paper, Button, Grid, TextField, Alert, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, InputAdornment } from "@mui/material";
import { useUser } from "@/services/api/auth";
import { useUpdateProfile, useChangePassword } from "@/services/api/auth";
import { Icons } from "@/lib/icons";

const { Save, Visibility, VisibilityOff, Person, Email, Lock } = Icons;
import { useState } from "react";

export default function ProfilePage() {
  const { data: userData, isLoading, refetch } = useUser();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const user = userData?.data;

  const handleEditClick = () => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(profileData);
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await changePassword.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      alert(error.message || "Failed to change password");
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">Please log in to view your profile</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Profile Settings</Typography>

        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, fontSize: "2.5rem", fontWeight: 600 }}
              src={user.image}
              alt={user.firstName}
            >
              {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {isEditing ? (
            <form onSubmit={handleProfileSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    required
                    disabled={updateProfile.isPending}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    required
                    disabled={updateProfile.isPending}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                    disabled={updateProfile.isPending}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Email /></InputAdornment>
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone (Optional)"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={updateProfile.isPending}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Person /></InputAdornment>
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button variant="contained" type="submit" size="large" disabled={updateProfile.isPending} startIcon={updateProfile.isPending ? <CircularProgress size={20} color="inherit" /> : <Save />}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outlined" onClick={handleCancelEdit} size="large">Cancel</Button>
              </Box>
            </form>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Phone:</strong> {user.phone || "Not provided"}
              </Typography>
              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button variant="contained" onClick={handleEditClick} startIcon={<Save />}>
                  Edit Profile
                </Button>
                <Button variant="outlined" onClick={() => setShowPasswordDialog(true)} startIcon={<Lock />}>
                  Change Password
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Account Information</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Role</Typography>
              <Typography variant="body1">{user.role}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Account Status</Typography>
              <Typography variant="body1" color="success">Active</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Member Since</Typography>
              <Typography variant="body1">{new Date(user.createdAt).toLocaleDateString()}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <form onSubmit={handlePasswordSubmit} id="password-form">
              <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    sx={{ minLength: 8 }}
                    helperText="Must be at least 8 characters"
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button variant="contained" type="submit" form="password-form" disabled={changePassword.isPending}>
              {changePassword.isPending ? "Changing..." : "Change Password"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}