import styles from './Hero.module.scss';
import InputSearch from '../InputSearch/InputSearch';

interface HeroProps {
  sharedSearchQuery?: string;
  sharedSelectedColor?: string;
  onSearchChange?: (query: string) => void;
  onColorChange?: (color: string) => void;
}

export default function Hero({
  sharedSearchQuery = '',
  sharedSelectedColor = '',
  onSearchChange,
  onColorChange
}: HeroProps) {
  return <section className={styles.hero}>
        <h1 className={styles.hero__title}>
          AI-generated images <br/>to <span className={styles.hero__highlight}>fuel your imagination</span>.
        </h1>
        <div className={styles.input_container}>
        <InputSearch
          initialValue={sharedSearchQuery}
          initialColor={sharedSelectedColor}
          onSearchChange={onSearchChange}
          onColorChange={onColorChange}
        />
        </div>
      </section>
    }
