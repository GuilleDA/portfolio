import { CartPage } from "../../components/CartPage";
import { DesktopSidebar } from "../../components/DesktopSidebar";
import { DesktopTopBar } from "../../components/DesktopTopBar";
import { PromoStrip } from "../../components/PromoStrip";
import styles from "./page.module.scss";

const ADDRESS_SHORT = "Av. libertador 1234, Nuñez";

export default function CartRoute() {
  return (
    <div className={styles.page}>
      <PromoStrip />
      <DesktopTopBar address={ADDRESS_SHORT} />

      <div className={styles.shell}>
        <DesktopSidebar />

        <main className={styles.main}>
          <CartPage />
        </main>
      </div>
    </div>
  );
}
