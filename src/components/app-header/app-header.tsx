import { AppHeaderUI } from '@ui';

import { useSelector } from '../../services/store';
import { selectUser } from '../../services/userSlice';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
