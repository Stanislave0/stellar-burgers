import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../utils/burger-api';

import type { TIngredient } from '../utils/types';
import type { RootState } from './rootReducer';
import type { SerializedError } from '@reduxjs/toolkit';

type IngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState): SerializedError | null =>
  state.ingredients.error;

export default ingredientsSlice.reducer;
