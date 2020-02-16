import * as React from 'react'
import Link from 'next/link'
import Layout from '../components/layout/Layout'
import { NextPage } from 'next'

const IndexPage: NextPage = () => {
  return (
    <Layout>
      <h1>Hello👋</h1>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </Layout>
  )
}

export default IndexPage
