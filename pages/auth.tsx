import Layout from '../components/layout/Layout';
import { NextPage } from 'next';
import Auth from '../components/auth/Auth';

const AuthPage: NextPage = () => {
	return (
    <Layout>
      <Auth/>
    </Layout>
  )
};

export default AuthPage;
