import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '../utils/burger-api';

import type { TOrder } from '../utils/types';
import type { RootState } from './rootReducer';
import type { SerializedError } from '@reduxjs/toolkit';

type OrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: OrdersState = { orders: [], isLoading: false, error: null };

export const fetchOrders = createAsyncThunk('orders/fetchOrders', getOrdersApi);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const selectOrders = (state: RootState): TOrder[] => state.orders.orders;
export default ordersSlice.reducer;
