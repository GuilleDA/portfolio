'use client'

import { useAtom } from 'jotai'
import styles from './favourites.module.scss'
import GalleryGrid from '../../components/GalleryGrid/GalleryGrid'
import Header from '../../components/Header/Header'
import { favouritesAtom } from '../../store/favourites'

export default function FavouritesPageContent() {
  const [favourites] = useAtom(favouritesAtom)
  console.log("favourites", favourites)
  return (
    <div className={styles.favouritesPage}>
      <Header isVisible={true}/>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Favourites</h1>
      </div>
      {favourites.length > 0 ? (
        <GalleryGrid
          images={favourites}
          dynamicPadding={0}
          noPadding
          enableLongHover={true}
        />
      ) : (
        <div className={styles.emptyState}>
          <p>No favourites yet</p>
          <span>Start adding images to your favourites by clicking the heart icon</span>
        </div>
      )}
    </div>
  )
}
