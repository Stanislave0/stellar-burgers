import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect, type ReactNode } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '../../services/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, selectIsAuthChecked, selectUser } from '../../services/userSlice';

import type { AppContentProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = (location.state as { backgroundLocation?: Location } | null)
    ?.backgroundLocation;

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    void dispatch(getUser());
  }, [dispatch]);

  const handleModalClose = (): void => {
    void navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation ?? location}>
        <Route
          path="/"
          element={
            <AppContent
              ingredients={ingredients}
              isLoading={isIngredientsLoading}
              error={ingredientsError}
            />
          }
        />
        <Route path="/feed" element={<Feed />} />
        <Route element={<AuthRoute onlyUnAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<AuthRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route
            path="/profile/orders/:number"
            element={
              <DetailPage title="Детали заказа">
                <OrderInfo />
              </DetailPage>
            }
          />
        </Route>
        <Route
          path="/feed/:number"
          element={
            <DetailPage title="Детали заказа">
              <OrderInfo />
            </DetailPage>
          }
        />
        <Route
          path="/ingredients/:id"
          element={
            <DetailPage title="Детали ингредиента">
              <IngredientDetails />
            </DetailPage>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={<OrderModal onClose={handleModalClose} />}
          />
          <Route element={<AuthRoute />}>
            <Route
              path="/profile/orders/:number"
              element={<OrderModal onClose={handleModalClose} />}
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;

const AuthRoute = ({
  onlyUnAuth = false,
}: {
  onlyUnAuth?: boolean;
}): React.JSX.Element => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to="/profile" replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

const DetailPage = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): React.JSX.Element => (
  <main className={styles.detailPageWrap}>
    <h2 className={`${styles.detailHeader} text text_type_main-large`}>{title}</h2>
    {children}
  </main>
);

const OrderModal = ({ onClose }: { onClose: () => void }): React.JSX.Element => {
  const { number } = useParams();

  return (
    <Modal title={`Номер заказа ${number ?? ''}`} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => <ConstructorPage />;
