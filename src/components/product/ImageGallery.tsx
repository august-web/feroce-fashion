'use client'

import { useState, useRef, MouseEvent } from 'react'
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react'

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
      <div className="space-y-4">
        {/* Main image with 2.2x hover loupe zoom inside modern rounded container */}
        <div
          ref={mainImageRef}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
          className="relative aspect-[4/5] overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[#F6F6F8] border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] cursor-zoom-in group select-none"
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

          {/* Floating frosted zoom hint badge */}
          <div className="absolute top-4 right-4 backdrop-blur-md bg-white/80 border border-white/70 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-navy shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 pointer-events-none">
            <Maximize2 className="w-3 h-3" />
            <span>Expand</span>
          </div>

          {/* Floating frosted image counter */}
          <div className="absolute bottom-5 left-5 backdrop-blur-md bg-white/80 border border-white/70 rounded-full px-4 py-1.5 text-xs font-bold text-navy shadow-sm pointer-events-none">
            {activeIdx + 1} / {allImages.length}
          </div>
        </div>

        {/* Modern Rounded Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide pt-1">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-[18px] sm:rounded-[22px] overflow-hidden transition-all duration-300 relative ${
                  idx === activeIdx
                    ? 'ring-2 ring-navy ring-offset-2 ring-offset-white shadow-md'
                    : 'opacity-65 hover:opacity-100 border border-gray-200'
                }`}
                aria-label={`View photo ${idx + 1}`}
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
          className="fixed inset-0 z-[9999] bg-navy/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close fullscreen view"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={productName}
              className="max-h-[78vh] w-auto object-contain rounded-[28px] shadow-2xl"
            />
            <div className="mt-4 flex gap-2 overflow-x-auto max-w-md p-1 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-12 h-12 rounded-[14px] overflow-hidden transition-all ${
                    idx === activeIdx ? 'ring-2 ring-gold' : 'opacity-50 hover:opacity-100'
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
