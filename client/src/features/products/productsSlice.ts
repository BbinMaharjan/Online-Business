import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { apiClient } from "../../lib/api-client";
import { Product } from "../../types";

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, limit = 20, search, category, brand, minPrice, maxPrice, rating, availability, sort }: { page?: number; limit?: number; search?: string; category?: string; brand?: string; minPrice?: number; maxPrice?: number; rating?: number; availability?: string; sort?: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.getProducts({
        page,
        limit,
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        availability,
        sort,
      });
      return {
        data: response.data.data || [],
        meta: response.data.meta || {},
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productsLoaded: (state, action: PayloadAction<{ products: Product[]; meta: any }>) => {
      state.products = action.payload.products;
      state.pagination = {
        ...state.pagination,
        ...action.payload.meta,
      };
    },
    productsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = {
          total: action.payload.meta?.totalPages || 0,
          page: action.payload.meta?.page || 1,
          limit: action.payload.meta?.limit || 20,
          totalPages: action.payload.meta?.totalPages || 0,
        };
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { productsLoaded, productsError } = productsSlice.actions;

export default productsSlice.reducer;

// Selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductLoading = (state: RootState) => state.products.loading;
export const selectProductError = (state: RootState) => state.products.error;
export const selectPagination = (state: RootState) => state.products.pagination;