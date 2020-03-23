
import { useRouter } from 'next/router'
import Layout from '../../components/layout/Layout';
import ProjectDetails from '../../components/projects/ProjectDetails';
import { withLoginRequired } from 'use-auth0-hooks';

const Project: any = () => {
    const router = useRouter();
    const { id } = router.query;
    return(
        <Layout>
            <ProjectDetails projectId = {Number(id)}/>
        </Layout>
    )
}

export default withLoginRequired(Project)