import * as React from 'react'
import Link from 'next/link'
import Layout from '../components/layout/Layout'
import StudentDetail from '..//components/StudentDetail';

const AboutPage: React.FunctionComponent = () => (
  <Layout>
    <h1>About</h1>
    <p>This is the about page</p>
    <StudentDetail></StudentDetail>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export default AboutPage
