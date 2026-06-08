'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { createPortal } from 'react-dom'
import { useAtom } from 'jotai'
import Image from 'next/image'
import styles from './ImageModal.module.scss'
import IconButton from '../IconButton/IconButton'
import CloseIcon from '../../assets/icons/close.svg'
import DownloadIcon from '../../assets/icons/download.svg'
import HeartIcon from '../../assets/icons/heart_outlined.svg'
import SearchDisplay from '../SearchDisplay'
import { toggleFavouriteAtom, favouritesAtom } from '../../store/favourites'
import { ImageData } from '../../lib/imageData'

interface ImageModalProps {
  images: ImageData[]
  isVisible?: boolean
  onClose?: () => void
  initialImageIndex?: number
}

export default function ImageModal({
  images,
  isVisible = false,
  onClose,
  initialImageIndex = 0
}: ImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const searchParams = useSearchParams()
  const imageRef = useRef<HTMLImageElement>(null)
  const [buttonPosition, setButtonPosition] = useState({ bottom: 16, right: 16 })

  const [favourites] = useAtom(favouritesAtom)
  const [, toggleFavourite] = useAtom(toggleFavouriteAtom)

  useEffect(() => {
    if (isVisible && images.length > 0) {
      setCurrentImageIndex(Math.min(initialImageIndex, images.length - 1))
    }
  }, [isVisible, initialImageIndex, images.length])

  useEffect(() => {
    if (!isVisible) return

    const thumbnailGallery = document.querySelector(`.${styles.thumbnailGallery}`)
    const activeThumbnail = document.querySelector(`.${styles.thumbnailActive}`)

    if (thumbnailGallery && activeThumbnail) {
      const galleryRect = thumbnailGallery.getBoundingClientRect()
      const thumbnailRect = activeThumbnail.getBoundingClientRect()

      const scrollLeft = thumbnailRect.left - galleryRect.left - (galleryRect.width / 2) + (thumbnailRect.width / 2)

      thumbnailGallery.scrollTo({
        left: thumbnailGallery.scrollLeft + scrollLeft,
        behavior: 'smooth'
      })
    }
  }, [currentImageIndex, isVisible])

  useEffect(() => {
    if (isVisible) {
      const scrollY = window.scrollY

      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    return () => {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev =>
          prev > 0 ? prev - 1 : images.length - 1
        )
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev =>
          prev < images.length - 1 ? prev + 1 : 0
        )
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, images.length, onClose])

  useEffect(() => {
    if (!isVisible || !imageRef.current) return

    const updateButtonPosition = () => {
      if (!imageRef.current) return

      const img = imageRef.current
      const container = img.parentElement
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height

      const naturalWidth = img.naturalWidth
      const naturalHeight = img.naturalHeight

      const containerRatio = containerWidth / containerHeight
      const imageRatio = naturalWidth / naturalHeight

      let renderedWidth, renderedHeight

      if (imageRatio > containerRatio) {
        renderedWidth = containerWidth
        renderedHeight = containerWidth / imageRatio
      } else {
        renderedHeight = containerHeight
        renderedWidth = containerHeight * imageRatio
      }

      const emptySpaceRight = (containerWidth - renderedWidth) / 2
      const emptySpaceBottom = (containerHeight - renderedHeight) / 2

      const newPosition = {
        bottom: Math.max(emptySpaceBottom + 16, 16),
        right: Math.max(emptySpaceRight + 16, 16)
      }

      setButtonPosition(newPosition)
    }

    const img = imageRef.current

    img.addEventListener('load', updateButtonPosition)
    const timer = setTimeout(updateButtonPosition, 200)
    window.addEventListener('resize', updateButtonPosition)

    return () => {
      img.removeEventListener('load', updateButtonPosition)
      clearTimeout(timer)
      window.removeEventListener('resize', updateButtonPosition)
    }
  }, [isVisible, currentImageIndex])

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose?.()
  }

  const handleDownload = () => {
    if (images[currentImageIndex]) {
      const link = document.createElement('a')
      link.href = images[currentImageIndex].src
      link.download = `image-${currentImageIndex + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleToggleFavourite = () => {
    if (images[currentImageIndex]) {
      toggleFavourite(images[currentImageIndex])
    }
  }

  const isCurrentImageFavourite = images[currentImageIndex]
    ? favourites.some(fav => fav.src === images[currentImageIndex].src)
    : false

  if (!isVisible || images.length === 0 ) return null

  const modalContent = (
    <div className={styles.overlay}>
      <div className={`${styles.overlay__header} ${
        (searchParams.get('q') || searchParams.get('c'))
          ? styles['overlay__header--with-search']
          : styles['overlay__header--actions-only']
      }`}>
        {(searchParams.get('q') || searchParams.get('c')) && (
          <SearchDisplay
            prompt={searchParams.get('q') || undefined}
            color={searchParams.get('c') || undefined}
          />
        )}
        <div className={styles.overlay__actions}>
          <button
            className={`${styles.heartButton} ${isCurrentImageFavourite ? styles.heartButtonActive : ''}`}
            onClick={handleToggleFavourite}
          >
            <HeartIcon />
          </button>
           <IconButton
           variant='white'
            icon={<DownloadIcon />}
            text="Download"
            onClick={handleDownload}
          />
          <button className={styles.overlay__close} onClick={handleCloseClick}>
            <CloseIcon />
          </button>
        </div>

        <button className={styles.mobileCloseButton} onClick={handleCloseClick}>
          <CloseIcon />
        </button>
      </div>

      <div className={styles.overlay__content}>
        <div className={styles.mainImage}>
          <div className={styles.imageContainer}>
            <img
              ref={imageRef}
              src={images[currentImageIndex]?.src}
              alt={images[currentImageIndex]?.alt}
              className={styles.image}
            />

            <div
              className={styles.mobileActions}
              style={{
                bottom: `${buttonPosition.bottom}px`,
                right: `${buttonPosition.right}px`,
                position: 'absolute'
              }}
            >
              <button
                className={`${styles.mobileHeartButton} ${isCurrentImageFavourite ? styles.mobileHeartButtonActive : ''}`}
                onClick={handleToggleFavourite}
              >
                <HeartIcon />
              </button>
              <button className={styles.mobileDownloadButton} onClick={handleDownload}>
                <DownloadIcon />
              </button>
            </div>
          </div>

        </div>

        <div className={styles.thumbnailGallery}>
          <div className={styles.thumbnailContainer}>
            {images.map((image, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${
                  index === currentImageIndex ? styles.thumbnailActive : ''
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={100}
                  height={100}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
