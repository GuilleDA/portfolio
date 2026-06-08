import { OrderCard, type OrderStep } from "../OrderCard";
import styles from "./styles.module.scss";

type Order = {
  id: string;
  restaurant: string;
  orderLabel: string;
  status: string;
  eta: string;
  activeStep: OrderStep;
};

type OrderInProgressProps = {
  orders?: Order[];
  heading?: string;
};

const DEFAULT_ORDERS: Order[] = [
  {
    id: "1",
    restaurant: "Levain",
    orderLabel: "Order 2/2",
    status: "Your order is on the fast track to you!",
    eta: "Estimated delivery: today 8:30 - 9:45 pm",
    activeStep: 2,
  },
  {
    id: "2",
    restaurant: "Vista Pizza",
    orderLabel: "Order 1/2",
    status: "Cooking your meal right now",
    eta: "Estimated delivery: today 9:00 - 9:25 pm",
    activeStep: 1,
  },
];

export function OrderInProgress({
  orders = DEFAULT_ORDERS,
  heading = "Order in Progress",
}: OrderInProgressProps) {
  if (orders.length === 0) return null;

  return (
    <section className={styles.root}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.list}>
        {orders.map((o) => (
          <OrderCard
            key={o.id}
            restaurant={o.restaurant}
            orderLabel={o.orderLabel}
            status={o.status}
            eta={o.eta}
            activeStep={o.activeStep}
          />
        ))}
      </div>
    </section>
  );
}
