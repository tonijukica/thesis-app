import Layout from '../components/layout/Layout'
import { NextPage } from 'next'
import ProjectList from '../components/projects/ProjectList';

const IndexPage: NextPage = () => {
  return (
    <Layout>
        <ProjectList>
        </ProjectList>
    </Layout>
  )
}

export default IndexPage
