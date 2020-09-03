import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import ProjectList from '../../components/projects/ProjectList';
import withLoginRequired from '../../auth/util/withLoginRequired';

const Projects: any = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <ProjectList courseId={Number(id)} />
    </Layout>
  );
};

export default withLoginRequired(Projects);
