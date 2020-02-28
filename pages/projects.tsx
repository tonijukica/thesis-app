import Layout from '../components/layout/Layout'
import { NextPage } from 'next'
import ProjectList from '../components/projects/ProjectList';

const IndexPage: NextPage = () => {
  return (
    <Layout>
        <ProjectList courseId = {12}>
        </ProjectList>
    </Layout>
  )
}

export default IndexPage
