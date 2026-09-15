import { Box, Typography, Stack, Button, Skeleton } from "@mui/material";

const EmptyStateProducts = () => {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Skeleton component="h3" width={200} sx={{ mb: 4 }} />
      <Typography variant="body2" color="text.secondary">
        No products found
      </Typography>
      <Stack direction="column" spacing={2}>
        <Button variant="contained" sx={{ py: 2, px: 4 }}>
          Try removing filters
        </Button>
        <Button variant="outlined" sx={{ py: 2, px: 4 }}>
          Search another keyword
        </Button>
      </Stack>
    </Box>
  );
};

export default EmptyStateProducts;