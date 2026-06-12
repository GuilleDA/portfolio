import Image from "next/image";
import Link from "next/link";
import LogoIcon from "../../../../../../public/projects/fudi/logo.png";
import styles from "./styles.module.scss";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  href?: string;
};

export function Logo({ size = "md", href = "/" }: LogoProps) {
  return (
    <Link href={href} aria-label="Fudi" className={styles.root}>
      <Image
        src={LogoIcon}
        alt="Fudi"
        width={156}
        height={100}
        priority
        className={`${styles.image} ${styles[size]}`}
      />
    </Link>
  );
}
