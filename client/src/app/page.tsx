import { Container, Box, LinearProgress, CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../features/products/productsSlice";
import { fetchCategories } from "../../features/categories/categoriesSlice";
import SearchBox from "../../components/navigation/SearchBox";
import ProductGrid from "../../components/product/ProductGrid";
import Footer from "../../components/footer/Footer";
import { generateProductSeo } from "../../lib/seo";

const Homepage = () => {
  const dispatch = useDispatch();

  // Fetch featured/products for homepage
  const { data: productsData } = useQuery({
    queryKey: ["homepageProducts"],
    queryFn: () => dispatch(fetchProducts({ limit: 8, page: 1 })).unwrap?.unwrap(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["homepageCategories"],
    queryFn: () => dispatch(fetchCategories()).unwrap?.unwrap(),
  });

  useEffect(() => {
    if (productsData?.data?.length) {
      const seo = generateProductSeo(productsData.data[0]);
      document.title = seo.title;
    }
  }, [productsData]);

  return (
    <CssBaseline>
      <Container>
        <Box sx={{ py: 8 }}>
          <SearchBox />
        </Box>

        {/* Hero Banner */}
        <Box sx={{ height: 300, borderRadius: 2, marginBottom: 4, background: "#fafafa" }}>
          {/* Hero content would go here */}
        </Box>

        {/* Featured Categories */}
        <Box sx={{ py: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, display: "inline-block" }}>
            Categories
          </Typography>
          <Grid container sx={{ pt: 2 }}>
            {categoriesData?.data?.map((category: any) => (
              <Grid item xs={12} md={6} lg={3} key={category._id}>
                <Box sx={{ p: 3, borderRadius: 2, background: "#fff", textAlign: "center" }}>
                  <Typography variant="h6" component="h3">
                    {category.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Products */}
        {productsData?.data?.length > 0 ? (
          <ProductGrid limit={8} />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
            No products found
          </Typography>
        )}

        {/* Other sections would go here: Best Sellers, New Arrivals, Promotions, Brands, Reviews, Newsletter, Footer */}
        <Footer />
      </Container>
    </CssBaseline>
  );
};

export default Homepage;

// Export for Next.js app directory
export const metadata = {
  title: "E-Commerce Storefront - Homepage",
  description: "Discover quality products at great prices",
};