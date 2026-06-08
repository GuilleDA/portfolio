import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./styles.module.scss";

type IconButtonProps = {
  children: ReactNode;
  label: string;
  badge?: number | string;
  variant?: "ghost" | "filled";
  onClick?: () => void;
};

export function IconButton({
  children,
  label,
  badge,
  variant = "ghost",
  onClick,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cx(styles.root, styles[variant])}
    >
      {children}
      {badge !== undefined && badge !== 0 && (
        <span className={styles.badge}>{badge}</span>
      )}
    </button>
  );
}
