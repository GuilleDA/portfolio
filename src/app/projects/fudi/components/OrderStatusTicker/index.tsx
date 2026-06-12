"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { advanceOrdersAtom } from "../../atoms/orders";

const TICK_MS = 30_000;

export function OrderStatusTicker() {
  const advance = useSetAtom(advanceOrdersAtom);

  useEffect(() => {
    const interval = window.setInterval(() => {
      advance();
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, [advance]);

  return null;
}
