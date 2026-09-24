import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearConstructor, selectConstructor } from '../../services/constructorSlice';
import {
  clearOrder,
  createOrder,
  selectOrder,
  selectOrderLoading,
} from '../../services/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getCookie } from '../../utils/cookie';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorItems = useSelector(selectConstructor);
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrder);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!getCookie('accessToken')) {
      void navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id,
    ];
    void dispatch(createOrder(ingredients));
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
