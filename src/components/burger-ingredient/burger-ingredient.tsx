import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import { addIngredient, setBun } from '../../services/constructorSlice';
import { useDispatch } from '../../services/store';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
  count,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleAdd = (): void => {
    if (ingredient.type === 'bun') {
      dispatch(
        setBun({
          ...ingredient,
          id: ingredient._id,
        })
      );
      return;
    }

    dispatch(
      addIngredient({
        ...ingredient,
        id: `${ingredient._id}-${Date.now()}-${Math.random()}`,
      })
    );
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
