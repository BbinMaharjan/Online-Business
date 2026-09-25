import { Container, Box, Typography, LinearProgress, Skeleton, Grid } from "@mui/material";

export default function Loading() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header Skeleton */}
        <Skeleton variant="rectangular" height={64} width="100%" sx={{ mb: 4, borderRadius: 1 }} />

        {/* Hero/Page Title Skeleton */}
        <Skeleton variant="rectangular" height={60} width="60%" sx={{ mb: 4, borderRadius: 2 }} />

        {/* Content Skeleton */}
        <Grid container spacing={3}>
          {/* Sidebar/Filter Skeleton */}
          <Grid item xs={12} md={3}>
            <Skeleton variant="rectangular" height={400} width="100%" sx={{ borderRadius: 2 }} />
          </Grid>

          {/* Main Content Skeleton */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Skeleton variant="rectangular" height={200} width="100%" sx={{ mb: 2, borderRadius: 1 }} />
                    <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={44} width="100%" sx={{ borderRadius: 1 }} />
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Pagination Skeleton */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 1 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="circular" width={40} height={40} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}