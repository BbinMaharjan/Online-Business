import { Container, Box, Typography, LinearProgress, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchCategories } from "../../features/categories/categoriesSlice";
import { useDispatch } from "react-redux";
import CategoryCard from "../../components/category/CategoryCard";

interface CategoryCardProps {
  category: any;
}

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { parentId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", parentId],
    enabled: !!parentId,
    queryFn: () => dispatch(fetchCategories({ parentId: parentId as string })).unwrap?.unwrap(),
  });

  if (isLoading) return <LinearProgress />;

  if (isError || !data?.data) {
    return (
      <Container>
        <Box sx={{ py: 8 }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Categories not found
          </Typography>
        </Box>
      </Projection>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, display: "inline-block" }}>
          Categories
        </Typography>
      </Box>

      <Grid container sx={{ pt: 2 }}>
        {data.data.map((category: any) => (
          <Grid item xs={12} md={6} lg={4} key={category._id}>
            <CategoryCard category={category} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoriesPage;