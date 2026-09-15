import { Container, Box, Typography, LinearProgress, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchBrands } from "../../features/brands/brandsSlice";
import { useDispatch } from "react-redux";
import BrandCard from "../../components/brand/BrandCard";

interface BrandCardProps {
  brand: any;
}

const BrandCard = ({ brand }: BrandCardProps) => {
  return (
    <Grid item xs={12} md={6} lg={4} sx={{ pb: 2 }}>
      <Box sx={{ p: 3, borderRadius: 2, background: "#fff", transition: "transform 0.2s" }}>
        <Typography variant="h6" component="h3" style={{ textAlign: "center" }}>
          {brand.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" style={{ textAlign: "center", mt: 2 }}>
          {brand.products?.length || 0} products
        </Typography>
      </Box>
    </Grid>
  );
};

const BrandsPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["brands", slug],
    enabled: !!slug,
    queryFn: () => dispatch(fetchBrands({ slug })).unwrap?.unwrap(),
  });

  if (isLoading) return <LinearProgress />;

  if (isError || !data?.data) {
    return (
      <Container>
        <Box sx={{ py: 8 }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Brand not found
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
          <Grid container spacing={2}>
            {data.data.products?.map((product: any) => (
              <Grid item xs={12} md={6} lg={4} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
            No products from this brand
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default BrandsPage;