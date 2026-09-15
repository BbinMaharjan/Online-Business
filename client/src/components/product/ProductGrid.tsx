import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { selectProducts } from "../../features/products/productsSlice";
import { fetchProducts } from "../../features/products/productsSlice";

interface ProductGridProps {
  limit?: number;
  page?: number;
}

const ProductGrid = ({ limit = 20, page = 1 }: ProductGridProps) => {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => dispatch(fetchProducts({ page, limit })).unwrap?.unwrap(),
  });

  if (isLoading) return <SkeletonProductCard count={4} />;
  if (isError || !data?.data?.length) return <EmptyStateProducts />;

  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      {data.data.map((product: any) => (
        <Grid item xs={12} md={6} lg={4} xl={3} key={product._id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;