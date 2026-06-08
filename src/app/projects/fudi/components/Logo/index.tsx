import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";

const LogoIcon = "/projects/fudi/logo.png";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  href?: string;
};

export function Logo({ size = "md", href = "/projects/fudi" }: LogoProps) {
  return (
    <Link href={href} aria-label="Fudi" className={styles.root}>
      <Image
        src={LogoIcon}
        alt="Fudi"
        width={320}
        height={213}
        priority
        className={`${styles.image} ${styles[size]}`}
      />
    </Link>
  );
}
