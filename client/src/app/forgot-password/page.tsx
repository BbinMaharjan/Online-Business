"use client";

import { Container, Box, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/services/api/auth";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    forgotPasswordMutation.mutate(
      email,
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (err: Error) => {
          setError(err.message || "Failed to send reset email");
        },
      }
    );
  };

  return (
    <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
      <Grid container spacing={0} sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Grid size={12}>
          <Box sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
              Forgot Password
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
              Enter your email address to receive password reset instructions
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset instructions sent to your email. Check your inbox.
              </Alert>
            )}

            {!success && (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={forgotPasswordMutation.isPending}
                  sx={{ mb: 3, mt: 2 }}
                >
                  {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}

            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{" "}
                <a href="/login" style={{ color: "primary.main", textDecoration: "underline" }}>
                  Login
                </a>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}