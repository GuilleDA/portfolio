import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { CartRestaurantGroup } from "./cart";

export type OrderStatus = 0 | 1 | 2 | 3;

export const ORDER_STATUS_LABELS = [
  "Order received",
  "Cooking your meal right now",
  "Your order is on its way",
  "Delivered",
] as const;

export const ORDER_STATUS_TITLES = [
  "Your order has been received.",
  "Your chef is working some magic right now.",
  "Your order is on its way.",
  "Your order has arrived!",
] as const;

export const ORDER_STATUS_SUBTITLES = [
  "Estimated Delivery: today 8:30 - 9:45 pm",
  "Estimated Delivery: today 8:30 - 9:45 pm",
  "Arriving in 10 - 15 minutes",
  "Enjoy your meal — buen provecho!",
] as const;

export const ORDER_DRIVER_INFO = [
  "Driver info will appear here soon.",
  "Driver info will appear here soon.",
  "Carlos · Honda CG 150 · License ABC-1234",
  "Delivered by Carlos.",
] as const;

export type ActiveOrderItem = {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageSrc?: string;
  quantity: number;
};

export type OrderRestaurant = {
  restaurantId: string;
  restaurantName: string;
  restaurantLogoLetter?: string;
  restaurantLogoBackground?: string;
  restaurantLogoColor?: string;
  restaurantDeliveryTime?: string;
  restaurantDeliveryFee?: number;
  restaurantDeliveryLabel?: string;
  items: ActiveOrderItem[];
};

export type ActiveOrder = {
  id: string;
  createdAt: number;
  status: OrderStatus;
  restaurants: OrderRestaurant[];
};

const STORAGE_KEY = "fudi:orders:v2";

export const ordersAtom = atomWithStorage<ActiveOrder[]>(STORAGE_KEY, []);

export const activeOrdersAtom = atom((get) =>
  get(ordersAtom)
    .filter((order) => order.status < 3)
    .sort((a, b) => b.createdAt - a.createdAt),
);

export const ordersHistoryAtom = atom((get) =>
  [...get(ordersAtom)].sort((a, b) => b.createdAt - a.createdAt),
);

export const latestActiveOrderAtom = atom((get) => {
  const orders = get(activeOrdersAtom);
  return orders[0];
});

function groupToRestaurant(group: CartRestaurantGroup): OrderRestaurant {
  return {
    restaurantId: group.restaurantId,
    restaurantName: group.restaurantName,
    restaurantLogoLetter: group.restaurantLogoLetter,
    restaurantLogoBackground: group.restaurantLogoBackground,
    restaurantLogoColor: group.restaurantLogoColor,
    restaurantDeliveryTime: group.restaurantDeliveryTime,
    restaurantDeliveryFee: group.restaurantDeliveryFee,
    restaurantDeliveryLabel: group.restaurantDeliveryLabel,
    items: group.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      imageSrc:
        typeof item.image === "string" ? item.image : item.image?.src,
      quantity: item.quantity,
    })),
  };
}

export const placeOrderAtom = atom(
  null,
  (get, set, groups: CartRestaurantGroup[]) => {
    if (groups.length === 0) return;
    const createdAt = Date.now();
    const order: ActiveOrder = {
      id: `${createdAt}`,
      createdAt,
      status: 0,
      restaurants: groups.map(groupToRestaurant),
    };
    set(ordersAtom, [...get(ordersAtom), order]);
  },
);

export const advanceOrdersAtom = atom(null, (get, set) => {
  const current = get(ordersAtom);
  let changed = false;
  const next = current.map((order) => {
    if (order.status < 3) {
      changed = true;
      return { ...order, status: (order.status + 1) as OrderStatus };
    }
    return order;
  });
  if (changed) set(ordersAtom, next);
});

export const removeOrderAtom = atom(null, (get, set, orderId: string) => {
  set(
    ordersAtom,
    get(ordersAtom).filter((order) => order.id !== orderId),
  );
});

export const clearDeliveredOrdersAtom = atom(null, (get, set) => {
  set(
    ordersAtom,
    get(ordersAtom).filter((order) => order.status < 3),
  );
});

export const clearOrdersAtom = atom(null, (_get, set) => {
  set(ordersAtom, []);
});

export function restaurantProductsCount(restaurant: OrderRestaurant): number {
  return restaurant.items.reduce((acc, item) => acc + item.quantity, 0);
}

export function restaurantSubtotal(restaurant: OrderRestaurant): number {
  return restaurant.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
}

export function orderProductsCount(order: ActiveOrder): number {
  return order.restaurants.reduce(
    (acc, restaurant) => acc + restaurantProductsCount(restaurant),
    0,
  );
}

export function orderSubtotal(order: ActiveOrder): number {
  return order.restaurants.reduce(
    (acc, restaurant) => acc + restaurantSubtotal(restaurant),
    0,
  );
}

export function orderShippingFees(order: ActiveOrder): number {
  return order.restaurants.reduce(
    (acc, restaurant) => acc + (restaurant.restaurantDeliveryFee ?? 0),
    0,
  );
}

export function orderTotal(order: ActiveOrder): number {
  return orderSubtotal(order) + orderShippingFees(order);
}

export function shortOrderId(orderId: string): string {
  const numeric = Number(orderId);
  if (Number.isFinite(numeric)) {
    return String(1000 + (numeric % 9000));
  }
  let hash = 0;
  for (let i = 0; i < orderId.length; i += 1) {
    hash = (hash * 31 + orderId.charCodeAt(i)) | 0;
  }
  return String(1000 + (Math.abs(hash) % 9000));
}
