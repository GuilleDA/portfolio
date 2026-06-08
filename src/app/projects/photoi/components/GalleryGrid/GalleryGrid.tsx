'use client'

import { useState, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import Image from 'next/image'
import styles from './GalleryGrid.module.scss'
import ImageModal from '../ImageModal/ImageModal'
import { useIsMobile } from '../../hooks/useIsMobile'
import { ImageData } from '../../lib/imageData'
import { toggleFavouriteAtom, favouritesAtom } from '../../store/favourites'
import DownloadIcon from '../../assets/icons/download.svg'
import HeartIcon from '../../assets/icons/heart_outlined.svg'

interface GalleryGridProps {
  images: ImageData[]
  dynamicPadding?: number
  noPadding?: boolean
  enableLongHover?: boolean
}

export default function GalleryGrid({ images, dynamicPadding = 1, noPadding = false, enableLongHover = false }: GalleryGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [favourites] = useAtom(favouritesAtom)
  const [, toggleFavourite] = useAtom(toggleFavouriteAtom)

  const isMobile = useIsMobile()
  const numColumns = isMobile ? 2 : 4
  const [isReady, setIsReady] = useState(false)


  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (dynamicPadding === 0 && isReady) {
      const updateGalleryMargins = () => {
        const galleryColumns = document.querySelectorAll('[class*="gallery__column"]')

        galleryColumns.forEach((column) => {
          const firstImage = column.querySelector('[class*="gallery__image"]:first-child') as HTMLElement
          if (firstImage) {
            firstImage.style.marginTop = '0px'
          }
        })
      }

      const timeoutId = setTimeout(updateGalleryMargins, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [dynamicPadding, isReady, numColumns])

  const dynamicPaddingValue = dynamicPadding * 40


  const overlayOpacity = (1 - dynamicPadding) * 0.7

  if (!isReady || images.length === 0) {
    return (
      <section
        className={styles.gallery}
        data-section="gallery"
        style={{
          '--dynamic-padding': `${dynamicPaddingValue}px`
        } as React.CSSProperties}
      >
        <div
          className={styles.gallery__overlay}
          style={{
            opacity: overlayOpacity
          }}
        />
        <div className={styles.gallery__grid}>
          <div style={{
            width: '100%',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            Loading gallery...
          </div>
        </div>
      </section>
    )
  }

  const distributeImages = (): ImageData[][] => {
    const columns: ImageData[][] = Array(numColumns).fill(null).map(() => [])

    for (let i = 0; i < images.length; i++) {
      const columnIndex = i % numColumns
      columns[columnIndex].push(images[i])
    }

    return columns
  }

  const columns = distributeImages()

  const galleryClass = `${styles.gallery__grid} ${noPadding ? styles.noPadding : styles.dynamicPadding}`

  const handleImageClick = (columnIndex: number, imageIndex: number) => {
    let globalIndex = 0
    for (let col = 0; col < numColumns!; col++) {
      if (col === columnIndex) {
        globalIndex += imageIndex
        break
      } else {
        globalIndex += Math.ceil(images.length / numColumns!)
      }
    }

    globalIndex = (imageIndex * numColumns!) + columnIndex

    setSelectedImageIndex(globalIndex)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleMouseEnter = (globalIndex: number) => {
    if (isMobile) return // No hover effect on mobile
    if (!enableLongHover) return // Solo activar cuando el header esté visible

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredImageIndex(globalIndex)
    }, 1000) // 1 segundo
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setHoveredImageIndex(null)
  }

  const handleDownload = (e: React.MouseEvent, image: ImageData) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = image.src
    link.download = `${image.alt}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleToggleFavourite = (e: React.MouseEvent, image: ImageData) => {
    e.stopPropagation()
    toggleFavourite(image)
  }

  const isImageFavourite = (image: ImageData) => {
    return favourites.some(fav => fav.src === image.src)
  }

  return (
    <section
      className={styles.gallery}
      data-section="gallery"
      style={{
        '--dynamic-padding': `${dynamicPaddingValue}px`
       } as React.CSSProperties}
     >
       <div
         className={styles.gallery__overlay}
        style={{
          opacity: overlayOpacity
        }}
      />
      <div className={galleryClass}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.gallery__column}>
            {column.map((image, imageIndex) => {
              const globalIndex = (imageIndex * numColumns) + columnIndex
              const isHovered = hoveredImageIndex === globalIndex
              const isDimmed = hoveredImageIndex !== null && hoveredImageIndex !== globalIndex

              return (
                <div
                  key={imageIndex}
                  className={`${styles.gallery__image} ${isHovered ? styles.gallery__imageHovered : ''} ${isDimmed ? styles.gallery__imageDimmed : ''}`}
                  onClick={() => handleImageClick(columnIndex, imageIndex)}
                  onMouseEnter={() => handleMouseEnter(globalIndex)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={styles.gallery__imageWrapper}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={300}
                      height={400}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>

                  {isHovered && (
                    <div className={styles.gallery__imageActions}>
                      <button
                        className={styles.gallery__actionButton}
                        onClick={(e) => handleDownload(e, image)}
                        aria-label="Download"
                      >
                        <DownloadIcon />
                      </button>
                      <button
                        className={`${styles.gallery__actionButton} ${styles.gallery__heartButton} ${isImageFavourite(image) ? styles.gallery__heartButtonActive : ''}`}
                        onClick={(e) => handleToggleFavourite(e, image)}
                        aria-label="Add to favourites"
                      >
                        <HeartIcon />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
         ))}
       </div>

       <ImageModal
        images={images}
        isVisible={isModalOpen}
        onClose={handleCloseModal}
        initialImageIndex={selectedImageIndex}
      />
    </section>
  )
}
