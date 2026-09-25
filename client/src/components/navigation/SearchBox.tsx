"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TextField,
  IconButton,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Skeleton,
  Divider,
} from "@mui/material";
import { Icons } from "@/lib/icons";

const { Search: SearchIcon, Close: CloseIcon, TrendingUp: TrendingUpIcon } = Icons;
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchSuggestions } from "@/services/api/search";

interface SearchBoxProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onFocus?: () => void;
  onClose?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
}

export function SearchBox({
  inputRef,
  onFocus,
  onClose,
  placeholder = "Search products, brands, categories...",
  autoFocus = false,
  showSuggestions = true,
}: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const { data: suggestions, isLoading: suggestionsLoading } = useSearchSuggestions(debouncedQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(value.length >= 2 && showSuggestions);
    setSelectedIndex(-1);
    onFocus?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
      onClose?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = suggestions?.data || [];
    if (!showDropdown || items.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          const suggestion = items[selectedIndex];
          if (suggestion.type === "product") {
            router.push(`/products/${suggestion.value}`);
          } else if (suggestion.type === "category") {
            router.push(`/categories/${suggestion.value}`);
          } else if (suggestion.type === "brand") {
            router.push(`/brands/${suggestion.value}`);
          }
        } else {
          handleSubmit(e as unknown as React.FormEvent);
        }
        setShowDropdown(false);
        onClose?.();
        break;
      case "Escape":
        setShowDropdown(false);
        onClose?.();
        break;
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleSuggestionClick = (suggestion: { type: string; value: string; label: string }) => {
    if (suggestion.type === "product") {
      router.push(`/products/${suggestion.value}`);
    } else if (suggestion.type === "category") {
      router.push(`/categories/${suggestion.value}`);
    } else if (suggestion.type === "brand") {
      router.push(`/brands/${suggestion.value}`);
    }
    setShowDropdown(false);
    onClose?.();
  };

  useEffect(() => {
    if (autoFocus && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          inputRef={inputRef}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={(_e) => {
            if (query.length >= 2 && showSuggestions) setShowDropdown(true);
            onFocus?.();
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          size="small"
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: 24,
              backgroundColor: "background.default",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
              "&.Mui-focused": { boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)" },
            },
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "& .MuiInputBase-adornedStart": { paddingLeft: 12 },
            "& .MuiInputBase-adornedEnd": { paddingRight: 12 },
          }}
          startAdornment={
            <Box sx={{ display: "flex", alignItems: "center", position: "absolute", left: 12, pointerEvents: "none" }}>
              <SearchIcon color="action" />
            </Box>
          }
          endAdornment={
            query ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  size="small"
                  sx={{ p: 0 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                <TrendingUpIcon color="action" sx={{ mr: 0.5, fontSize: 18 }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Trending
                </Typography>
              </Box>
            )
          }
        />
      </form>

      {showSuggestions && showDropdown && (query.length >= 2 || suggestionsLoading) && (
        <Paper
          ref={dropdownRef}
          elevation={3}
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 1300,
            borderRadius: 2,
            overflow: "hidden",
            mt: 0.5,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {suggestionsLoading ? (
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
            </Box>
          ) : suggestions?.data?.length ? (
            <>
              <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Suggestions
                </Typography>
              </Box>
              <List disablePadding dense>
                {suggestions.data.map((suggestion, index) => (
                  <ListItem
                    key={`${suggestion.type}-${suggestion.value}`}
                    component="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      px: 1.5,
                      py: 1,
                      "&:hover": { backgroundColor: "action.hover" },
                      backgroundColor: index === selectedIndex ? "primary.light" : "transparent",
                      color: index === selectedIndex ? "primary.contrastText" : "inherit",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
                      {suggestion.type === "product" && <SearchIcon fontSize="small" />}
                      {suggestion.type === "category" && <Typography variant="body2" sx={{ textTransform: "capitalize" }}>📁</Typography>}
                      {suggestion.type === "brand" && <Typography variant="body2" sx={{ textTransform: "capitalize" }}>🏷️</Typography>}
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.label}
                      secondary={
                        suggestion.type !== "product" && (
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                            {suggestion.type}
                          </Typography>
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Divider variant="inset" component="li" />
              <ListItem component="button" onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} sx={{ px: 1.5, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                  <SearchIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="See all results" secondary={<Typography variant="caption">{query}</Typography>} />
              </ListItem>
            </>
          ) : query.length >= 2 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No suggestions found for "{query}"
              </Typography>
            </Box>
          ) : null}
        </Paper>
      )}
    </Box>
  );
}

export default SearchBox;