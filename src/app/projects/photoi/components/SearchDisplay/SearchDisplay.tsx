import styles from './SearchDisplay.module.scss';

interface SearchDisplayProps {
  prompt?: string;
  color?: string;
}

export default function SearchDisplay({ prompt, color }: SearchDisplayProps) {
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  if (!prompt && !color) {
    return null;
  }

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: hexToRgba(color || '#000000', 0.15) }}
    >
      {prompt && <span className={styles.prompt}>{prompt}</span>}
      {color && (
        <div
          className={styles.colorCircle}
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  );
}
