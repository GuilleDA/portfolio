import {
  listRestaurantSummaries,
  type RestaurantSummary,
} from "../../lib/restaurants";
import { RestaurantCard } from "../RestaurantCard";
import styles from "./styles.module.scss";

type WeekendCravingsProps = {
  items?: RestaurantSummary[];
  heading?: string;
  ctaLabel?: string;
};

export function WeekendCravings({
  items = listRestaurantSummaries(),
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
              time={item.deliveryTime}
              price={item.deliveryPrice}
              image={item.image}
              imageAlt={item.imageAlt}
              emoji={item.emoji}
              rating={item.rating}
              hasDiscount={item.hasDiscount}
              href={`/projects/fudi/restaurant/${item.id}`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
