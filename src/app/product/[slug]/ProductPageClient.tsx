'use client'

import { useState } from 'react'
import type { ShopProduct } from '@/lib/shop-data'
import { ImageGallery } from '@/components/product/ImageGallery'
import { ProductDetailsClient } from './ProductDetailsClient'

interface ProductPageClientProps {
  product: ShopProduct
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || product.color)

  const activeVariant = product.variants.find((v) => v.color === selectedColor) || product.variants[0]

  return (
    <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14'>
      <div className='lg:sticky lg:top-20 lg:self-start'>
        <ImageGallery
          images={product.image_urls}
          modelImages={product.model_image_urls}
          productName={product.name}
          activeVariant={activeVariant}
        />
      </div>
      <div className='lg:sticky lg:top-20 lg:self-start'>
        <div className='space-y-6'>
          {product.is_new && (
            <span className='inline-block bg-gold px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-navy'>New</span>
          )}
          <div>
            <h1 className='font-serif text-2xl sm:text-3xl font-semibold text-navy md:text-4xl'>
              {product.name}
            </h1>
          </div>
          <p className='text-lg font-sans font-medium text-navy tracking-wide'>
            {product.price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price / 100) : ''}
          </p>
          <p className='text-sm leading-relaxed text-navy/60'>
            {product.description}
          </p>
          <ProductDetailsClient product={product} selectedColor={selectedColor} onColorChange={setSelectedColor} />
        </div>
      </div>
    </div>
  )
}