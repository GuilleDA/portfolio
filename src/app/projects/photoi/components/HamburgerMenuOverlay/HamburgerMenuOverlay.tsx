import { useEffect } from 'react'
import styles from './HamburgerMenuOverlay.module.scss'
import LogoIcon from '../../assets/logo.svg'
import CloseIcon from '../../assets/icons/close.svg'
import { useRouter } from 'next/navigation'
import YoutubeIcon from '../../assets/icons/youtube.svg'
import InstagramIcon from '../../assets/icons/instagram.svg'
import PinterestIcon from '../../assets/icons/pinterest.svg'

interface HamburgerMenuOverlayProps {
  isVisible?: boolean
  onClose?: () => void
}

export default function HamburgerMenuOverlay({ isVisible = false, onClose }: HamburgerMenuOverlayProps) {
  const router = useRouter()

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

  if (!isVisible) return null


  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose?.()
  }


  const handleGoHome = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push('/projects/photoi')
  }

const handleYoutubeClick = (e: React.MouseEvent) => {
  e.stopPropagation()
  window.open('https://www.youtube.com/', '_blank')
}
const handleInstagramClick = (e: React.MouseEvent) => {
  e.stopPropagation()
  window.open('https://www.instagram.com/', '_blank')
}
const handlePinterestClick = (e: React.MouseEvent) => {
  e.stopPropagation()
  window.open('https://www.pinterest.com/', '_blank')
}

const handleFavouritesClick = (e: React.MouseEvent) => {
  e.stopPropagation()
  router.push('/projects/photoi/favourites')
}

  return (
    <div
      className={styles.overlay}
    >
      <div className={styles.overlay__header}>
        <div className={styles.overlay__logo} onClick={handleGoHome}>
          <LogoIcon />
        </div>
        <button className={styles.overlay__close} onClick={handleCloseClick}>
          <CloseIcon />
        </button>
      </div>
      <div className={styles.overlay_content}>
        <button className={styles.overlay_content_button} onClick={handleGoHome}>
          Home
        </button>
        <button className={styles.overlay_content_button} onClick={handleFavouritesClick}>
          Favourites
        </button>
        <button className={styles.overlay_content_button}>
          About us
        </button>
        <button className={styles.overlay_content_button}>
          Log in
        </button>
      </div>
      <div className={styles.overlay_content_footer}>
        <button className={styles.overlay_content_footer_button} onClick={handleYoutubeClick}>
          <YoutubeIcon />
        </button>
        <button className={styles.overlay_content_footer_button} onClick={handleInstagramClick}>
          <InstagramIcon />
        </button>
        <button className={styles.overlay_content_footer_button} onClick={handlePinterestClick}>
          <PinterestIcon />
        </button>
      </div>
    </div>
  )
}
