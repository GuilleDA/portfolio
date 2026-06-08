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
  active?: boolean;
  href?: string;
};

const PRIMARY_ITEMS: NavItem[] = [
  { label: "Home", icon: HomeIcon, active: true },
  { label: "Orders", icon: BagIcon },
  { label: "Favorites", icon: HeartIcon },
  { label: "Promotions", icon: GiftIcon },
  { label: "Profile", icon: UserIcon },
];

const FOOTER_ITEMS: NavItem[] = [
  { label: "Settings", icon: SettingsIcon },
  { label: "Help", icon: HelpIcon },
];

export function DesktopSidebar() {
  return (
    <aside className={styles.root}>
      <nav className={styles.nav}>
        {PRIMARY_ITEMS.map((item) => (
          <SidebarLink key={item.label} item={item} />
        ))}
      </nav>

      <div className={styles.divider} />

      <nav className={styles.nav}>
        {FOOTER_ITEMS.map((item) => (
          <SidebarLink key={item.label} item={item} />
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

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      className={cx(styles.link, item.active && styles.linkActive)}
    >
      <Icon className={styles.linkIcon} aria-hidden />
      {item.label}
    </button>
  );
}
