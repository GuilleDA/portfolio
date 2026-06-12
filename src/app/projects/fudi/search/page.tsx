import { DesktopSidebar } from "../../components/DesktopSidebar";
import { DesktopTopBar } from "../../components/DesktopTopBar";
import { PromoStrip } from "../../components/PromoStrip";
import { SearchPage } from "../../components/SearchPage";
import styles from "./page.module.scss";

const ADDRESS_SHORT = "Av. libertador 1234, Nuñez";

type PageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

export default async function SearchRoute({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const activeCategory = Array.isArray(category) ? category[0] : category;

  return (
    <div className={styles.page}>
      <PromoStrip />
      <DesktopTopBar address={ADDRESS_SHORT} />

      <div className={styles.shell}>
        <DesktopSidebar />

        <main className={styles.main}>
          <SearchPage category={activeCategory} />
        </main>
      </div>
    </div>
  );
}
