'use client'

import { useState, useEffect, Suspense } from 'react'
import styles from './home.module.scss'

import HeroBackground from './components/Background/HeroBackground'
import Header from './components/Header/Header'
import HeroHeader from './components/HeroHeader/HeroHeader'
import Hero from './components/Hero/Hero'
import GalleryGrid from './components/GalleryGrid/GalleryGrid'
import ScrollToExplore from './components/ScrollToExplore/ScrollToExplore'
import { useIsMobile } from './hooks/useIsMobile'
import { createRandomizedImages, ImageData } from './lib/imageData'

function HomeContent() {
  const isMobile = useIsMobile()
  const [showScroll, setShowScroll] = useState(true)
  const [hasScrolledToGallery, setHasScrolledToGallery] = useState(false)
  const [paddingProgress, setPaddingProgress] = useState(1)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showHeader, setShowHeader] = useState(false)

  const [sharedSearchQuery, setSharedSearchQuery] = useState('')
  const [sharedSelectedColor, setSharedSelectedColor] = useState('')

  const [images, setImages] = useState<ImageData[]>([])

  useEffect(() => {
    setImages(createRandomizedImages())
  }, [])

  useEffect(() => {
    let isScrolling = false

    const updateGalleryMargins = (progress: number) => {
      const galleryColumns = document.querySelectorAll('[class*="gallery__column"]')

      if (galleryColumns.length > 0) {
        const baseMargins = [32, 0, 24, 48]
        const baseMarginsMobile = [16, 0, 8, 24]

        const margins = isMobile ? baseMarginsMobile : baseMargins

        galleryColumns.forEach((column, index) => {
          const firstImage = column.querySelector('[class*="gallery__image"]:first-child') as HTMLElement
          if (firstImage && margins[index] !== undefined) {
            const currentMargin = margins[index] * progress
            firstImage.style.marginTop = `${currentMargin}px`
          }
        })
      }
    }

    const smoothScrollTo = (targetY: number) => {
      const startY = window.pageYOffset
      const distance = targetY - startY
      const duration = 800
      let startTime: number

            const animateScroll = (currentTime: number) => {
              if (!startTime) startTime = currentTime
              const timeElapsed = currentTime - startTime
              const progress = Math.min(timeElapsed / duration, 1)


              const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2

              // SISTEMA 1: Animación inicial - Sincronización perfecta e inmediata
              window.scrollTo(0, startY + distance * easeInOutCubic)
              setPaddingProgress(1 - progress) // Inmediato, sin delay

              // Los márgenes se animan más rápido - terminan al 80% del progress del scroll
              const marginProgress = Math.min(1, progress / 0.8) // Acelerar los márgenes
              updateGalleryMargins(1 - marginProgress) // Los márgenes terminan antes que el scroll

              if (progress < 1) {
                requestAnimationFrame(animateScroll)
              } else {
                isScrolling = false
                setIsAnimating(false) // Terminar el modo animación
                setPaddingProgress(0) // Asegurar que termine en 0
                updateGalleryMargins(0) // Asegurar que los márgenes terminen en 0
                setShowHeader(true) // Mostrar el header al terminar la animación
              }
            }

      isScrolling = true
      requestAnimationFrame(animateScroll)
    }

    const handleScroll = () => {
      if (isScrolling) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const gallerySection = document.querySelector('[data-section="gallery"]')

      if (gallerySection && !hasScrolledToGallery) {
        const galleryRect = gallerySection.getBoundingClientRect()
        const galleryTop = galleryRect.top + scrollTop

        // Se activa con cualquier scroll hacia abajo (más de 10px)
        if (scrollTop > 10 && !hasScrolledToGallery) {
          setHasScrolledToGallery(true)
          setIsAnimating(true) // Activar el modo animación
          // Animar scroll para que la galería quede 32px arriba del tope (64px - 96px = -32px)
          smoothScrollTo(galleryTop - 32)
          return // Salir aquí, la animación controlará el padding y los márgenes
        }
      }

      setShowScroll(scrollTop < 100 && !hasScrolledToGallery)

      // Controlar el padding basado en la proximidad a la galería
      if (gallerySection) {
        const galleryRect = gallerySection.getBoundingClientRect()
        const galleryTop = galleryRect.top + scrollTop
        const targetPosition = galleryTop - 32 // Posición final de la animación (96px más arriba)

        setLastScrollTop(scrollTop)

        // SISTEMA 2: Control manual del scroll - Con lógica de proximidad (funciona bien)
        if (hasScrolledToGallery && !isScrolling && !isAnimating) {
          // Si estamos EN O MÁS ABAJO de la posición objetivo, padding = 0
          if (scrollTop >= targetPosition) {
            setPaddingProgress(0)
            updateGalleryMargins(0) // Quitar márgenes junto con el padding
            setShowHeader(true) // Mostrar el header cuando llegamos a la posición objetivo
          }
          // Si estamos ARRIBA de la posición objetivo, calcular padding gradual
          else {
            const distanceFromTarget = targetPosition - scrollTop // Distancia hacia arriba desde la posición objetivo
            const maxDistance = 300 // Distancia máxima para tener padding completo

            const paddingProgressValue = Math.min(1, distanceFromTarget / maxDistance)
            setPaddingProgress(paddingProgressValue)
            updateGalleryMargins(paddingProgressValue) // Controlar márgenes junto con el padding
            setShowHeader(false) // Ocultar el header cuando estamos arriba de la posición objetivo
          }
        }
      }
    }

    // Establecer márgenes iniciales cuando se monta el componente
    const initializeMargins = () => {
      updateGalleryMargins(paddingProgress)
    }

    // Llamar después de un pequeño delay para asegurar que la galería esté renderizada
    const timeoutId = setTimeout(initializeMargins, 100)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [hasScrolledToGallery, paddingProgress, lastScrollTop, isAnimating, showHeader, isMobile])

  return (
    <div className={styles.home}>
      <HeroBackground />
      <Header
        isVisible={showHeader}
        sharedSearchQuery={sharedSearchQuery}
        sharedSelectedColor={sharedSelectedColor}
        onSearchChange={setSharedSearchQuery}
        onColorChange={setSharedSelectedColor}
      />
      <HeroHeader />
      <Hero
        sharedSearchQuery={sharedSearchQuery}
        sharedSelectedColor={sharedSelectedColor}
        onSearchChange={setSharedSearchQuery}
        onColorChange={setSharedSelectedColor}
      />
      <GalleryGrid images={images} dynamicPadding={paddingProgress} enableLongHover={showHeader} />
      <ScrollToExplore showScroll={showScroll} />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}

