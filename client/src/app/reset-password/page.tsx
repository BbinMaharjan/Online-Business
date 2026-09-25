"use client";

import { Container, Box, Typography, TextField, Button, Grid, Alert, IconButton, InputAdornment } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/services/api/auth";
import { useState } from "react";
import { Icons } from "@/lib/icons";

const { Visibility, VisibilityOff, CheckCircle } = Icons;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const resetPassword = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    try {
      await resetPassword.mutateAsync({ token, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Password reset failed. The link may have expired.");
    }
  };

  if (success) {
    return (
      <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
        <Grid container spacing={0} sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Grid size={12}>
            <Box sx={{ width: "100%", textAlign: "center" }}>
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
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                Password Reset Successful
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Your password has been updated. You can now log in with your new password.
              </Typography>
              <Link href="/login">
                <Button
                  variant="contained"
                  size="large"
                  sx={{ px: 4 }}
                >
                  Go to Login
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
      <Grid container spacing={0} sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Grid size={12}>
          <Box sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
              Reset Password
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
              Enter your new password below
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                helperText="Must be at least 8 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        sx={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
                      >
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={resetPassword.isPending}
                sx={{ mt: 2, mb: 3 }}
              >
                {resetPassword.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{" "}
                <Link href="/login" style={{ color: "primary.main", textDecoration: "underline" }}>
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}