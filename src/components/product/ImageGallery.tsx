'use client'

import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
  modelImages: string[]
  productName: string
  activeVariant?: {
    color: string
    images: string[]
    modelImages: string[]
  }
}

export function ImageGallery({ images, modelImages, productName, activeVariant }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)

  // Use variant images if available, otherwise fall back to product images
  const displayImages = activeVariant && activeVariant.images.length > 0
    ? activeVariant.images
    : images.length > 0
      ? images
      : ['/images/placeholder.jpg']

  const displayModelImages = activeVariant && activeVariant.modelImages.length > 0
    ? activeVariant.modelImages
    : modelImages

  // Combine product + model images for gallery
  const allImages = [...displayImages, ...displayModelImages.filter(m => !displayImages.includes(m))]

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden border border-line bg-white">
        <img
          src={allImages[activeIdx] || displayImages[0]}
          alt={productName}
          className="h-full w-full object-cover transition-opacity duration-500"
        />

        {/* Image counter */}
        <div className="absolute bottom-4 left-4 bg-navy/70 px-3 py-1 text-[10px] font-sans uppercase tracking-wider text-white">
          {activeIdx + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 border overflow-hidden transition-all duration-200 ${
                idx === activeIdx
                  ? 'border-navy ring-1 ring-navy/20'
                  : 'border-line hover:border-navy/30'
              }`}
            >
              <img
                src={img}
                alt={`${productName} — view ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
