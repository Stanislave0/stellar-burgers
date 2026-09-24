import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi } from '../utils/burger-api';

import type { TOrder } from '../utils/types';
import type { RootState } from './rootReducer';
import type { SerializedError } from '@reduxjs/toolkit';

type OrderState = {
  order: TOrder | null;
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: OrderState = {
  order: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export const selectOrder = (state: RootState): TOrder | null => state.order.order;
export const selectOrderLoading = (state: RootState): boolean => state.order.isLoading;
export default orderSlice.reducer;
