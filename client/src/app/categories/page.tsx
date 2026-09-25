"use client";

import { Container, Box, Typography, LinearProgress, Grid } from "@mui/material";
import { useCategories } from "@/services/api/categories";
import CategoryCard from "@/components/category/CategoryCard";

interface CategoryCardProps {
  category: any;
}

export default function CategoriesPage() {
  const { data, isLoading, isError } = useCategories();

  if (isLoading) return <LinearProgress />;

  if (isError || !data?.data) {
    return (
      <Container>
        <Box sx={{ py: 8 }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Categories not found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, display: "inline-block" }}>
          Categories
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ pt: 2 }}>
        {data.data.map((category: any) => (
          <Grid item xs={12} md={6} lg={4} key={category._id}>
            <CategoryCard category={category} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}