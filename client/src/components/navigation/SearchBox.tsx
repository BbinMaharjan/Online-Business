import { TextField, IconButton, Box } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    enabled: debouncedQuery.length > 2,
    queryFn: () => {
      // Search will be handled on the search page
      return {};
    },
  });

  const handleChange = (e: any) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${query.trim()}`);
    }
  };

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        fullWidth
        value={query}
        onChange={handleChange}
        placeholder="Search products, categories, brands..."
        startIcon={<SearchIcon />}
        sx={{ width: "100%" }}
        disabled={isLoading}
      />
      <IconButton
        variant="contained"
        sx={{ mt: 1, ml: 1, width: "auto" }}
        onClick={handleSearch}
        disabled={!query.trim() || isLoading}
      >
        <SearchIcon /> Search
      </IconButton>
    </Box>
  );
};

export default SearchBox;