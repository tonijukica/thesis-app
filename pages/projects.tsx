import Layout from '../components/layout/Layout'
import { NextPage } from 'next'
import StudentList from '../components/StudentList';

const IndexPage: NextPage = () => {
  return (
    <Layout>
        <StudentList>
        </StudentList>
    </Layout>
  )
}

export default IndexPage
