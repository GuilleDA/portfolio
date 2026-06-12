import type { FC, SVGProps } from "react";
import CategoryAsian from "../assets/category_asian.svg";
import CategoryBurger from "../assets/category_burger.svg";
import CategoryDessert from "../assets/category_dessert.svg";
import CategoryHealthy from "../assets/category_healthy.svg";
import CategoryPizza from "../assets/category_pizza.svg";

export type CategoryItem = {
  label: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
  emoji?: string;
};

export const CATEGORIES: CategoryItem[] = [
  { label: "Asian", icon: CategoryAsian },
  { label: "Pizza", icon: CategoryPizza },
  { label: "Burgers", icon: CategoryBurger },
  { label: "Healthy", icon: CategoryHealthy },
  { label: "Desserts", icon: CategoryDessert },
  { label: "Pasta", emoji: "🍝" },
  { label: "Sushi", emoji: "🍣" },
  { label: "Drinks", emoji: "🥤" },
  { label: "Coffee", emoji: "☕" },
];

export function findCategoryByLabel(label: string): CategoryItem | undefined {
  const normalized = label.trim().toLowerCase();
  return CATEGORIES.find((c) => c.label.toLowerCase() === normalized);
}
