'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './InputSearch.module.scss';
import SearchIcon from '../../assets/icons/search.svg';
import ColorPicker from '../ColorPicker/ColorPicker';

interface InputSearchProps {
  isThin?: boolean;
  initialValue?: string;
  initialColor?: string;
  onSearchChange?: (query: string) => void;
  onColorChange?: (color: string) => void;
}

export default function InputSearch({
  isThin = false,
  initialValue = '',
  initialColor = '',
  onSearchChange,
  onColorChange
}: InputSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const router = useRouter();

  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      if (initialColor) {
        params.set('c', initialColor);
      }
      router.push(`/projects/photoi/search?${params.toString()}`);
    }
  };

  const handleColorSelect = (color: string) => {
    onColorChange?.(color);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.search}>
      <form onSubmit={handleSubmit}>
        <div className={`${styles.search__input} ${isThin ? styles['search__input--thin'] : ''}`}>
          <span className={styles.search__icon}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search images"
            className={styles.search__field}
            style={isThin ? { fontSize: '16px' } : {}}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          <ColorPicker
            onColorSelect={handleColorSelect}
            initialColor={initialColor}
            isThin={isThin}
            className={`${styles.search__colorPicker} ${isThin ? styles['search__colorPicker--thin'] : ''}`}
          />
        </div>
      </form>
    </div>
  );
}
