import DiscountBadge50 from "../assets/discount_badge_50.svg";
import DashiSushiImage from "../assets/restaurant_dashiSushi.jpeg";
import KfcImage from "../assets/restaurant_kfc.png";
import type { Restaurant } from "../components/RestaurantPage";

export const RESTAURANTS: Record<string, Restaurant> = {
  vicio: {
    id: "vicio",
    name: "Vicio",
    image: KfcImage,
    imageAlt: "Vicio burger",
    logoLetter: "V",
    logoBackground: "#0d0d0d",
    rating: 4.5,
    reviewsCount: 134,
    deliveryTime: "30/40 min",
    deliveryPrice: "$10.50",
    categories: [
      {
        id: "classic-cheese",
        name: "Classic cheese burgers",
        products: [
          {
            id: "happy-combo",
            name: "Happy combo",
            price: 8.5,
            originalPrice: 17,
            discountBadge: { src: DiscountBadge50, alt: "50% Off" },
          },
          {
            id: "true-love-combo",
            name: "True love combo",
            price: 20,
            originalPrice: 25,
            discountLabel: "20% Off",
          },
          {
            id: "double-cheese",
            name: "Double cheese",
            price: 12.5,
          },
          {
            id: "smash-classic",
            name: "Smash classic",
            price: 11,
          },
        ],
      },
      {
        id: "chicken",
        name: "Chicken burgers",
        products: [
          {
            id: "spicy-chicken",
            name: "Spicy chicken",
            price: 13.5,
          },
          {
            id: "buffalo-chicken",
            name: "Buffalo chicken",
            price: 14,
          },
          {
            id: "chicken-deluxe",
            name: "Chicken deluxe",
            price: 9,
            originalPrice: 18,
            discountBadge: { src: DiscountBadge50, alt: "50% Off" },
          },
        ],
      },
      {
        id: "sides",
        name: "Sides",
        products: [
          {
            id: "fries",
            name: "Fries",
            price: 4,
          },
          {
            id: "onion-rings",
            name: "Onion rings",
            price: 5,
          },
          {
            id: "nuggets",
            name: "Chicken nuggets",
            price: 6.5,
          },
        ],
      },
      {
        id: "drinks",
        name: "Drinks",
        products: [
          {
            id: "coke",
            name: "Coca Cola",
            price: 3,
          },
          {
            id: "sprite",
            name: "Sprite",
            price: 3,
          },
          {
            id: "water",
            name: "Water",
            price: 2,
          },
        ],
      },
    ],
  },
  kfc: {
    id: "kfc",
    name: "KFC",
    image: KfcImage,
    imageAlt: "KFC bucket",
    logoLetter: "K",
    logoBackground: "#e4002b",
    rating: 4.5,
    reviewsCount: 240,
    deliveryTime: "30/40 min",
    deliveryPrice: "$345",
    categories: [
      {
        id: "buckets",
        name: "Buckets",
        products: [
          {
            id: "hot-spicy-bucket",
            name: "Hot & Spicy bucket",
            price: 18,
            originalPrice: 36,
            discountBadge: { src: DiscountBadge50, alt: "50% Off" },
          },
          {
            id: "family-bucket",
            name: "Family bucket",
            price: 26,
          },
        ],
      },
      {
        id: "burgers",
        name: "Burgers",
        products: [
          {
            id: "zinger",
            name: "Zinger burger",
            price: 7.5,
          },
          {
            id: "double-down",
            name: "Double Down",
            price: 8,
            originalPrice: 10,
            discountLabel: "20% Off",
          },
        ],
      },
    ],
  },
  "dashi-sushi": {
    id: "dashi-sushi",
    name: "Dashi Sushi",
    image: DashiSushiImage,
    imageAlt: "Sushi platter",
    logoLetter: "D",
    logoBackground: "#0f4a3d",
    rating: 4.7,
    reviewsCount: 88,
    deliveryTime: "20/30 min",
    deliveryPrice: "Free",
    categories: [
      {
        id: "rolls",
        name: "Rolls",
        products: [
          {
            id: "salmon-roll",
            name: "Salmon roll",
            price: 12,
          },
          {
            id: "avocado-roll",
            name: "Avocado roll",
            price: 8,
          },
        ],
      },
      {
        id: "combos",
        name: "Combos",
        products: [
          {
            id: "combo-30",
            name: "Combo 30 pcs",
            price: 24,
            originalPrice: 30,
            discountLabel: "20% Off",
          },
        ],
      },
    ],
  },
};

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return RESTAURANTS[slug];
}

export function listRestaurantSlugs(): string[] {
  return Object.keys(RESTAURANTS);
}
