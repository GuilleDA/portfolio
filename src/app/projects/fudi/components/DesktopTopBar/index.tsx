import { CartIcon, ChevronDown, PinIcon, SearchIcon } from "../icons";
import { IconButton } from "../IconButton";
import { Logo } from "../Logo";
import styles from "./styles.module.scss";

type DesktopTopBarProps = {
  address: string;
  cartCount?: number;
  userInitials?: string;
};

export function DesktopTopBar({
  address,
  cartCount = 0,
  userInitials = "JD",
}: DesktopTopBarProps) {
  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Logo size="md" />

        <button type="button" className={styles.addressButton}>
          <PinIcon className={styles.pin} aria-hidden />
          <span className={styles.addressText}>
            <span className={styles.deliverTo}>Deliver to</span>
            <span className={styles.addressLabel}>
              {address}
              <ChevronDown className={styles.chevron} aria-hidden />
            </span>
          </span>
        </button>

        <label className={styles.search}>
          <SearchIcon className={styles.searchIcon} aria-hidden />
          <input
            type="text"
            placeholder="What's on your mind?"
            className={styles.searchInput}
            aria-label="Search"
          />
        </label>

        <div className={styles.actions}>
          <IconButton label="Cart" badge={cartCount}>
            <CartIcon />
          </IconButton>
          <button
            type="button"
            aria-label="Profile"
            className={styles.avatar}
          >
            {userInitials}
          </button>
        </div>
      </div>
    </header>
  );
}
