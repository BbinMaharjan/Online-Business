"use client";

import { Container, Box, Typography, Alert, Button, CircularProgress } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { CheckCircle, Error, Email } from "@mui/icons-material";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token");
      return;
    }

    const verify = async () => {
      try {
        await apiClient.auth.verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Email verification failed. The link may have expired or already been used.");
      }
    };

    verify();
  }, [token]);

  if (status === "loading") {
    return (
      <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ mb: 3 }} />
          <Typography variant="h6">Verifying your email...</Typography>
        </Box>
      </Container>
    );
  }

  const isSuccess = status === "success";

  return (
    <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
      <Box sx={{ textAlign: "center" }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: isSuccess ? "success.main" : "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 4,
            fontSize: 40,
            color: "white",
          }}
        >
          {isSuccess ? <CheckCircle /> : <Error />}
        </Box>

        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          {isSuccess ? "Email Verified!" : "Verification Failed"}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {message}
        </Typography>

        {isSuccess ? (
          <Button
            variant="contained"
            size="large"
            component="a"
            href="/login"
            passHref
            startIcon={<Email />}
            sx={{ px: 4 }}
          >
            Continue to Login
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              component="a"
              href="/register"
              passHref
            >
              Register Again
            </Button>
            <Button
              variant="outlined"
              size="large"
              component="a"
              href="/login"
              passHref
            >
              Login
            </Button>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: "block" }}>
          If you didn't request this verification, please ignore this email.
        </Typography>
      </Box>
    </Container>
  );
}