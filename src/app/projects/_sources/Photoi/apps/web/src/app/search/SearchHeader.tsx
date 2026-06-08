'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../components/Header/Header.module.scss';
import searchStyles from './search.module.scss';
import LogoIcon from '../../assets/logo.svg';
import SearchIcon from '../../assets/icons/search.svg';
import PaletteIcon from '../../assets/icons/palette.svg';

interface SearchHeaderProps {
  initialQuery: string;
}

export default function SearchHeader({ initialQuery }: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <header className={`${styles.header} ${styles['header--visible']}`}>
      <div className={styles.header__logo} onClick={handleLogoClick}>
        <LogoIcon />
      </div>
      <nav className={styles.header__nav}>
        <div className={searchStyles.searchInput}>
          <form onSubmit={handleSubmit}>
            <div className={searchStyles.searchInput__container}>
              <span className={searchStyles.searchInput__icon}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search images"
                className={searchStyles.searchInput__field}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className={searchStyles.searchInput__colorPicker}
              >
                <PaletteIcon />
              </button>
            </div>
          </form>
        </div>
      </nav>
    </header>
  );
}
