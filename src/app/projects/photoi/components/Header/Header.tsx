import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Header.module.scss';
import LogoIcon from '../../assets/logo.svg';
import InputSearch from '../InputSearch/InputSearch';
import MenuIcon from '../../assets/icons/menu.svg';
import HamburgerMenuOverlay from '../HamburgerMenuOverlay/HamburgerMenuOverlay';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '../../hooks/useIsMobile';

interface HeaderProps {
  isVisible?: boolean;
  sharedSearchQuery?: string;
  sharedSelectedColor?: string;
  onSearchChange?: (query: string) => void;
  onColorChange?: (color: string) => void;
}

export default function Header({
  isVisible = false,
  sharedSearchQuery = '',
  sharedSelectedColor = '',
  onSearchChange,
  onColorChange
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();


  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localSelectedColor, setLocalSelectedColor] = useState('');

  useEffect(() => {
    if (!onSearchChange && !onColorChange) {
      const q = searchParams.get('q') || '';
      const c = searchParams.get('c') || '';

      setLocalSearchQuery(q);
      setLocalSelectedColor(c);
    }
  }, [searchParams, onSearchChange, onColorChange]);

  const searchQuery = onSearchChange ? sharedSearchQuery : localSearchQuery;
  const selectedColor = onColorChange ? sharedSelectedColor : localSelectedColor;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleGoHome = () => {
    router.push('/projects/photoi');
  }

  return (
    <>
      <header className={`${styles.header} ${isVisible ? styles['header--visible'] : ''}`}>
        {!isMobile && <div className={styles.header__logo} onClick={handleGoHome}>
         <LogoIcon />
        </div>}
        {!isMobile ? (
          <nav className={styles.header__nav}>
            <InputSearch
              isThin
              initialValue={searchQuery}
              initialColor={selectedColor}
              onSearchChange={(query) => {
                if (onSearchChange) {
                  onSearchChange(query);
                } else {
                  setLocalSearchQuery(query);
                }
              }}
              onColorChange={(color) => {
                if (onColorChange) {
                  onColorChange(color);
                } else {
                  setLocalSelectedColor(color);
                }
              }}
            />
            <div className={styles.burger_button_container}>
              <div className={styles.burger_button_border}/>
              <button className={styles.burger_button} onClick={handleMenuToggle}>
                <MenuIcon />
              </button>
            </div>
          </nav>
        ) : (
          <>
            <div className={styles.header__search}>
              <InputSearch
                isThin
                initialValue={searchQuery}
                initialColor={selectedColor}
                onSearchChange={(query) => {
                  if (onSearchChange) {
                    onSearchChange(query);
                  } else {
                    setLocalSearchQuery(query);
                  }
                }}
                onColorChange={(color) => {
                  if (onColorChange) {
                    onColorChange(color);
                  } else {
                    setLocalSelectedColor(color);
                  }
                }}
              />
            </div>
            <div className={styles.burger_button_container}>
              <div className={styles.burger_button_border}/>
              <button className={styles.burger_button} onClick={handleMenuToggle}>
                <MenuIcon />
              </button>
            </div>
          </>
        )}
      </header>
      <HamburgerMenuOverlay isVisible={isMenuOpen} onClose={handleMenuClose} />
    </>
  );
}
