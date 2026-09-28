import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { logoutUser, selectLogoutError } from '../../services/userSlice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutError = useSelector(selectLogoutError);

  const handleLogout = (): void => {
    void dispatch(logoutUser()).then((action) => {
      if (logoutUser.fulfilled.match(action)) {
        void navigate('/login', { replace: true });
      }
    });
  };

  return (
    <ProfileMenuUI
      handleLogout={handleLogout}
      pathname={pathname}
      logoutError={logoutError ?? undefined}
    />
  );
};
