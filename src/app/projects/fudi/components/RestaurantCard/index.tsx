import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import DiscountBadge50 from "../../assets/discount_badge_50.svg";
import { ClockIcon, ScooterIcon, StarIcon } from "../icons";
import styles from "./styles.module.scss";

type RestaurantCardProps = {
  name: string;
  time: string;
  price: string;
  image?: StaticImageData;
  imageAlt?: string;
  emoji?: string;
  rating?: number;
  hasDiscount?: boolean;
  href?: string;
  onClick?: () => void;
};

function CardShell({
  href,
  onClick,
  children,
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (href) {
    return (
      <Link href={href} className={styles.root}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={styles.root} onClick={onClick}>
      {children}
    </button>
  );
}

export function RestaurantCard({
  name,
  time,
  price,
  image,
  imageAlt,
  emoji,
  rating,
  hasDiscount,
  href,
  onClick,
}: RestaurantCardProps) {
  return (
    <CardShell href={href} onClick={onClick}>
      <div className={styles.media}>
        {image ? (
          <Image
            src={image}
            alt={imageAlt ?? name}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden>
            {emoji}
          </div>
        )}

        {hasDiscount && (
          <DiscountBadge50
            className={styles.discount}
            role="img"
            aria-label="50% Off"
          />
        )}

        {typeof rating === "number" && (
          <span className={styles.rating}>
            <StarIcon className={styles.starIcon} aria-hidden />
            {rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.name}>{name}</p>
        <p className={styles.meta}>
          <span className={styles.metaItem}>
            <ClockIcon className={styles.metaIcon} aria-hidden />
            {time}
          </span>
          <span className={styles.metaDot} aria-hidden>
            •
          </span>
          <span className={styles.metaItem}>
            <ScooterIcon className={styles.metaIcon} aria-hidden />
            {price}
          </span>
        </p>
      </div>
    </CardShell>
  );
}
