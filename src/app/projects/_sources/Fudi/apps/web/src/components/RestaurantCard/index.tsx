import styles from "./styles.module.scss";

type RestaurantCardProps = {
  name: string;
  tag: string;
  emoji: string;
  onClick?: () => void;
};

export function RestaurantCard({
  name,
  tag,
  emoji,
  onClick,
}: RestaurantCardProps) {
  return (
    <button type="button" className={styles.root} onClick={onClick}>
      <div className={styles.image} aria-hidden>
        {emoji}
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{name}</p>
        <p className={styles.tag}>{tag}</p>
      </div>
    </button>
  );
}
