import type { NextPage } from 'next'
import styles from '../styles/components/header.module.css'

const Header: NextPage = () => {
  return (
    <div className={styles.header}>
        <nav>
            <h1>Check My Playlist.</h1>
            <ul>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>        
        
    </div>
  )
}

export default Header;
