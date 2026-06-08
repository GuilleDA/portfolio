import styles from "./styles.module.scss";

export type AdTone = "emerald" | "rose" | "amber";

type AdCardProps = {
  tone: AdTone;
  eyebrow: string;
  eyebrowSmall?: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  brand: string;
  emoji: string;
};

export function AdCard({
  tone,
  eyebrow,
  eyebrowSmall,
  title,
  titleAccent,
  subtitle,
  brand,
  emoji,
}: AdCardProps) {
  return (
    <article className={`${styles.root} ${styles[tone]}`}>
      <div className={styles.shine} aria-hidden />
      <div className={styles.content}>
        <div>
          <p className={styles.eyebrow}>
            {eyebrow}
            {eyebrowSmall ? ` ${eyebrowSmall}` : ""}
          </p>
          <h3 className={styles.title}>
            {title} <span className={styles.titleAccent}>{titleAccent}</span>
            <br />
            {subtitle}
          </h3>
        </div>
        <span className={styles.brand}>{brand}</span>
      </div>
      <div className={styles.emoji} aria-hidden>
        {emoji}
      </div>
    </article>
  );
}
