import Layout from '../../components/layout/Layout';
import { Courses } from '../../components/courses/CourseList';
import withLoginRequired from '../../auth/util/withLoginRequired';

const IndexPage: any = () => {
  return (
    <Layout>
      <Courses title="Courses" />
    </Layout>
  );
};

export default withLoginRequired(IndexPage);
