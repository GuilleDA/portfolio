"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import BrazilianFlavourOffer from "../../assets/offer_brazilianFlavour.webp";
import KfcOffer from "../../assets/offer_kfc.jpg";
import PapaJohnsOffer from "../../assets/offer_papajohns.jpg";
import styles from "./styles.module.scss";

type Ad = {
  id: string;
  image: StaticImageData;
  alt: string;
};

type AdsCarouselProps = {
  ads?: Ad[];
  heading?: string;
};

const DEFAULT_ADS: Ad[] = [
  {
    id: "kfc",
    image: KfcOffer,
    alt: "KFC Hot and Spicy offer",
  },
  {
    id: "papajohns",
    image: PapaJohnsOffer,
    alt: "Papa Johns Better Ingredients Better Pizza offer",
  },
  {
    id: "brazilian-flavour",
    image: BrazilianFlavourOffer,
    alt: "Brazilian Flavour offer",
  },
];

export function AdsCarousel({
  ads = DEFAULT_ADS,
  heading = "Featured Deals",
}: AdsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.min(1, ads.length - 1));
  const [isPaused, setIsPaused] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const resumeTimeoutRef = useRef<number | null>(null);
  const autoScrollTimeoutRef = useRef<number | null>(null);
  const isAutoScrollingRef = useRef(false);

  useEffect(() => {
    setActiveIndex(Math.min(1, ads.length - 1));
  }, [ads.length]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }

      if (autoScrollTimeoutRef.current) {
        window.clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;
    if (ads.length <= 1) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % ads.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [ads.length, isPaused]);

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    if (isPaused) return;

    isAutoScrollingRef.current = true;
    cardRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    if (autoScrollTimeoutRef.current) {
      window.clearTimeout(autoScrollTimeoutRef.current);
    }

    autoScrollTimeoutRef.current = window.setTimeout(() => {
      isAutoScrollingRef.current = false;
      autoScrollTimeoutRef.current = null;
    }, 700);
  }, [activeIndex, isPaused]);

  function isDesktopViewport() {
    return window.matchMedia("(min-width: 1024px)").matches;
  }

  function pauseCarousel() {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    setIsPaused(true);
  }

  function resumeCarousel(delay = 0) {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsPaused(false);
      resumeTimeoutRef.current = null;
    }, delay);
  }

  function updateActiveFromScroll() {
    const list = listRef.current;
    if (!list) return;
    if (isDesktopViewport()) return;
    if (isAutoScrollingRef.current) return;

    const listRect = list.getBoundingClientRect();
    const listCenter = listRect.left + listRect.width / 2;

    const closestIndex = cardRefs.current.reduce((closest, card, index) => {
      if (!card) return closest;

      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - listCenter);

      return distance < closest.distance ? { index, distance } : closest;
    }, { index: activeIndex, distance: Number.POSITIVE_INFINITY }).index;

    setActiveIndex((current) =>
      current === closestIndex ? current : closestIndex,
    );
  }

  function activateDesktopCard(index: number) {
    if (!isDesktopViewport()) return;

    setActiveIndex(index);
  }

  return (
    <section className={styles.root}>
      <h2 className={styles.heading}>{heading}</h2>
      <div
        ref={listRef}
        className={styles.list}
        onMouseEnter={() => {
          if (isDesktopViewport()) pauseCarousel();
        }}
        onMouseLeave={() => {
          if (isDesktopViewport()) resumeCarousel();
        }}
        onPointerDown={pauseCarousel}
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse") resumeCarousel(1200);
        }}
        onPointerCancel={() => resumeCarousel(1200)}
        onScroll={updateActiveFromScroll}
      >
        {ads.map((ad, index) => (
          <article
            key={ad.id}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className={`${styles.card} ${
              index === activeIndex ? styles.cardActive : ""
            }`}
            onMouseEnter={() => activateDesktopCard(index)}
          >
            <Image
              src={ad.image}
              alt={ad.alt}
              className={styles.image}
              priority={index === 0}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
