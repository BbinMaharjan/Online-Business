import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { apiClient } from "../../lib/api-client";
import { Cart, CartItem } from "../../types";

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.getCart(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, variantId, quantity }: { userId: string; productId: string; variantId?: string; quantity?: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient.addToCart(userId, productId, variantId, quantity);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ userId, itemId, quantity }: { userId: string; itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient.updateCartItem(userId, itemId, quantity);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, itemId }: { userId: string; itemId: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.removeFromCart(userId, itemId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.clearCart(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartLoaded: (state, action: PayloadAction<Cart>) => {
      state.items = action.payload.items;
      state.subtotal = action.payload.subtotal;
      state.discount = action.payload.discount;
      state.tax = action.payload.tax;
      state.shipping = action.payload.shipping;
      state.total = action.payload.total;
    },
    cartError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload;
        state.items = cart.items || [];
        state.subtotal = cart.subtotal || 0;
        state.discount = cart.discount || 0;
        state.tax = cart.tax || 0;
        state.shipping = cart.shipping || 0;
        state.total = cart.total || 0;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const existingIndex = state.items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingIndex >= 0) {
          state.items[existingIndex].quantity += item.quantity;
        } else {
          state.items.push(item);
        }

        state.subtotal = state.items.reduce((total, item) => total + item.subtotal, 0);
        state.total = state.subtotal - state.discount + state.tax + state.shipping;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { itemId, quantity } = action.payload;
        const existingItem = state.items.find((item) => item._id === itemId);

        if (existingItem) {
          existingItem.quantity = quantity;
          existingItem.subtotal = existingItem.price * quantity;
        }

        state.subtotal = state.items.reduce((total, item) => total + item.subtotal, 0);
        state.total = state.subtotal - state.discount + state.tax + state.shipping;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { itemId } = action.payload;
        state.items = state.items.filter((item) => item._id !== itemId);

        state.subtotal = state.items.reduce((total, item) => total + item.subtotal, 0);
        state.total = state.subtotal - state.discount + state.tax + state.shipping;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
        state.discount = 0;
        state.tax = 0;
        state.shipping = 0;
        state.total = 0;
        state.error = null;
      });
  },
});

export const { cartLoaded, cartError } = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartSubtotal = (state: RootState) => state.cart.subtotal;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartDiscount = (state: RootState) => state.cart.discount;
export const selectCartTax = (state: RootState) => state.cart.tax;
export const selectCartShipping = (state: RootState) => state.cart.shipping;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;