import { Preloader, OrderInfoUI } from '@ui';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectFeedOrders } from '../../services/feedSlice';
import { selectIngredients } from '../../services/ingredientsSlice';
import { selectOrders } from '../../services/ordersSlice';
import { useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectOrders);
  const ingredients = useSelector(selectIngredients);
  const orderData = [...feedOrders, ...profileOrders].find(
    (order) => order.number === Number(number)
  );

  /**
   * использование useMemo не обязательно
   */
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
