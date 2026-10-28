'use client'

import { useState, useRef, MouseEvent } from 'react'

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
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const mainImageRef = useRef<HTMLDivElement>(null)

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
  const currentImage = allImages[activeIdx] || displayImages[0]

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return
    const rect = mainImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image with 2.2x hover loupe zoom */}
        <div
          ref={mainImageRef}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
          className="relative aspect-[4/5] overflow-hidden border border-line bg-white cursor-zoom-in group"
        >
          <img
            src={currentImage}
            alt={productName}
            className={`h-full w-full object-cover transition-transform duration-200 ${
              isZooming ? 'scale-[2.2]' : 'scale-100'
            }`}
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
          />

          {/* Zoom hint badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase tracking-luxury text-navy/70 border border-line opacity-0 group-hover:opacity-100 transition-opacity">
            Click to expand
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-4 bg-navy/80 backdrop-blur-sm px-3 py-1 text-[10px] font-sans uppercase tracking-wider text-white">
            {activeIdx + 1} / {allImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 border overflow-hidden transition-all duration-200 ${
                  idx === activeIdx
                    ? 'border-navy ring-1 ring-navy/20'
                    : 'border-line hover:border-navy/40 opacity-70 hover:opacity-100'
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

      {/* Full-screen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-navy/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
            aria-label="Close fullscreen view"
          >
            ✕
          </button>
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentImage}
              alt={productName}
              className="max-h-[82vh] w-auto object-contain border border-white/10"
            />
            <div className="mt-3 flex gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-12 h-12 border overflow-hidden ${
                    idx === activeIdx ? 'border-gold' : 'border-white/30 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
