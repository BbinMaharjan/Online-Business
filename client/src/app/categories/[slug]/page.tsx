import { Container, Box, Typography, LinearProgress, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchCategories } from "../../features/categories/categoriesSlice";
import { useDispatch } from "react-redux";
import CategoryCard from "../../components/category/CategoryCard";
import ProductGrid from "../../components/product/ProductGrid";

interface CategoryCardProps {
  category: any;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Grid item xs={12} md={6} lg={4} sx={{ pb: 2 }}>
      <Box sx={{ p: 3, borderRadius: 2, background: "#fff", transition: "transform 0.2s" }}>
        <Typography variant="h6" component="h3" style={{ textAlign: "center" }}>
          {category.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" style={{ textAlign: "center", mt: 2 }}>
          {category.products?.length || 0} products
        </Typography>
      </Box>
    </Grid>
  );
};

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", slug],
    enabled: !!slug,
    queryFn: () => dispatch(fetchCategories({ slug })).unwrap?.unwrap(),
  });

  if (isLoading) return <LinearProgress />;

  if (isError || !data?.data) {
    return (
      <Container>
        <Box sx={{ py: 8 }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Category not found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, display: "inline-block" }}>
          {data.data.name}
        </Typography>
      </Box>

      <Grid container sx={{ pt: 2 }}>
        {data.data.products?.length > 0 ? (
          <ProductGrid limit={10} />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
            No products in this category
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default CategoriesPage;