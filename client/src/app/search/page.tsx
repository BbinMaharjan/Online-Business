import { Container, Box, Typography, LinearProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../../features/search/searchSlice";
import { useDispatch } from "react-redux";
import SearchBox from "../../components/navigation/SearchBox";
import EmptyState from "../../components/common/EmptyStateProducts";
import ProductGrid from "../../components/product/ProductGrid";

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchResults", query],
    enabled: query.length > 0,
    queryFn: () => dispatch(fetchSearchResults({ query })).unwrap?.unwrap(),
  });

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ py: 8 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (isError || !query) {
    return (
      <Container>
        <Box sx={{ py: 8 }}>
          <SearchBox />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Search results for{" "}
          <span style={{ fontWeight: 600 }}>{query}</span>
        </Typography>
      </Box>

      {data?.data?.length > 0 ? (
        <ProductGrid limit={10} />
      ) : (
        <EmptyState />
      )}
    </Container>
  );
};

export default SearchPage;