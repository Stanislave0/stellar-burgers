import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '../utils/burger-api';

import type { TOrder } from '../utils/types';
import type { RootState } from './rootReducer';
import type { SerializedError } from '@reduxjs/toolkit';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;
export const selectFeedLoading = (state: RootState): boolean => state.feed.isLoading;
export const selectFeedError = (state: RootState): SerializedError | null =>
  state.feed.error;
export const selectFeedTotal = (state: RootState): number => state.feed.total;
export const selectFeedTotalToday = (state: RootState): number => state.feed.totalToday;

export default feedSlice.reducer;
