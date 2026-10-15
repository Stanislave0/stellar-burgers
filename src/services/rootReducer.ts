import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './constructorSlice';
import feedReducer from './feedSlice';
import ingredientsReducer from './ingredientsSlice';
import orderReducer from './orderSlice';
import ordersReducer from './ordersSlice';
import userReducer from './userSlice';

export const rootReducer = combineReducers({
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  order: orderReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
