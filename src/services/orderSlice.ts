import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '../utils/burger-api';

import type { TOrder } from '../utils/types';
import type { RootState } from './rootReducer';
import type { SerializedError } from '@reduxjs/toolkit';

type OrderState = {
  order: TOrder | null;
  detailsOrder: TOrder | null;
  detailsNumber: number | null;
  isLoading: boolean;
  detailsLoading: boolean;
  error: SerializedError | null;
  detailsError: SerializedError | null;
};

const initialState: OrderState = {
  order: null,
  detailsOrder: null,
  detailsNumber: null,
  isLoading: false,
  detailsLoading: false,
  error: null,
  detailsError: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number, { state: RootState }>(
  'order/fetchOrderByNumber',
  getOrderByNumberApi,
  {
    condition: (number, { getState }) => {
      const { detailsLoading, detailsNumber } = getState().order;
      return !(detailsLoading && detailsNumber === number);
    },
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
      })
      .addCase(fetchOrderByNumber.pending, (state, action) => {
        state.detailsLoading = true;
        state.detailsNumber = action.meta.arg;
        state.detailsOrder = null;
        state.detailsError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        if (state.detailsNumber === action.meta.arg) {
          state.detailsLoading = false;
          state.detailsOrder = action.payload;
        }
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        if (state.detailsNumber === action.meta.arg) {
          state.detailsLoading = false;
          state.detailsError = action.error;
        }
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export const selectOrder = (state: RootState): TOrder | null => state.order.order;
export const selectOrderLoading = (state: RootState): boolean => state.order.isLoading;
export const selectOrderDetails = (state: RootState): TOrder | null =>
  state.order.detailsOrder;
export const selectOrderDetailsLoading = (state: RootState): boolean =>
  state.order.detailsLoading;
export const selectOrderDetailsNumber = (state: RootState): number | null =>
  state.order.detailsNumber;
export const selectOrderDetailsError = (state: RootState): SerializedError | null =>
  state.order.detailsError;
export default orderSlice.reducer;
