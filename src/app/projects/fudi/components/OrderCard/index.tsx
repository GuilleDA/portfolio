import type { FC, SVGProps } from "react";
import OrderStep1 from "../../assets/order_step1.svg";
import OrderStep2 from "../../assets/order_step2.svg";
import OrderStep3 from "../../assets/order_step3.svg";
import OrderStep4 from "../../assets/order_step4.svg";
import styles from "./styles.module.scss";

export type OrderStep = 0 | 1 | 2 | 3;

type OrderCardProps = {
  restaurant: string;
  orderLabel: string;
  status: string;
  eta: string;
  activeStep: OrderStep;
};

const STEP_TRACKERS: {
  icon: FC<SVGProps<SVGSVGElement>>;
  label: string;
}[] = [
  { icon: OrderStep1, label: "Received" },
  { icon: OrderStep2, label: "Cooking" },
  { icon: OrderStep3, label: "On the way" },
  { icon: OrderStep4, label: "Delivered" },
];

export function OrderCard({
  restaurant,
  orderLabel,
  status,
  eta,
  activeStep,
}: OrderCardProps) {
  const tracker = STEP_TRACKERS[activeStep];
  const TrackerIcon = tracker.icon;

  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.restaurant}>{restaurant}</h3>
        <span className={styles.orderLabel}>{orderLabel}</span>
      </header>

      <div className={styles.tracker}>
        <TrackerIcon
          className={styles.trackerImage}
          role="img"
          aria-label={`Order status: ${tracker.label}`}
        />
      </div>

      <p className={styles.status}>{status}</p>
      <p className={styles.eta}>{eta}</p>
    </article>
  );
}
