import reducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
  setBun,
} from './constructorSlice';

import type { TConstructorIngredient, TConstructorState } from '../utils/types';

const bun: TConstructorIngredient = {
  _id: 'bun-1',
  id: 'bun-1',
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
};

const fillingOne: TConstructorIngredient = {
  _id: 'main-1',
  id: 'main-1-instance',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png',
};

const fillingTwo: TConstructorIngredient = {
  ...fillingOne,
  _id: 'main-2',
  id: 'main-2-instance',
  name: 'Мясо бессмертных моллюсков Protostomia',
};

const populatedState: TConstructorState = {
  bun,
  ingredients: [fillingOne, fillingTwo],
};

describe('burgerConstructor reducer', () => {
  it('возвращает начальное состояние для неизвестного действия.', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('устанавливает булку', () => {
    expect(reducer(undefined, setBun(bun))).toEqual({
      bun,
      ingredients: [],
    });
  });

  it('добавляет ингредиент', () => {
    expect(reducer(undefined, addIngredient(fillingOne))).toEqual({
      bun: null,
      ingredients: [fillingOne],
    });
  });

  it('удаляет ингредиент по его идентификатору экземпляра', () => {
    expect(reducer(populatedState, removeIngredient(fillingOne.id))).toEqual({
      bun,
      ingredients: [fillingTwo],
    });
  });

  it('перемещает ингредиент вверх или вниз', () => {
    expect(
      reducer(populatedState, moveIngredient({ index: 1, direction: 'up' }))
    ).toEqual({
      bun,
      ingredients: [fillingTwo, fillingOne],
    });

    expect(
      reducer(populatedState, moveIngredient({ index: 0, direction: 'down' }))
    ).toEqual({
      bun,
      ingredients: [fillingTwo, fillingOne],
    });
  });

  it('не перемещает ингредиент за пределы списка', () => {
    expect(
      reducer(populatedState, moveIngredient({ index: 0, direction: 'up' }))
    ).toEqual(populatedState);
    expect(
      reducer(populatedState, moveIngredient({ index: 1, direction: 'down' }))
    ).toEqual(populatedState);
  });

  it('очищает конструктор', () => {
    expect(reducer(populatedState, clearConstructor())).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
