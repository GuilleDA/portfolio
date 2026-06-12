"use client";

import Image, { type StaticImageData } from "next/image";
import { useAtomValue, useSetAtom } from "jotai";
import {
  addItemAtom,
  cartItemsAtom,
  selectCartItem,
  setItemQuantityAtom,
} from "../../atoms/cart";
import { PlusIcon } from "../icons";
import { QuantityStepper } from "../QuantityStepper";
import { cx } from "../../lib/cx";
import styles from "./styles.module.scss";

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: StaticImageData;
  imageAlt?: string;
  discountBadge?: { src: StaticImageData; alt: string };
  discountLabel?: string;
};

type ProductCardProps = {
  product: Product;
  restaurantId: string;
  restaurantName: string;
};

function formatPrice(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function ProductCard({
  product,
  restaurantId,
  restaurantName,
}: ProductCardProps) {
  const items = useAtomValue(cartItemsAtom);
  const addItem = useSetAtom(addItemAtom);
  const setQuantity = useSetAtom(setItemQuantityAtom);

  const cartItem = selectCartItem(items, restaurantId, product.id);
  const quantity = cartItem?.quantity ?? 0;
  const isInCart = quantity > 0;

  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  function handleAdd() {
    addItem({
      productId: product.id,
      restaurantId,
      restaurantName,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    });
  }

  function handleIncrement() {
    setQuantity({
      restaurantId,
      productId: product.id,
      quantity: quantity + 1,
    });
  }

  function handleDecrement() {
    setQuantity({
      restaurantId,
      productId: product.id,
      quantity: quantity - 1,
    });
  }

  return (
    <article className={styles.root}>
      <div className={styles.media}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt ?? product.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden>
            🍽️
          </div>
        )}

        {product.discountBadge && (
          <Image
            src={product.discountBadge.src}
            alt={product.discountBadge.alt}
            className={styles.discountImage}
          />
        )}

        {!product.discountBadge && product.discountLabel && (
          <span className={styles.discountText}>{product.discountLabel}</span>
        )}

        <div className={styles.action}>
          {isInCart ? (
            <QuantityStepper
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              ariaLabel={`${product.name} quantity`}
            />
          ) : (
            <button
              type="button"
              className={styles.addButton}
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
            >
              <PlusIcon className={styles.addIcon} aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.priceRow}>
          <span className={cx(styles.price, hasDiscount && styles.priceSale)}>
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className={styles.originalPrice}>
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
