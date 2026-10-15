import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectFeedOrders } from '../../services/feedSlice';
import { selectIngredients } from '../../services/ingredientsSlice';
import {
  fetchOrderByNumber,
  selectOrderDetails,
  selectOrderDetailsError,
  selectOrderDetailsNumber,
} from '../../services/orderSlice';
import { selectOrders } from '../../services/ordersSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectOrders);
  const ingredients = useSelector(selectIngredients);
  const detailsOrder = useSelector(selectOrderDetails);
  const detailsError = useSelector(selectOrderDetailsError);
  const detailsNumber = useSelector(selectOrderDetailsNumber);
  const orderNumber = Number(number);
  const orderData =
    [...feedOrders, ...profileOrders].find((order) => order.number === orderNumber) ??
    (detailsOrder?.number === orderNumber ? detailsOrder : null);

  useEffect(() => {
    if (!Number.isSafeInteger(orderNumber) || orderData) return;

    void dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, orderData, orderNumber]);

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

  if (detailsError && detailsNumber === orderNumber) {
    return (
      <p role="alert" className="text text_type_main-medium">
        Не удалось загрузить заказ
        {detailsError.message ? `: ${detailsError.message}` : '.'}
      </p>
    );
  }

  if (!Number.isSafeInteger(orderNumber)) {
    return <p className="text text_type_main-medium">Заказ не найден</p>;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
