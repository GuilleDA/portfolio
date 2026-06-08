import { atom } from 'jotai'
import { ImageData } from '../lib/imageData'

export const favouritesAtom = atom<ImageData[]>([])

export const addToFavouritesAtom = atom(
  null,
  (get, set, image: ImageData) => {
    const currentFavourites = get(favouritesAtom)

    const alreadyExists = currentFavourites.some(fav => fav.src === image.src)

    if (!alreadyExists) {
      set(favouritesAtom, [...currentFavourites, image])
    }
  }
)

export const removeFromFavouritesAtom = atom(
  null,
  (get, set, imageSrc: string) => {
    const currentFavourites = get(favouritesAtom)
    set(favouritesAtom, currentFavourites.filter(fav => fav.src !== imageSrc))
  }
)

export const isFavouriteAtom = atom(
  null,
  (get, _set, imageSrc: string) => {
    const currentFavourites = get(favouritesAtom)
    return currentFavourites.some(fav => fav.src === imageSrc)
  }
)

export const toggleFavouriteAtom = atom(
  null,
  (get, set, image: ImageData) => {
    const currentFavourites = get(favouritesAtom)
    const alreadyExists = currentFavourites.some(fav => fav.src === image.src)

    if (alreadyExists) {
      set(favouritesAtom, currentFavourites.filter(fav => fav.src !== image.src))
    } else {
      set(favouritesAtom, [...currentFavourites, image])
    }
  }
)

