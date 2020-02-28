import { FC } from 'react';
import { useRouter } from 'next/router'
import Layout from '../../components/layout/Layout';
import ProjectList from '../../components/projects/ProjectList';

const Projects: FC =() => {
    const router = useRouter();
    const { id } = router.query; 
    return(
        <Layout>
            <ProjectList courseId = {Number(id)} />
        </Layout>
    )
}

export default Projects
