import type { NextPage } from 'next'

import styles from '../styles/pages/index.module.css'
import Layout from '../components/layout'

const Home: NextPage = () => {
  const scope = 'playlist-modify-private user-library-read playlist-modify user-library-modify'
  const clientId = 'a008cd6dfb86440db620b8948e5e2ea5'
 

  return (         
    <Layout>
      <div className={styles.homeText}>
        <h1 className={styles.title}>Check your playlist for duplicates. Automatically.</h1>
        <p>No more artists ruinning our library by releasing the same song over and over again.</p>
        <button className={styles.loginButton}>
          <a href={`http://accounts.spotify.com/authorize?client_id=${encodeURIComponent(clientId)}&response_type=token&redirect_uri=http://localhost:3000/playlists&scope=${encodeURIComponent(scope)}`}>
            Login to your spotify now.
            </a>
        </button>
        <p>And let <b>us</b> do the rest.</p>
      </div>      
    </Layout>    
  )
}



export default Home
