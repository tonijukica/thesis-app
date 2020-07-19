import Layout from '../components/layout/Layout';
import { Courses } from '../components/courses/CourseList';
import { useAuth } from '../auth/hooks/useAuth';
import { NextPage } from 'next';

const IndexPage: NextPage = () => {
  const { isAuthenticated } = useAuth();
	return(
    <Layout>
      {
        isAuthenticated ?
        <Courses title='Courses'/>
        :
        <div style={{textAlign: 'center'}}>
          WELCOME TO APP
          <br/>
          Login to continue
        </div>
      }
    </Layout>
  )
};

export default IndexPage;
