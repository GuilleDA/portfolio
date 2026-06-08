import { CartIcon, ChevronDown } from "../icons";
import { IconButton } from "../IconButton";
import styles from "./styles.module.scss";

type AddressBarProps = {
  address: string;
  label: string;
  cartCount?: number;
};

export function AddressBar({ address, label, cartCount = 0 }: AddressBarProps) {
  return (
    <header className={styles.root}>
      <div className={styles.info}>
        <p className={styles.address}>{address}</p>
        <button type="button" className={styles.label}>
          {label}
          <ChevronDown className={styles.chevron} aria-hidden />
        </button>
      </div>
      <IconButton label="Cart" badge={cartCount}>
        <CartIcon />
      </IconButton>
    </header>
  );
}
