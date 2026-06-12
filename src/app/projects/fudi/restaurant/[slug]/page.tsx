import { notFound } from "next/navigation";
import { RestaurantPage } from "../../components/RestaurantPage";
import {
  getRestaurantBySlug,
  listRestaurantSlugs,
} from "../../lib/restaurants";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listRestaurantSlugs().map((slug) => ({ slug }));
}

export default async function RestaurantSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  return <RestaurantPage restaurant={restaurant} />;
}
