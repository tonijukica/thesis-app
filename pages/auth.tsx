import { NextPage } from 'next';
import Auth from '../components/auth/Auth';
import { ThemeProvider } from '@material-ui/core';
import theme from '../components/layout/theme';

const AuthPage: NextPage = () => {
	return (
    <ThemeProvider theme={theme}>
      <Auth/>
    </ThemeProvider>
  )
};

export default AuthPage;
