import Layout from '../components/layout/Layout'
import { Courses } from '../components/courses';
import { NextPage } from 'next'

const IndexPage: NextPage = () => {
  return (
    <Layout>
      <Courses title = 'Courses'>
      </Courses>
    </Layout>
  )
}

export default IndexPage
