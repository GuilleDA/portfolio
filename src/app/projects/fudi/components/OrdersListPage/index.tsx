"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";
import { formatCurrency } from "../../atoms/cart";
import {
  ORDER_STATUS_LABELS,
  orderProductsCount,
  orderTotal,
  ordersHistoryAtom,
  shortOrderId,
  type ActiveOrder,
} from "../../atoms/orders";
import { BagIcon, ChevronLeftIcon } from "../icons";
import { cx } from "../../lib/cx";
import styles from "./styles.module.scss";

export function OrdersListPage() {
  const orders = useAtomValue(ordersHistoryAtom);

  const isEmpty = orders.length === 0;
  const activeCount = orders.filter((order) => order.status < 3).length;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link href="/projects/fudi" aria-label="Back" className={styles.back}>
          <ChevronLeftIcon className={styles.backIcon} aria-hidden />
          <span>Your orders</span>
        </Link>
        {!isEmpty && (
          <p className={styles.count}>
            {activeCount > 0
              ? `${activeCount} active · ${orders.length} total`
              : `${orders.length} ${orders.length === 1 ? "order" : "orders"}`}
          </p>
        )}
      </header>

      {isEmpty ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden>
            <BagIcon className={styles.emptyBag} aria-hidden />
          </span>
          <p className={styles.emptyTitle}>No orders yet</p>
          <p className={styles.emptyText}>
            Your past and active orders will appear here.
          </p>
          <Link href="/projects/fudi" className={styles.emptyCta}>
            Browse restaurants
          </Link>
        </div>
      ) : (
        <ul className={styles.list}>
          {orders.map((order) => (
            <li key={order.id}>
              <OrderRow order={order} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type OrderRowProps = {
  order: ActiveOrder;
};

function OrderRow({ order }: OrderRowProps) {
  const productsCount = orderProductsCount(order);
  const total = orderTotal(order);
  const isActive = order.status < 3;

  return (
    <Link href={`/projects/fudi/order?id=${order.id}`} className={styles.row}>
      <div className={styles.rowMain}>
        <div className={styles.rowHeader}>
          <span
            className={cx(
              styles.statusBadge,
              isActive ? styles.statusActive : styles.statusDelivered,
            )}
          >
            <span className={styles.statusDot} aria-hidden />
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          <span className={styles.rowId}>#{shortOrderId(order.id)}</span>
        </div>

        <p className={styles.rowDate}>{formatDate(order.createdAt)}</p>

        <div className={styles.avatars}>
          {order.restaurants.map((restaurant) => (
            <span
              key={restaurant.restaurantId}
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
              {restaurant.restaurantLogoLetter ??
                restaurant.restaurantName.charAt(0).toUpperCase()}
            </span>
          ))}
          <span className={styles.restaurantsLabel}>
            {order.restaurants
              .map((restaurant) => restaurant.restaurantName)
              .join(" · ")}
          </span>
        </div>
      </div>

      <div className={styles.rowFooter}>
        <span className={styles.rowMeta}>
          {productsCount} {productsCount === 1 ? "product" : "products"} ·{" "}
          {order.restaurants.length}{" "}
          {order.restaurants.length === 1 ? "restaurant" : "restaurants"}
        </span>
        <strong className={styles.rowTotal}>{formatCurrency(total)}</strong>
      </div>
    </Link>
  );
}

const DATE_FORMATTER =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

function formatDate(timestamp: number): string {
  if (DATE_FORMATTER) return DATE_FORMATTER.format(new Date(timestamp));
  return new Date(timestamp).toLocaleString();
}
