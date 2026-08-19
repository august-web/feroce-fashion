'use client'

import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
  modelImages?: string[]
  productName: string
}

export function ImageGallery({ images, modelImages, productName }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)

  // Only show product shots in gallery — model shots are for shop grid hover only
  const displayImages = images.length > 0 ? images : ['/images/products/quilted-cream/product-1.jpg']

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden border border-line bg-white">
        <img
          src={displayImages[activeIdx]}
          alt={productName}
          className="h-full w-full object-cover transition-opacity duration-500"
        />
        {/* Gold F badge */}
        <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy font-serif text-sm font-bold shadow-md">
          F
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-4 bg-navy/70 px-3 py-1 text-[10px] font-sans uppercase tracking-wider text-white">
          {activeIdx + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails — show only if more than 1 image */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border-2 transition-all duration-300 sm:h-20 sm:w-20 ${
                i === activeIdx
                  ? 'border-navy'
                  : 'border-line hover:border-navy/30'
              }`}
            >
              <img
                src={img}
                alt={`${productName} view ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
