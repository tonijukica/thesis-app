
import Layout from '../../components/layout/Layout'
import { Courses } from '../../components/courses/CourseList';

import { withLoginRequired } from 'use-auth0-hooks';


const IndexPage: any = () =>{
    return (
      <Layout>
        <Courses title = 'Courses'>
        </Courses>
      </Layout>
    );
}

export default withLoginRequired(IndexPage);
