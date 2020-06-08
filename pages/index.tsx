import Layout from '../components/layout/Layout';
import { NextPage } from 'next';

const IndexPage: NextPage = () => {
	return(
    <Layout>
      <div style={{textAlign: 'center'}}>
        WELCOME TO APP
      </div>
    </Layout>
  )
};

export default IndexPage;
