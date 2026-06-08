import styles from "./styles.module.scss";

type PromoStripProps = {
  items?: string[];
};

const DEFAULT_ITEMS = [
  "Your Table in 30",
  "On Your Table in 30",
  "On Your Table in 30",
  "Free delivery for new users",
  "Order now, eat in minutes",
];

export function PromoStrip({ items = DEFAULT_ITEMS }: PromoStripProps) {
  const looped = [...items, ...items];

  return (
    <div className={styles.root}>
      <div className={styles.viewport}>
        <div className={styles.track}>
          {looped.map((text, i) => (
            <span key={i} className={styles.item}>
              <span>{text}</span>
              <span className={styles.dot} aria-hidden>
                •
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
