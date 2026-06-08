import { RestaurantCard } from "../RestaurantCard";
import styles from "./styles.module.scss";

type Restaurant = {
  id: string;
  name: string;
  tag: string;
  emoji: string;
};

type WeekendCravingsProps = {
  items?: Restaurant[];
  heading?: string;
  ctaLabel?: string;
};

const DEFAULT_ITEMS: Restaurant[] = [
  { id: "1", name: "Burger Bros", tag: "Burgers • 25 min", emoji: "🍔" },
  { id: "2", name: "Tokyo Bowl", tag: "Asian • 30 min", emoji: "🍜" },
  { id: "3", name: "Green Garden", tag: "Healthy • 20 min", emoji: "🥗" },
  { id: "4", name: "Sweet Spot", tag: "Desserts • 15 min", emoji: "🍦" },
  { id: "5", name: "Papa Johns", tag: "Pizza • 35 min", emoji: "🍕" },
  { id: "6", name: "Sushi Club", tag: "Sushi • 40 min", emoji: "🍣" },
  { id: "7", name: "Bean & Co", tag: "Coffee • 10 min", emoji: "☕" },
  { id: "8", name: "Juice Bar", tag: "Drinks • 15 min", emoji: "🥤" },
];

export function WeekendCravings({
  items = DEFAULT_ITEMS,
  heading = "Weekend Cravings",
  ctaLabel = "See all",
}: WeekendCravingsProps) {
  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        <button type="button" className={styles.cta}>
          {ctaLabel}
        </button>
      </div>
      <ul className={styles.grid}>
        {items.map((item) => (
          <li key={item.id}>
            <RestaurantCard
              name={item.name}
              tag={item.tag}
              emoji={item.emoji}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
