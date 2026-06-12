"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import {
  BagIcon,
  GiftIcon,
  HeartIcon,
  HelpIcon,
  HomeIcon,
  SettingsIcon,
  UserIcon,
} from "../icons";
import { cx } from "../../lib/cx";
import styles from "./styles.module.scss";

type NavItem = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
};

const PRIMARY_ITEMS: NavItem[] = [
  { label: "Home", icon: HomeIcon, href: "/projects/fudi" },
  { label: "Orders", icon: BagIcon, href: "/projects/fudi/orders" },
  { label: "Favorites", icon: HeartIcon },
  { label: "Promotions", icon: GiftIcon },
  { label: "Profile", icon: UserIcon },
];

const FOOTER_ITEMS: NavItem[] = [
  { label: "Settings", icon: SettingsIcon },
  { label: "Help", icon: HelpIcon },
];

function isActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  if (href === "/projects/fudi") return pathname === "/projects/fudi";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopSidebar() {
  const pathname = usePathname() ?? "/projects/fudi";

  return (
    <aside className={styles.root}>
      <nav className={styles.nav}>
        {PRIMARY_ITEMS.map((item) => (
          <SidebarLink
            key={item.label}
            item={item}
            active={isActive(pathname, item.href)}
          />
        ))}
      </nav>

      <div className={styles.divider} />

      <nav className={styles.nav}>
        {FOOTER_ITEMS.map((item) => (
          <SidebarLink
            key={item.label}
            item={item}
            active={isActive(pathname, item.href)}
          />
        ))}
      </nav>

      <div className={styles.promo}>
        <p className={styles.promoTitle}>Get 30% off your next order</p>
        <p className={styles.promoSubtitle}>With Fudi Plus membership</p>
        <button type="button" className={styles.promoCta}>
          Try free
        </button>
      </div>
    </aside>
  );
}

type SidebarLinkProps = {
  item: NavItem;
  active: boolean;
};

function SidebarLink({ item, active }: SidebarLinkProps) {
  const Icon = item.icon;
  const className = cx(styles.link, active && styles.linkActive);

  if (item.href) {
    return (
      <Link href={item.href} className={className}>
        <Icon className={styles.linkIcon} aria-hidden />
        {item.label}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      <Icon className={styles.linkIcon} aria-hidden />
      {item.label}
    </button>
  );
}
