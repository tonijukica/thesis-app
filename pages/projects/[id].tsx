import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import ProjectDetails from '../../components/projects/ProjectDetails';
import withLoginRequired from '../../auth/util/withLoginRequired'


const Project: any = () => {
	const router = useRouter();
	const { id } = router.query;
	return (
		<Layout>
			<ProjectDetails projectId={Number(id)} />
		</Layout>
	);
};

export default withLoginRequired(Project);
