import { AddressBar } from "../components/AddressBar";
import { AdsCarousel } from "../components/AdsCarousel";
import { Categories } from "../components/Categories";
import { DesktopSidebar } from "../components/DesktopSidebar";
import { DesktopTopBar } from "../components/DesktopTopBar";
import { OrderInProgress } from "../components/OrderInProgress";
import { PromoStrip } from "../components/PromoStrip";
import { SearchBar } from "../components/SearchBar";
import { WeekendCravings } from "../components/WeekendCravings";
import styles from "./page.module.scss";

const ADDRESS_FULL = "Av. libertador 1234, Nuñez, Buenos Aires";
const ADDRESS_SHORT = "Av. libertador 1234, Nuñez";
const CART_COUNT = 2;

export default function Home() {
  return (
    <div className={styles.page}>
      <PromoStrip />
      <DesktopTopBar address={ADDRESS_SHORT} cartCount={CART_COUNT} />

      <div className={styles.shell}>
        <DesktopSidebar />

        <main className={styles.main}>
          <div className={styles.mobileOnly}>
            <AddressBar
              address={ADDRESS_FULL}
              label="Home"
              cartCount={CART_COUNT}
            />
            <div className={styles.searchWrap}>
              <SearchBar />
            </div>
          </div>

          <Categories />
          <OrderInProgress />
          <AdsCarousel />
          <WeekendCravings />

          <div className={styles.safeBottom} />
        </main>
      </div>
    </div>
  );
}
