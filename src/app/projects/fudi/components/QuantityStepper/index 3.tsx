"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "../icons";
import { cx } from "../../lib/cx";
import styles from "./styles.module.scss";

type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  ariaLabel?: string;
  variant?: "dark" | "light";
};

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  ariaLabel = "Quantity",
  variant = "dark",
}: QuantityStepperProps) {
  const isMinimum = quantity <= 1;

  return (
    <div
      className={cx(styles.root, styles[variant])}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={styles.button}
        onClick={onDecrement}
        aria-label={isMinimum ? "Remove from cart" : "Decrease quantity"}
      >
        {isMinimum ? (
          <TrashIcon className={styles.icon} aria-hidden />
        ) : (
          <MinusIcon className={styles.icon} aria-hidden />
        )}
      </button>

      <span className={styles.count} aria-live="polite">
        {quantity}
      </span>

      <button
        type="button"
        className={styles.button}
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        <PlusIcon className={styles.icon} aria-hidden />
      </button>
    </div>
  );
}
