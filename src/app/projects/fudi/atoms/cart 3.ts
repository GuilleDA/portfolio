import type { StaticImageData } from "next/image";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type CartItem = {
  id: string;
  productId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogoLetter?: string;
  restaurantLogoBackground?: string;
  restaurantLogoColor?: string;
  restaurantDeliveryTime?: string;
  restaurantDeliveryFee?: number;
  restaurantDeliveryLabel?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: StaticImageData | string;
  quantity: number;
};

type StoredCartItem = Omit<CartItem, "image"> & {
  image?: string;
};

type StoredCart = {
  items: StoredCartItem[];
};

const STORAGE_KEY = "fudi:cart:v1";

const initialCart: StoredCart = { items: [] };

const storedCartAtom = atomWithStorage<StoredCart>(STORAGE_KEY, initialCart);

function toStored(item: CartItem): StoredCartItem {
  const { image, ...rest } = item;
  return {
    ...rest,
    image: typeof image === "string" ? image : image?.src,
  };
}

function buildId(restaurantId: string, productId: string) {
  return `${restaurantId}:${productId}`;
}

export const cartItemsAtom = atom<CartItem[]>(
  (get) => get(storedCartAtom).items as CartItem[],
);

export const cartItemCountAtom = atom((get) =>
  get(cartItemsAtom).reduce((acc, item) => acc + item.quantity, 0),
);

export const cartProductsSubtotalAtom = atom((get) =>
  get(cartItemsAtom).reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  ),
);

export const cartProductsOriginalAtom = atom((get) =>
  get(cartItemsAtom).reduce(
    (acc, item) =>
      acc + item.quantity * (item.originalPrice ?? item.price),
    0,
  ),
);

export type CartRestaurantGroup = {
  restaurantId: string;
  restaurantName: string;
  restaurantLogoLetter?: string;
  restaurantLogoBackground?: string;
  restaurantLogoColor?: string;
  restaurantDeliveryTime?: string;
  restaurantDeliveryFee?: number;
  restaurantDeliveryLabel?: string;
  items: CartItem[];
};

export const cartByRestaurantAtom = atom<CartRestaurantGroup[]>((get) => {
  const groups = new Map<string, CartRestaurantGroup>();

  for (const item of get(cartItemsAtom)) {
    const group = groups.get(item.restaurantId);
    if (group) {
      group.items.push(item);
    } else {
      groups.set(item.restaurantId, {
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        restaurantLogoLetter: item.restaurantLogoLetter,
        restaurantLogoBackground: item.restaurantLogoBackground,
        restaurantLogoColor: item.restaurantLogoColor,
        restaurantDeliveryTime: item.restaurantDeliveryTime,
        restaurantDeliveryFee: item.restaurantDeliveryFee,
        restaurantDeliveryLabel: item.restaurantDeliveryLabel,
        items: [item],
      });
    }
  }

  return [...groups.values()];
});

type AddItemPayload = Omit<CartItem, "id" | "quantity"> & {
  quantity?: number;
};

export const addItemAtom = atom(null, (get, set, payload: AddItemPayload) => {
  const id = buildId(payload.restaurantId, payload.productId);
  const items = get(storedCartAtom).items;
  const existing = items.find((item) => item.id === id);
  const quantityToAdd = payload.quantity ?? 1;

  const nextItems = existing
    ? items.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item,
      )
    : [
        ...items,
        toStored({
          ...payload,
          id,
          quantity: quantityToAdd,
        }),
      ];

  set(storedCartAtom, { items: nextItems });
});

export const setItemQuantityAtom = atom(
  null,
  (
    get,
    set,
    payload: {
      restaurantId: string;
      productId: string;
      quantity: number;
    },
  ) => {
    const id = buildId(payload.restaurantId, payload.productId);
    const items = get(storedCartAtom).items;

    const nextItems =
      payload.quantity <= 0
        ? items.filter((item) => item.id !== id)
        : items.map((item) =>
            item.id === id ? { ...item, quantity: payload.quantity } : item,
          );

    set(storedCartAtom, { items: nextItems });
  },
);

export const removeItemAtom = atom(
  null,
  (
    get,
    set,
    payload: { restaurantId: string; productId: string },
  ) => {
    const id = buildId(payload.restaurantId, payload.productId);
    const items = get(storedCartAtom).items;
    set(storedCartAtom, {
      items: items.filter((item) => item.id !== id),
    });
  },
);

export const removeRestaurantAtom = atom(
  null,
  (get, set, restaurantId: string) => {
    const items = get(storedCartAtom).items;
    set(storedCartAtom, {
      items: items.filter((item) => item.restaurantId !== restaurantId),
    });
  },
);

export const clearCartAtom = atom(null, (_get, set) => {
  set(storedCartAtom, { items: [] });
});

export function selectCartItem(
  items: CartItem[],
  restaurantId: string,
  productId: string,
): CartItem | undefined {
  const id = buildId(restaurantId, productId);
  return items.find((item) => item.id === id);
}

export function parseDeliveryFee(value?: string): number {
  if (!value) return 0;
  const normalized = value.trim().toLowerCase();
  if (normalized === "free" || normalized === "") return 0;
  const numeric = parseFloat(normalized.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

export function formatCurrency(value: number): string {
  if (value === 0) return "Free";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
