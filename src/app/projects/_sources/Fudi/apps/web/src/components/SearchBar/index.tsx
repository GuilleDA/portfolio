import { SearchIcon } from "../icons";
import styles from "./styles.module.scss";

type SearchBarProps = {
  placeholder?: string;
  iconPosition?: "leading" | "trailing";
};

export function SearchBar({
  placeholder = "What's on your mind?",
  iconPosition = "trailing",
}: SearchBarProps) {
  return (
    <div className={styles.root}>
      {iconPosition === "leading" && (
        <SearchIcon className={styles.icon} aria-hidden />
      )}
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        aria-label="Search"
      />
      {iconPosition === "trailing" && (
        <SearchIcon className={styles.icon} aria-hidden />
      )}
    </div>
  );
}
