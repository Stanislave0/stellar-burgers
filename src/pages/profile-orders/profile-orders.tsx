import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchOrders, selectOrders } from '../../services/ordersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);

  useEffect(() => {
    void dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
