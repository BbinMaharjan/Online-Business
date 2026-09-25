"use client";

import { Box, Skeleton, Card, CardContent, Stack, Divider, Grid } from "@mui/material";

export function SkeletonProductCard({ variant = "default" }: { variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <Card sx={{ display: "flex", height: 100, width: "100%" }}>
        <Skeleton variant="rectangular" width={80} height={80} sx={{ flexShrink: 0, borderRadius: 1 }} />
        <CardContent sx={{ p: 1.5, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="25%" />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Skeleton variant="rectangular" width="100%" height={220} />
      <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" sx={{ mt: 1, height: 24 }} />
        <Skeleton variant="text" width="80%" sx={{ mt: 1, height: 24 }} />
        <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "center" }}>
          <Skeleton variant="circular" width={60} height={20} />
          <Skeleton variant="text" width="40%" />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: "center" }}>
          <Skeleton variant="text" width="35%" height={28} />
          <Skeleton variant="text" width="30%" height={20} />
        </Stack>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Skeleton variant="rectangular" width="100%" height={44} />
      </Box>
    </Card>
  );
}

export function SkeletonProductGrid({ count = 8, columns = 4 }: { count?: number; columns?: number }) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: Math.floor(12 / columns) }} key={`skeleton-${i}`}>
          <SkeletonProductCard />
        </Grid>
      ))}
    </Grid>
  );
}

export function SkeletonProductDetail() {
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 400px", maxWidth: "100%" }}>
          <Skeleton variant="rectangular" width="100%" height="400" sx={{ borderRadius: 2, mb: 2 }} />
          <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" width={90} height={90} sx={{ flexShrink: 0, borderRadius: 1 }} />
            ))}
          </Box>
        </Box>
        <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
          <Skeleton variant="text" width="30%" sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" sx={{ mb: 2, height: 32 }} />
          <Skeleton variant="circular" width={80} height={20} sx={{ mb: 2 }} />
          <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
            <Skeleton variant="text" width="40%" height={36} />
            <Skeleton variant="text" width="30%" height={20} />
          </Stack>
          <Skeleton variant="rectangular" width="100%" height={52} sx={{ mt: 2, borderRadius: 2 }} />
        </Box>
      </Box>
      <Box sx={{ mt: 6 }}>
        <Skeleton variant="text" width="20%" sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="100%" height={16} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="80%" height={16} sx={{ mt: 1 }} />
      </Box>
    </Box>
  );
}

export function SkeletonCart() {
  return (
    <Box>
      {Array.from({ length: 3 }).map((_, i) => (
        <Box key={i} sx={{ display: "flex", gap: 2, p: 2, mb: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
          <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 1 }}>
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="30%" />
            <Stack direction="row" spacing={2}>
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="text" width={80} height={20} />
            </Stack>
          </Box>
        </Box>
      ))}
      <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 1, justifyContent: "space-between" }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
        </Stack>
      </Box>
    </Box>
  );
}

export function SkeletonCategoryGrid() {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
          <Box sx={{ p: 3, borderRadius: 2, border: 1, borderColor: "divider", textAlign: "center" }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: "auto", mb: 2 }} />
            <Skeleton variant="text" width="60%" sx={{ mx: "auto" }} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export default SkeletonProductCard;