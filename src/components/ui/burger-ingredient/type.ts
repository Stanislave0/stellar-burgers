import type { TIngredient } from '@utils-types';
import type { Location } from 'react-router-dom';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count: number;
  locationState: { backgroundLocation: Location };
  handleAdd: () => void;
};
