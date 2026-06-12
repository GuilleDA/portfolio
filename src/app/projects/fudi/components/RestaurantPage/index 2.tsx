"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { cartItemCountAtom } from "../../atoms/cart";
import {
  CartIcon,
  ChevronLeftIcon,
  ClockIcon,
  ScooterIcon,
  SearchIcon,
  StarIcon,
} from "../icons";
import { ProductCard, type Product } from "../ProductCard";
import { cx } from "../../lib/cx";
import styles from "./styles.module.scss";

export type RestaurantCategory = {
  id: string;
  name: string;
  products: Product[];
};

export type Restaurant = {
  id: string;
  name: string;
  image?: StaticImageData;
  imageAlt?: string;
  logo?: StaticImageData;
  logoLetter?: string;
  logoBackground?: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  deliveryPrice: string;
  categories: RestaurantCategory[];
};

type RestaurantPageProps = {
  restaurant: Restaurant;
  backHref?: string;
};

const OFFERS_TAB_ID = "__offers";
const ALL_TAB_ID = "__all";

export function RestaurantPage({
  restaurant,
  backHref = "/",
}: RestaurantPageProps) {
  const cartCount = useAtomValue(cartItemCountAtom);

  const offerProducts = useMemo(
    () =>
      restaurant.categories.flatMap((category) =>
        category.products.filter(
          (product) =>
            typeof product.originalPrice === "number" &&
            product.originalPrice > product.price,
        ),
      ),
    [restaurant.categories],
  );

  const tabs = useMemo(() => {
    const baseTabs: { id: string; label: string }[] = [
      { id: ALL_TAB_ID, label: "All" },
    ];

    if (offerProducts.length > 0) {
      baseTabs.push({ id: OFFERS_TAB_ID, label: "Offers" });
    }

    for (const category of restaurant.categories) {
      baseTabs.push({ id: category.id, label: category.name });
    }

    return baseTabs;
  }, [offerProducts.length, restaurant.categories]);

  const [activeTab, setActiveTab] = useState<string>(ALL_TAB_ID);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const isUserClickingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserClickingRef.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveTab(visible.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    const sections = Object.values(sectionRefs.current).filter(
      (section): section is HTMLElement => Boolean(section),
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [restaurant.categories.length, offerProducts.length]);

  function handleTabClick(tabId: string) {
    isUserClickingRef.current = true;
    setActiveTab(tabId);
    sectionRefs.current[tabId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.setTimeout(() => {
      isUserClickingRef.current = false;
    }, 800);
  }

  const ratingFormatted = restaurant.rating.toFixed(1);

  return (
    <main className={styles.root}>
      <div className={styles.hero}>
        {restaurant.image ? (
          <Image
            src={restaurant.image}
            alt={restaurant.imageAlt ?? restaurant.name}
            className={styles.heroImage}
            priority
          />
        ) : (
          <div className={styles.heroFallback} aria-hidden />
        )}
        <div className={styles.heroOverlay} aria-hidden />

        <div className={styles.heroBar}>
          <Link
            href={backHref}
            aria-label="Back"
            className={styles.heroButton}
          >
            <ChevronLeftIcon className={styles.heroIcon} aria-hidden />
          </Link>
          <div className={styles.heroActions}>
            <button
              type="button"
              aria-label="Search"
              className={styles.heroButton}
            >
              <SearchIcon className={styles.heroIcon} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Cart"
              className={styles.heroButton}
            >
              <CartIcon className={styles.heroIcon} aria-hidden />
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        <div className={styles.heroFooter}>
          <span className={styles.heroChip}>
            <ClockIcon className={styles.heroChipIcon} aria-hidden />
            {restaurant.deliveryTime}
          </span>
          <span className={styles.heroChip}>
            <ScooterIcon className={styles.heroChipIcon} aria-hidden />
            {restaurant.deliveryPrice}
          </span>
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.avatarWrap}>
          {restaurant.logo ? (
            <Image
              src={restaurant.logo}
              alt={`${restaurant.name} logo`}
              className={styles.avatar}
            />
          ) : (
            <div
              className={styles.avatarLetter}
              style={
                restaurant.logoBackground
                  ? { background: restaurant.logoBackground }
                  : undefined
              }
              aria-hidden
            >
              {(restaurant.logoLetter ?? restaurant.name[0] ?? "").toUpperCase()}
            </div>
          )}
        </div>

        <h1 className={styles.name}>{restaurant.name}</h1>

        <p className={styles.rating}>
          <StarIcon className={styles.ratingIcon} aria-hidden />
          <strong>{ratingFormatted}</strong>
          <span className={styles.reviewsCount}>
            ({restaurant.reviewsCount})
          </span>
        </p>
      </header>

      <div className={styles.tabs} ref={tabsRef}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cx(
              styles.tab,
              activeTab === tab.id && styles.tabActive,
            )}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
            <span className={styles.tabUnderline} aria-hidden />
          </button>
        ))}
      </div>

      <div className={styles.sections}>
        <section
          id={ALL_TAB_ID}
          ref={(element) => {
            sectionRefs.current[ALL_TAB_ID] = element;
          }}
          aria-hidden
          className={styles.anchor}
        />

        {offerProducts.length > 0 && (
          <section
            id={OFFERS_TAB_ID}
            ref={(element) => {
              sectionRefs.current[OFFERS_TAB_ID] = element;
            }}
            className={styles.section}
          >
            <h2 className={styles.sectionTitle}>Offers</h2>
            <div className={styles.grid}>
              {offerProducts.map((product) => (
                <ProductCard
                  key={`offer-${product.id}`}
                  product={product}
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                />
              ))}
            </div>
          </section>
        )}

        {restaurant.categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            ref={(element) => {
              sectionRefs.current[category.id] = element;
            }}
            className={styles.section}
          >
            <h2 className={styles.sectionTitle}>{category.name}</h2>
            <div className={styles.grid}>
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                />
              ))}
            </div>
          </section>
        ))}

        <div className={styles.bottomSafe} />
      </div>
    </main>
  );
}
