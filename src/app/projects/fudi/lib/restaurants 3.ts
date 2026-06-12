import type { StaticImageData } from "next/image";
import DiscountBadge50 from "../assets/discount_badge_50.svg";
import DashiSushiImage from "../assets/restaurant_dashiSushi.jpeg";
import KfcImage from "../assets/restaurant_kfc.png";
import type { Restaurant } from "../components/RestaurantPage";

export type RestaurantSummary = {
  id: string;
  name: string;
  image?: StaticImageData;
  imageAlt?: string;
  emoji?: string;
  rating: number;
  deliveryTime: string;
  deliveryPrice: string;
  tags: string[];
  hasDiscount?: boolean;
};

export const RESTAURANTS: Record<string, Restaurant> = {
  vicio: {
    id: "vicio",
    name: "Vicio",
    image: KfcImage,
    imageAlt: "Vicio burger",
    emoji: "🍔",
    logoLetter: "V",
    logoBackground: "#0d0d0d",
    rating: 4.5,
    reviewsCount: 134,
    deliveryTime: "30/40 min",
    deliveryPrice: "$10.50",
    tags: ["Burgers"],
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
          { id: "fries", name: "Fries", price: 4 },
          { id: "onion-rings", name: "Onion rings", price: 5 },
          { id: "nuggets", name: "Chicken nuggets", price: 6.5 },
        ],
      },
      {
        id: "drinks",
        name: "Drinks",
        products: [
          { id: "coke", name: "Coca Cola", price: 3 },
          { id: "sprite", name: "Sprite", price: 3 },
          { id: "water", name: "Water", price: 2 },
        ],
      },
    ],
  },
  kfc: {
    id: "kfc",
    name: "KFC",
    image: KfcImage,
    imageAlt: "KFC bucket",
    emoji: "🍗",
    logoLetter: "K",
    logoBackground: "#e4002b",
    rating: 4.5,
    reviewsCount: 240,
    deliveryTime: "30/40 min",
    deliveryPrice: "$345",
    tags: ["Burgers"],
    hasDiscount: true,
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
          { id: "family-bucket", name: "Family bucket", price: 26 },
        ],
      },
      {
        id: "burgers",
        name: "Burgers",
        products: [
          { id: "zinger", name: "Zinger burger", price: 7.5 },
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
    emoji: "🍣",
    logoLetter: "D",
    logoBackground: "#0f4a3d",
    rating: 4.7,
    reviewsCount: 88,
    deliveryTime: "20/30 min",
    deliveryPrice: "Free",
    tags: ["Sushi", "Asian"],
    categories: [
      {
        id: "rolls",
        name: "Rolls",
        products: [
          { id: "salmon-roll", name: "Salmon roll", price: 12 },
          { id: "avocado-roll", name: "Avocado roll", price: 8 },
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
  "burger-bros": {
    id: "burger-bros",
    name: "Burger Bros",
    emoji: "🍔",
    logoLetter: "B",
    logoBackground: "#c4252a",
    rating: 4.3,
    reviewsCount: 56,
    deliveryTime: "25/35 min",
    deliveryPrice: "$280",
    tags: ["Burgers"],
    categories: [
      {
        id: "burgers",
        name: "Burgers",
        products: [
          { id: "classic-burger", name: "Classic burger", price: 9 },
          { id: "bacon-burger", name: "Bacon burger", price: 11 },
          {
            id: "double-bro",
            name: "Double Bro",
            price: 12,
            originalPrice: 15,
            discountLabel: "20% Off",
          },
        ],
      },
      {
        id: "sides",
        name: "Sides",
        products: [
          { id: "fries", name: "Fries", price: 4 },
          { id: "loaded-fries", name: "Loaded fries", price: 6 },
        ],
      },
    ],
  },
  "tokyo-bowl": {
    id: "tokyo-bowl",
    name: "Tokyo Bowl",
    emoji: "🍜",
    logoLetter: "T",
    logoBackground: "#1f2937",
    rating: 4.4,
    reviewsCount: 78,
    deliveryTime: "30/40 min",
    deliveryPrice: "$310",
    tags: ["Asian"],
    categories: [
      {
        id: "ramen",
        name: "Ramen",
        products: [
          { id: "tonkotsu", name: "Tonkotsu ramen", price: 14 },
          { id: "spicy-miso", name: "Spicy miso ramen", price: 15 },
        ],
      },
      {
        id: "rice",
        name: "Rice bowls",
        products: [
          { id: "katsu", name: "Chicken katsu bowl", price: 13 },
          { id: "teriyaki", name: "Teriyaki bowl", price: 12 },
        ],
      },
    ],
  },
  "green-garden": {
    id: "green-garden",
    name: "Green Garden",
    emoji: "🥗",
    logoLetter: "G",
    logoBackground: "#14532d",
    rating: 4.6,
    reviewsCount: 41,
    deliveryTime: "20/30 min",
    deliveryPrice: "Free",
    tags: ["Healthy"],
    categories: [
      {
        id: "salads",
        name: "Salads",
        products: [
          { id: "caesar", name: "Caesar salad", price: 10 },
          { id: "quinoa", name: "Quinoa bowl", price: 11 },
        ],
      },
      {
        id: "bowls",
        name: "Power bowls",
        products: [
          { id: "buddha", name: "Buddha bowl", price: 12 },
          { id: "poke", name: "Poke bowl", price: 13 },
        ],
      },
    ],
  },
  "sweet-spot": {
    id: "sweet-spot",
    name: "Sweet Spot",
    emoji: "🍦",
    logoLetter: "S",
    logoBackground: "#ec4899",
    rating: 4.8,
    reviewsCount: 112,
    deliveryTime: "15/25 min",
    deliveryPrice: "$240",
    tags: ["Desserts"],
    categories: [
      {
        id: "ice-cream",
        name: "Ice cream",
        products: [
          { id: "vanilla", name: "Vanilla scoop", price: 4 },
          { id: "chocolate", name: "Chocolate scoop", price: 4 },
          { id: "sundae", name: "Brownie sundae", price: 7 },
        ],
      },
      {
        id: "cakes",
        name: "Cakes",
        products: [
          { id: "cheesecake", name: "Cheesecake slice", price: 6 },
          { id: "tiramisu", name: "Tiramisu", price: 6.5 },
        ],
      },
    ],
  },
  "papa-johns": {
    id: "papa-johns",
    name: "Papa Johns",
    emoji: "🍕",
    logoLetter: "P",
    logoBackground: "#16a34a",
    rating: 4.2,
    reviewsCount: 187,
    deliveryTime: "35/45 min",
    deliveryPrice: "$420",
    tags: ["Pizza"],
    categories: [
      {
        id: "classic",
        name: "Classic pizzas",
        products: [
          { id: "margherita", name: "Margherita", price: 12 },
          { id: "pepperoni", name: "Pepperoni", price: 14 },
          {
            id: "four-cheese",
            name: "Four cheese",
            price: 13,
            originalPrice: 18,
            discountLabel: "30% Off",
          },
        ],
      },
      {
        id: "specials",
        name: "Specials",
        products: [
          { id: "bbq-chicken", name: "BBQ chicken", price: 16 },
          { id: "veggie", name: "Veggie supreme", price: 15 },
        ],
      },
    ],
  },
  "bean-co": {
    id: "bean-co",
    name: "Bean & Co",
    emoji: "☕",
    logoLetter: "B",
    logoBackground: "#78350f",
    rating: 4.5,
    reviewsCount: 64,
    deliveryTime: "10/20 min",
    deliveryPrice: "Free",
    tags: ["Coffee", "Drinks"],
    categories: [
      {
        id: "coffee",
        name: "Coffee",
        products: [
          { id: "espresso", name: "Espresso", price: 3 },
          { id: "latte", name: "Latte", price: 4 },
          { id: "cappuccino", name: "Cappuccino", price: 4 },
        ],
      },
      {
        id: "bakery",
        name: "Bakery",
        products: [
          { id: "croissant", name: "Croissant", price: 3.5 },
          { id: "muffin", name: "Blueberry muffin", price: 3 },
        ],
      },
    ],
  },
};

function toSummary(restaurant: Restaurant): RestaurantSummary {
  return {
    id: restaurant.id,
    name: restaurant.name,
    image: restaurant.image,
    imageAlt: restaurant.imageAlt,
    emoji: restaurant.emoji,
    rating: restaurant.rating,
    deliveryTime: restaurant.deliveryTime,
    deliveryPrice: restaurant.deliveryPrice,
    tags: restaurant.tags,
    hasDiscount: restaurant.hasDiscount,
  };
}

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return RESTAURANTS[slug];
}

export function listRestaurantSlugs(): string[] {
  return Object.keys(RESTAURANTS);
}

export function listRestaurantSummaries(): RestaurantSummary[] {
  return Object.values(RESTAURANTS).map(toSummary);
}

export function listRestaurantsByCategory(
  category: string,
): RestaurantSummary[] {
  const normalized = category.trim().toLowerCase();
  return Object.values(RESTAURANTS)
    .filter((restaurant) =>
      restaurant.tags.some((tag) => tag.toLowerCase() === normalized),
    )
    .map(toSummary);
}
