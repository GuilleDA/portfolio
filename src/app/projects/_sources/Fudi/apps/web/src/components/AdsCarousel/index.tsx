import { AdCard, type AdTone } from "../AdCard";
import styles from "./styles.module.scss";

type Ad = {
  id: string;
  tone: AdTone;
  eyebrow: string;
  eyebrowSmall?: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  brand: string;
  emoji: string;
};

type AdsCarouselProps = {
  ads?: Ad[];
  heading?: string;
};

const DEFAULT_ADS: Ad[] = [
  {
    id: "papajohns",
    tone: "emerald",
    eyebrow: "Better Ingredients.",
    eyebrowSmall: "Better Pizza.",
    title: "BETTER",
    titleAccent: "GET YOU",
    subtitle: "SOME",
    brand: "PAPA JOHNS",
    emoji: "🍕",
  },
  {
    id: "sushi",
    tone: "rose",
    eyebrow: "Sushi Wednesdays",
    title: "50% OFF",
    titleAccent: "ALL ROLLS",
    subtitle: "EVERY WED",
    brand: "SUSHI CLUB",
    emoji: "🍣",
  },
  {
    id: "welcome",
    tone: "amber",
    eyebrow: "New on Fudi",
    title: "FREE",
    titleAccent: "DELIVERY",
    subtitle: "FIRST ORDER",
    brand: "WELCOME",
    emoji: "🛵",
  },
];

export function AdsCarousel({
  ads = DEFAULT_ADS,
  heading = "Featured Deals",
}: AdsCarouselProps) {
  return (
    <section className={styles.root}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.list}>
        {ads.map((ad) => (
          <AdCard key={ad.id} {...ad} />
        ))}
      </div>
    </section>
  );
}
