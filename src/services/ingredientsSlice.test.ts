import reducer, { fetchIngredients } from './ingredientsSlice';

import type { TIngredient } from '../utils/types';

const ingredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png',
  },
];

describe('ingredientsSlice', () => {
  it('возвращает начальное состояние для неизвестного действия.', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  it('устанавливает состояние загрузки при начале получения ингредиентов', () => {
    const state = reducer(undefined, fetchIngredients.pending('request-id'));

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  it('сохраняет ингредиенты при успешном получении', () => {
    const state = reducer(
      { ingredients: [], isLoading: true, error: null },
      fetchIngredients.fulfilled(ingredients, 'request-id')
    );

    expect(state).toEqual({
      ingredients,
      isLoading: false,
      error: null,
    });
  });

  it('сохраняет ошибку при неудачном получении', () => {
    const action = fetchIngredients.rejected(new Error('Request failed'), 'request-id');
    const state = reducer({ ingredients, isLoading: true, error: null }, action);

    expect(state).toEqual({
      ingredients,
      isLoading: false,
      error: action.error,
    });
  });
});
