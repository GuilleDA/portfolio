import { BagIcon, ChefIcon, DoorIcon, ScooterIcon } from "../icons";
import { cx } from "../../lib/cx";
import styles from "./styles.module.scss";

export type OrderStep = 0 | 1 | 2 | 3;

type OrderCardProps = {
  restaurant: string;
  orderLabel: string;
  status: string;
  eta: string;
  activeStep: OrderStep;
};

const STEPS = [
  { icon: BagIcon, label: "Received" },
  { icon: ChefIcon, label: "Cooking" },
  { icon: ScooterIcon, label: "On the way" },
  { icon: DoorIcon, label: "Delivered" },
] as const;

export function OrderCard({
  restaurant,
  orderLabel,
  status,
  eta,
  activeStep,
}: OrderCardProps) {
  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.restaurant}>{restaurant}</h3>
        <span className={styles.orderLabel}>{orderLabel}</span>
      </header>

      <div className={styles.tracker}>
        <div className={styles.trackerLine} aria-hidden />
        <ul className={styles.steps}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeStep;
            const isDone = i < activeStep;
            return (
              <li key={step.label} className={styles.step}>
                {isActive && <span className={styles.pulse} aria-hidden />}
                <span
                  className={cx(
                    styles.stepCircle,
                    isActive && styles.stepActive,
                    isDone && styles.stepDone,
                  )}
                  aria-label={step.label}
                >
                  <Icon className={styles.stepIcon} aria-hidden />
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className={styles.status}>{status}</p>
      <p className={styles.eta}>{eta}</p>
    </article>
  );
}
