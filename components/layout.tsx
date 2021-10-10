import type { NextPage } from 'next'
import Head from 'next/head'
import Header from './header'
import Footer from './footer'
import styles from '../styles/components/layout.module.css'

const Layout: NextPage = ({ children }) => {
  return (
      <>
        <Head>
          <title>Check My Playlist</title>
          <meta name="Check My Playlist" content="helps you find faults in your own playlists" />
          <link rel="icon" type="image/svg+xml" href="/check.svg" />
        </Head>
        <Header />
        <div className={styles.content}>{children}</div>
        <Footer />
    </>
  )
}

export default Layout;
