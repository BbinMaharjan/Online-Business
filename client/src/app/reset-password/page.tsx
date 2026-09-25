"use client";

import { Container, Box, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/services/api/auth";
import { useState } from "react";
import { Lock, Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";

export default function ResetPasswordPage() {
  const router = useRouter();
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
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
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
            <Button
              variant="contained"
              size="large"
              component="a"
              href="/login"
              passHref
              sx={{ px: 4 }}
            >
              Go to Login
            </Button>
          </Box>
        </Grid>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
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

          <Box sx={{ mb: 3 }}>
            <form onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                helperText="Must be at least 8 characters"
                InputProps={{
                  endAdornment: (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex" }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </button>
                  ),
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
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex" }}
                    >
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </button>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={resetPassword.isPending}
                sx={{ mb: 3, marginTop: 1 }}
              >
                {resetPassword.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{" "}
              <a href="/login" style={{ color: "primary.main", textDecoration: "underline" }}>
                Login
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
}