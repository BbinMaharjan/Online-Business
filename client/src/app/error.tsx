"use client";

import { useEffect } from "react";
import { Container, Box, Typography, Button, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { Refresh, Home, Error as ErrorIcon, BugReport, Support } from "@mui/icons-material";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: "error.light",
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 4,
            fontSize: 48,
          }}
        >
          <ErrorIcon />
        </Box>

        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
          Something went wrong
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
          We're sorry, but an unexpected error occurred.
        </Typography>

        <Alert severity="error" sx={{ mb: 4, textAlign: "left", maxWidth: 600, mx: "auto" }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Error Details:
          </Typography>
          <Typography variant="body2" fontFamily="monospace" sx={{ whiteSpace: "pre-wrap" }}>
            {error.message || "Unknown error"}
            {error.digest && ` (Digest: ${error.digest})`}
          </Typography>
        </Alert>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            onClick={reset}
            startIcon={<Refresh />}
            sx={{ px: 4 }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push("/")}
            startIcon={<Home />}
            sx={{ px: 4 }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push("/contact")}
            startIcon={<Support />}
            sx={{ px: 4 }}
          >
            Contact Support
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: "block", maxWidth: 600, mx: "auto" }}>
          If this problem persists, please contact our support team with the error details above.
          Our engineers have been automatically notified.
        </Typography>
      </Box>
    </Container>
  );
}