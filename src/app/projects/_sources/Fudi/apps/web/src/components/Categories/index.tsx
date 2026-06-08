import styles from "./styles.module.scss";

type Category = {
  label: string;
  emoji: string;
};

type CategoriesProps = {
  items?: Category[];
  heading?: string;
};

const DEFAULT_ITEMS: Category[] = [
  { label: "Asian", emoji: "🍜" },
  { label: "Pizza", emoji: "🍕" },
  { label: "Burgers", emoji: "🍔" },
  { label: "Healthy", emoji: "🥗" },
  { label: "Desserts", emoji: "🍦" },
  { label: "Sushi", emoji: "🍣" },
  { label: "Drinks", emoji: "🥤" },
  { label: "Coffee", emoji: "☕" },
];

export function Categories({
  items = DEFAULT_ITEMS,
  heading = "Categories",
}: CategoriesProps) {
  return (
    <nav className={styles.root}>
      <h2 className={styles.heading}>{heading}</h2>
      <ul className={styles.list}>
        {items.map((c) => (
          <li key={c.label} className={styles.item}>
            <button type="button" className={styles.button}>
              <span className={styles.circle}>{c.emoji}</span>
              <span className={styles.label}>{c.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
