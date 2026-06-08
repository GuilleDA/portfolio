import styles from './HeroHeader.module.scss';
import LogoIcon from '../../assets/logo.svg';

export default function HeroHeader() {
  return <header className={styles.header}>
    <div className={styles.header__logo}>
      <LogoIcon />
    </div>
    <nav className={styles.header__nav}>
      <a href="#" className={styles.nav__link}>About us</a>
      <button className={styles.nav__button}>Log in</button>
    </nav>
  </header>
}
