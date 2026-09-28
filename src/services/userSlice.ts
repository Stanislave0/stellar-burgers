import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '../utils/burger-api';
import { deleteCookie, setCookie } from '../utils/cookie';

import type { TRegisterData } from '../utils/burger-api';
import type { TUser } from '../utils/types';
import type { RootState } from './rootReducer';

type UserState = {
  user: TUser | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
  logoutError: string | null;
};

const initialState: UserState = {
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,
  logoutError: null,
};

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  if (!response.success) {
    throw new Error('Не удалось получить данные пользователя');
  }
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    if (!response.success) {
      throw new Error('Не удалось сохранить данные пользователя');
    }
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const response = await logoutApi();
  if (!response.success) {
    throw new Error('Не удалось выйти из аккаунта');
  }
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: { email: string; name: string; password: string }) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось выполнить вход';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось зарегистрироваться';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthChecked = true;
        state.error = action.error.message ?? 'Не удалось получить данные пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось сохранить данные пользователя';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.logoutError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.logoutError = action.error.message ?? 'Не удалось выйти из аккаунта';
      });
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState): TUser | null => state.user.user;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const selectUserError = (state: RootState): string | null => state.user.error;
export const selectLogoutError = (state: RootState): string | null =>
  state.user.logoutError;
export default userSlice.reducer;
