import { NextPage } from 'next';
import { ThemeProvider } from '@material-ui/core';
import Auth from '../components/auth/Auth';
import theme from '../components/layout/theme';

const AuthPage: NextPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Auth />
    </ThemeProvider>
  );
};

export default AuthPage;
