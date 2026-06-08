'use client';

import React from 'react';
import styles from './HeroBackground.module.scss';
import HeroImageSvg from '../../assets/hero-image.svg';

export default function HeroBackground() {
  return (
    <div className={styles.heroBackground}>
      <div className={styles.heroBackground__svg}>
        <HeroImageSvg />
      </div>
      <div className={styles.heroBackground__overlay} />
    </div>
  );
}
