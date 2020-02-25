import * as React from 'react'
import Link from 'next/link'
import Layout from '../components/layout/Layout'
import ProjectDetails from '../components/projects/ProjectDetails';

const AboutPage: React.FunctionComponent = () => (
  <Layout>
    <h1>About</h1>
    <p>This is the about page</p>
    <ProjectDetails
      name = 'Diplomski'
      studentName = 'Toni Jukica'
      url = 'https://google.com'
    />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export default AboutPage
