import type { NextPage } from 'next'
import styles from '../styles/components/footer.module.css'

const Footer: NextPage = () => {
  return (
    <footer className={styles.footer}>        
        <a href="/contact">something wrong? tell us</a>
    </footer>
  )
}

export default Footer;
