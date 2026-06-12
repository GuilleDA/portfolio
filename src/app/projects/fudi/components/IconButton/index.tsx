import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./styles.module.scss";

type IconButtonProps = {
  children: ReactNode;
  label: string;
  badge?: number | string;
  variant?: "ghost" | "filled";
  href?: string;
  onClick?: () => void;
};

export function IconButton({
  children,
  label,
  badge,
  variant = "ghost",
  href,
  onClick,
}: IconButtonProps) {
  const className = cx(styles.root, styles[variant]);

  const content = (
    <>
      {children}
      {badge !== undefined && badge !== 0 && (
        <span className={styles.badge}>{badge}</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
}
