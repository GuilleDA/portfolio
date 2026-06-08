'use client'

import { useState, useEffect } from 'react'
import styles from './search.module.scss'
import GalleryGrid from '../../components/GalleryGrid/GalleryGrid'
import Header from '../../components/Header/Header'
import { createRandomizedImages, ImageData } from '../../lib/imageData'

export default function SearchPageContent() {
  const [images, setImages] = useState<ImageData[]>([])

  useEffect(() => {
    setImages(createRandomizedImages())
  }, [])

  return (
    <div className={styles.searchPage}>
      <Header isVisible={true}/>
      <GalleryGrid
        images={images}
        dynamicPadding={0}
        noPadding
        enableLongHover={true}
      />
    </div>
  )
}
