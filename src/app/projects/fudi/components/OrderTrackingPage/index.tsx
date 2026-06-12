"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FC, type SVGProps } from "react";
import { useAtomValue } from "jotai";
import DummyMap from "../../assets/dummy_map.png";
import OrderStep1 from "../../assets/order_step1.svg";
import OrderStep2 from "../../assets/order_step2.svg";
import OrderStep3 from "../../assets/order_step3.svg";
import OrderStep4 from "../../assets/order_step4.svg";
import { formatCurrency } from "../../atoms/cart";
import {
  ORDER_DRIVER_INFO,
  ORDER_STATUS_SUBTITLES,
  ORDER_STATUS_TITLES,
  ordersHistoryAtom,
  restaurantProductsCount,
  restaurantSubtotal,
  shortOrderId,
  type ActiveOrder,
  type OrderRestaurant,
} from "../../atoms/orders";
import {
  CartIcon,
  ChevronDown,
  CloseIcon,
  HeadphonesIcon,
} from "../icons";
import { cx } from "../../lib/cx";
import styles from "./styles.module.scss";

const STEP_ICONS: FC<SVGProps<SVGSVGElement>>[] = [
  OrderStep1,
  OrderStep2,
  OrderStep3,
  OrderStep4,
];

type OrderTrackingPageProps = {
  orderId?: string;
};

export function OrderTrackingPage({ orderId }: OrderTrackingPageProps) {
  const orders = useAtomValue(ordersHistoryAtom);

  const order = useMemo<ActiveOrder | undefined>(() => {
    if (orderId) return orders.find((entry) => entry.id === orderId);
    const active = orders.find((entry) => entry.status < 3);
    return active ?? orders[0];
  }, [orders, orderId]);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <button type="button" className={styles.supportButton}>
          <span>Support</span>
          <HeadphonesIcon className={styles.supportIcon} aria-hidden />
        </button>
        <Link
          href={orderId ? "/projects/fudi/orders" : "/"}
          aria-label="Close"
          className={styles.closeButton}
        >
          <CloseIcon className={styles.closeIcon} aria-hidden />
        </Link>
      </header>

      {!order ? (
        <EmptyState />
      ) : (
        <div className={styles.layout}>
          <div className={styles.content}>
            <div className={styles.tracker}>
              {(() => {
                const TrackerIcon = STEP_ICONS[order.status];
                return (
                  <TrackerIcon
                    className={styles.trackerImage}
                    role="img"
                    aria-label="Order status"
                  />
                );
              })()}
            </div>

            <section className={styles.info}>
              <h1 className={styles.title}>
                {ORDER_STATUS_TITLES[order.status]}
              </h1>
              <p className={styles.subtitle}>
                {ORDER_STATUS_SUBTITLES[order.status]}
              </p>
            </section>

            <div className={styles.mapWrap}>
              <Image
                src={DummyMap}
                alt="Delivery map"
                className={styles.map}
                priority
              />
            </div>
          </div>

          <aside className={styles.aside}>
            <div className={styles.asideInner}>
              <div className={styles.asideHeader}>
                <h2 className={styles.asideTitle}>Your order</h2>
                <span className={styles.asideId}>
                  #{shortOrderId(order.id)}
                </span>
              </div>
              <p className={styles.asideDriver}>
                {ORDER_DRIVER_INFO[order.status]}
              </p>
              <div className={styles.restaurants}>
                {order.restaurants.map((restaurant, index) => (
                  <RestaurantEntry
                    key={restaurant.restaurantId}
                    restaurant={restaurant}
                    index={index + 1}
                    total={order.restaurants.length}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon} aria-hidden>
        <CartIcon className={styles.emptyCartIcon} aria-hidden />
      </span>
      <p className={styles.emptyTitle}>No active orders</p>
      <p className={styles.emptyText}>
        Once you place an order it will show up here so you can track it.
      </p>
      <Link href="/projects/fudi" className={styles.emptyCta}>
        Browse restaurants
      </Link>
    </div>
  );
}

type RestaurantEntryProps = {
  restaurant: OrderRestaurant;
  index: number;
  total: number;
};

function RestaurantEntry({ restaurant, index, total }: RestaurantEntryProps) {
  const [expanded, setExpanded] = useState(false);

  const productsCount = restaurantProductsCount(restaurant);
  const subtotal = restaurantSubtotal(restaurant);

  const initial =
    restaurant.restaurantLogoLetter ??
    restaurant.restaurantName.charAt(0).toUpperCase();

  return (
    <article className={styles.restaurant}>
      {total > 1 && (
        <p className={styles.restaurantIndex}>
          Order {index}/{total}
        </p>
      )}

      <div className={cx(styles.card, expanded && styles.cardExpanded)}>
        <button
          type="button"
          className={styles.cardHeader}
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
        >
          <span
            className={styles.avatar}
            style={
              restaurant.restaurantLogoBackground
                ? {
                    background: restaurant.restaurantLogoBackground,
                    color: restaurant.restaurantLogoColor ?? "#fff",
                  }
                : undefined
            }
            aria-hidden
          >
            {initial}
          </span>

          <span className={styles.cardInfo}>
            <span className={styles.cardName}>
              {restaurant.restaurantName}
            </span>
            <span className={styles.cardCount}>
              {productsCount} {productsCount === 1 ? "product" : "products"}
            </span>
          </span>

          <ChevronDown
            className={cx(styles.chevron, expanded && styles.chevronOpen)}
            aria-hidden
          />
        </button>

        {expanded && (
          <ul className={styles.items}>
            {restaurant.items.map((item) => (
              <li
                key={`${restaurant.restaurantId}-${item.productId}`}
                className={styles.item}
              >
                <span className={styles.itemQuantity}>{item.quantity}×</span>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemPrice}>
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.cardFooter}>
          <span className={styles.cardTotal}>{formatCurrency(subtotal)}</span>
          {restaurant.restaurantDeliveryTime && (
            <span className={styles.cardEta}>
              {restaurant.restaurantDeliveryTime}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
