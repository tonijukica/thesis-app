import { FunctionComponent } from 'react';
import { useRouter } from 'next/router'
import Layout from '../../components/layout/Layout';
import ProjectDetails from '../../components/projects/ProjectDetails';

const Project: FunctionComponent = () => {
    const router = useRouter();
    const { id } = router.query;
    return(
        <Layout>
            <ProjectDetails projectId = {Number(id)}/>
        </Layout>
    )
}

export default Project