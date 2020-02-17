import { FunctionComponent } from 'react'
import Head from 'next/head'
import Header from './Header';
import Main from './Main';
import Footer from './Footer';


const Layout: FunctionComponent = ({
  children
}) => (
  <>
    <Head>
      <title>App</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header/>
    <Main>{children}</Main>
    <Footer/>
  </>
)

export default Layout
