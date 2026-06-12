"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  cartByRestaurantAtom,
  clearCartAtom,
  formatCurrency,
  removeRestaurantAtom,
  setItemQuantityAtom,
  type CartItem,
  type CartRestaurantGroup,
} from "../../atoms/cart";
import {
  CartIcon,
  ChevronLeftIcon,
  ClockIcon,
  ScooterIcon,
} from "../icons";
import { QuantityStepper } from "../QuantityStepper";
import { cx } from "../../lib/cx";
import styles from "./styles.module.scss";

type CartPageProps = {
  backHref?: string;
};

export function CartPage({ backHref = "/" }: CartPageProps) {
  const groups = useAtomValue(cartByRestaurantAtom);
  const clearCart = useSetAtom(clearCartAtom);
  const removeRestaurant = useSetAtom(removeRestaurantAtom);
  const setQuantity = useSetAtom(setItemQuantityAtom);

  const [excluded, setExcluded] = useState<Record<string, boolean>>({});

  const includedGroups = useMemo(
    () => groups.filter((group) => !excluded[group.restaurantId]),
    [groups, excluded],
  );

  const totals = useMemo(() => {
    const includedItems = includedGroups.flatMap((group) => group.items);

    const productsCount = includedItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );

    const productsSubtotal = includedItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );

    const productsOriginal = includedItems.reduce(
      (acc, item) =>
        acc + item.quantity * (item.originalPrice ?? item.price),
      0,
    );

    const shippingFees = includedGroups.reduce(
      (acc, group) => acc + (group.restaurantDeliveryFee ?? 0),
      0,
    );

    return {
      productsCount,
      productsSubtotal,
      productsOriginal,
      shippingFees,
      shippingCount: includedGroups.length,
      total: productsSubtotal + shippingFees,
    };
  }, [includedGroups]);

  const isEmpty = groups.length === 0;

  function toggleRestaurant(restaurantId: string) {
    setExcluded((current) => ({
      ...current,
      [restaurantId]: !current[restaurantId],
    }));
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link href={backHref} aria-label="Back" className={styles.back}>
          <ChevronLeftIcon className={styles.backIcon} aria-hidden />
          <span>Your cart</span>
        </Link>
        {!isEmpty && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => {
              clearCart();
              setExcluded({});
            }}
          >
            Clear
          </button>
        )}
      </header>

      {isEmpty ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden>
            <CartIcon className={styles.emptyCartIcon} aria-hidden />
          </span>
          <p className={styles.emptyTitle}>Your cart is empty</p>
          <p className={styles.emptyText}>
            Add items from a restaurant to get started.
          </p>
          <Link href="/" className={styles.emptyCta}>
            Browse restaurants
          </Link>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.content}>
            <div className={styles.groups}>
              {groups.map((group) => (
                <CartGroup
                  key={group.restaurantId}
                  group={group}
                  excluded={Boolean(excluded[group.restaurantId])}
                  onToggle={() => toggleRestaurant(group.restaurantId)}
                  onRemove={() => removeRestaurant(group.restaurantId)}
                  onIncrement={(item) =>
                    setQuantity({
                      restaurantId: item.restaurantId,
                      productId: item.productId,
                      quantity: item.quantity + 1,
                    })
                  }
                  onDecrement={(item) =>
                    setQuantity({
                      restaurantId: item.restaurantId,
                      productId: item.productId,
                      quantity: item.quantity - 1,
                    })
                  }
                />
              ))}
            </div>

            <p className={styles.disclaimer}>
              *Separate shipping and delivery per store.
            </p>
          </div>

          <aside className={styles.aside}>
            <div className={styles.asideInner}>
              <h2 className={styles.asideTitle}>Order summary</h2>

              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Products ({totals.productsCount})</span>
                  <span className={styles.summaryPrices}>
                    {totals.productsOriginal > totals.productsSubtotal && (
                      <span className={styles.summaryOriginal}>
                        {formatCurrency(totals.productsOriginal)}
                      </span>
                    )}
                    <strong>{formatCurrency(totals.productsSubtotal)}</strong>
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping ({totals.shippingCount})</span>
                  <strong>{formatCurrency(totals.shippingFees)}</strong>
                </div>

                <div className={styles.summaryDivider} />

                <div className={cx(styles.summaryRow, styles.summaryTotal)}>
                  <span>Total</span>
                  <strong>{formatCurrency(totals.total)}</strong>
                </div>
              </div>

              <div className={styles.checkoutWrap}>
                <button
                  type="button"
                  className={styles.checkout}
                  disabled={totals.productsCount === 0}
                >
                  <span>Checkout</span>
                  <strong>{formatCurrency(totals.total)}</strong>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

type CartGroupProps = {
  group: CartRestaurantGroup;
  excluded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onIncrement: (item: CartItem) => void;
  onDecrement: (item: CartItem) => void;
};

function CartGroup({
  group,
  excluded,
  onToggle,
  onIncrement,
  onDecrement,
}: CartGroupProps) {
  const productsCount = group.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const deliveryLabel =
    group.restaurantDeliveryLabel ??
    (typeof group.restaurantDeliveryFee === "number"
      ? formatCurrency(group.restaurantDeliveryFee)
      : "—");

  const initial =
    group.restaurantLogoLetter ??
    group.restaurantName.charAt(0).toUpperCase();

  const restaurantHref = `/projects/fudi/restaurant/${group.restaurantId}`;

  return (
    <section
      className={cx(styles.group, excluded && styles.groupExcluded)}
      aria-label={group.restaurantName}
    >
      <header className={styles.groupHeader}>
        <Link
          href={restaurantHref}
          className={styles.groupLink}
          aria-label={`View ${group.restaurantName}`}
        >
          <span
            className={styles.avatar}
            style={
              group.restaurantLogoBackground
                ? {
                    background: group.restaurantLogoBackground,
                    color: group.restaurantLogoColor ?? "#fff",
                  }
                : undefined
            }
            aria-hidden
          >
            {initial}
          </span>

          <div className={styles.groupInfo}>
            <p className={styles.groupName}>{group.restaurantName}</p>
            <p className={styles.groupCount}>
              {productsCount} {productsCount === 1 ? "product" : "products"}
            </p>
          </div>
        </Link>

        <button
          type="button"
          className={cx(
            styles.toggle,
            !excluded && styles.toggleActive,
          )}
          onClick={onToggle}
          aria-pressed={!excluded}
          aria-label={
            excluded ? "Include in checkout" : "Exclude from checkout"
          }
        >
          {!excluded && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className={styles.toggleIcon}
              aria-hidden
            >
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </header>

      <div className={styles.delivery}>
        <span className={styles.deliveryItem}>
          <ClockIcon className={styles.deliveryIcon} aria-hidden />
          {group.restaurantDeliveryTime ?? "—"}
        </span>
        <span className={styles.deliveryItem}>
          <ScooterIcon className={styles.deliveryIcon} aria-hidden />
          {deliveryLabel}
        </span>
      </div>

      <ul className={styles.items}>
        {group.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <Link
              href={restaurantHref}
              className={styles.itemImage}
              aria-label={`View ${group.restaurantName}`}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  width={64}
                  height={64}
                  className={styles.itemImageElement}
                />
              ) : (
                <span className={styles.itemImagePlaceholder} aria-hidden>
                  🍽️
                </span>
              )}
            </Link>

            <div className={styles.itemDetails}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemPriceRow}>
                <span className={styles.itemPrice}>
                  {formatCurrency(item.price)}
                </span>
                {typeof item.originalPrice === "number" &&
                  item.originalPrice > item.price && (
                    <span className={styles.itemOriginal}>
                      {formatCurrency(item.originalPrice)}
                    </span>
                  )}
              </p>
            </div>

            <QuantityStepper
              quantity={item.quantity}
              onIncrement={() => onIncrement(item)}
              onDecrement={() => onDecrement(item)}
              ariaLabel={`${item.name} quantity`}
              variant="light"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
