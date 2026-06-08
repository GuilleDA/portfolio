import styles from './ScrollToExplore.module.scss';

type Props = {
  showScroll: boolean;
}

export default function ScrollToExplore({ showScroll }: Props) {
  return <div className={`${styles.scrollIndicatorContainer} ${showScroll ? styles.scrollIndicatorContainer__visible : styles.scrollIndicatorContainer__hidden}`}>
    <div className={`${styles.scrollIndicator} ${showScroll ? styles.scrollIndicator__visible : styles.scrollIndicator__hidden}`}>
      <span>Scroll to explore</span>
      <span className={styles.scrollIndicator__arrow}>↓</span>
    </div>
  </div>
}
