"use client";

import { Container, Box, Typography, LinearProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useSearchProducts } from "@/services/api/search";
import SearchBox from "@/components/navigation/SearchBox";
import { EmptyStateProducts } from "@/components/common/EmptyStateProducts";
import ProductGrid from "@/components/product/ProductGrid";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading, isError } = useSearchProducts(query, query ? {} : { enabled: false });

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

      {data?.data?.data?.length ? (
        <ProductGrid products={data.data.data} />
      ) : (
        <EmptyStateProducts message={`No results found for "${query}"`} />
      )}
    </Container>
  );
}