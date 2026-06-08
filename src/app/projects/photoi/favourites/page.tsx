'use client'

import { Suspense } from 'react'
import FavouritesPageContent from './FavouritesPageContent'

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FavouritesPageContent />
    </Suspense>
  )
}
