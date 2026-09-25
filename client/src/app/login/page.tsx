"use client";

import { Container, Box, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/services/api/auth";
import { useUser } from "@/services/api/auth";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const { data: userData } = useUser();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userData?.data) {
      router.push(redirect);
    }
  }, [userData, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push(redirect);
        },
        onError: (err: Error) => {
          setError(err.message || "Login failed");
        },
      }
    );
  };

  return (
    <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            Login
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <form onSubmit={handleSubmit} sx={{ width: "100%" }}>
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
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                obscureText
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loginMutation.isPending}
                sx={{ mb: 3, marginTop: 1 }}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <a href="/register" style={{ color: "primary.main", textDecoration: "underline" }}>
                Register
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
}