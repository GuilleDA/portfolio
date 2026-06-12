import { DesktopSidebar } from "../components/DesktopSidebar";
import { DesktopTopBar } from "../components/DesktopTopBar";
import { OrderTrackingPage } from "../components/OrderTrackingPage";
import { PromoStrip } from "../components/PromoStrip";
import styles from "./page.module.scss";

const ADDRESS_SHORT = "Av. libertador 1234, Nuñez";

type PageProps = {
  searchParams: Promise<{ id?: string | string[] }>;
};

export default async function OrderRoute({ searchParams }: PageProps) {
  const { id } = await searchParams;
  const orderId = Array.isArray(id) ? id[0] : id;

  return (
    <div className={styles.page}>
      <PromoStrip />
      <DesktopTopBar address={ADDRESS_SHORT} />

      <div className={styles.shell}>
        <DesktopSidebar />

        <main className={styles.main}>
          <OrderTrackingPage orderId={orderId} />
        </main>
      </div>
    </div>
  );
}
