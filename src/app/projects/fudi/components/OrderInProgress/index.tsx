"use client";

import { useAtomValue } from "jotai";
import {
  ORDER_STATUS_LABELS,
  activeOrdersAtom,
} from "../../atoms/orders";
import { OrderCard } from "../OrderCard";
import styles from "./styles.module.scss";

type OrderInProgressProps = {
  heading?: string;
};

const ETA_TEXT = "Estimated delivery: today 8:30 - 9:45 pm";

export function OrderInProgress({
  heading = "Order in Progress",
}: OrderInProgressProps) {
  const orders = useAtomValue(activeOrdersAtom);

  if (orders.length === 0) return null;

  const cards = orders.flatMap((order) =>
    order.restaurants.map((restaurant, index) => ({
      key: `${order.id}-${restaurant.restaurantId}`,
      restaurant: restaurant.restaurantName,
      orderLabel: `Order ${index + 1}/${order.restaurants.length}`,
      status: ORDER_STATUS_LABELS[order.status],
      eta: ETA_TEXT,
      activeStep: order.status,
    })),
  );

  return (
    <section className={styles.root}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.list}>
        {cards.map((card) => (
          <OrderCard
            key={card.key}
            restaurant={card.restaurant}
            orderLabel={card.orderLabel}
            status={card.status}
            eta={card.eta}
            activeStep={card.activeStep}
          />
        ))}
      </div>
    </section>
  );
}
