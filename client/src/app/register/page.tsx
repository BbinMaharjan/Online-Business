"use client";

import { Container, Box, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRegister } from "@/services/api/auth";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    registerMutation.mutate(
      { firstName: name, lastName: "", email, password },
      {
        onSuccess: () => {
          router.push("/login");
        },
        onError: (err: Error) => {
          setError(err.message || "Registration failed");
        },
      }
    );
  };

  return (
    <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            Register
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
            Create your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <form onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                disabled={registerMutation.isPending}
                sx={{ mb: 3, marginTop: 1 }}
              >
                {registerMutation.isPending ? "Creating account..." : "Register"}
              </Button>
            </form>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
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