'use client';

import { ReactNode } from 'react';
import styles from './IconButton.module.scss';

interface IconButtonProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'white';
}

export default function IconButton({
  icon,
  text,
  onClick,
  disabled = false,
  className = '',
  variant = 'primary'
}: IconButtonProps) {
  return (
    <button
      className={`${styles.iconButton} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.icon}>
        {icon}
      </div>
      <span className={styles.text}>
        {text}
      </span>
    </button>
  );
}
