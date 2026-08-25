'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Play, Pause } from 'lucide-react'
import Image from 'next/image'

const VIDEO_SRC = '/videos/feroce_model.mp4'
const IMAGE_SRC = '/images/products/Naji Collection/Gold Fur Bag/Main-Preview.jpg'
const CROSSFADE_DELAY = 3000 // ms before image → video

export function FeaturedInfluencer() {
  const [showVideo, setShowVideo] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Start crossfade timer when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !showVideo) {
          timerRef.current = setTimeout(() => setShowVideo(true), CROSSFADE_DELAY)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      observer.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [showVideo])

  // Track video progress
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100)
    }
    const onPlay = () => setIsPaused(false)
    const onPause = () => setIsPaused(true)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [showVideo])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  return (
    <section ref={sectionRef} className='bg-white'>
      <div className='mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Label */}
          <p className='mb-6 text-center font-sans text-[11px] uppercase tracking-[0.3em] text-gold'>
            As Seen On
          </p>

          {/* Two-column layout */}
          <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12'>
            {/* Media — Image with crossfade to Video */}
            <div className='relative overflow-hidden'>
              <div className='relative aspect-[3/4] w-full overflow-hidden md:aspect-[4/5]'>
                {/* Still image (fades out) */}
                <AnimatePresence>
                  {!showVideo && (
                    <motion.div
                      key='image'
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2 }}
                      className='absolute inset-0'
                    >
                      <Image
                        src={IMAGE_SRC}
                        alt='FÉROCE Naji Gold Fur — as seen on influencer'
                        fill
                        className='object-cover object-center'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        priority
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video (fades in) */}
                <AnimatePresence>
                  {showVideo && (
                    <motion.div
                      key='video'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.2 }}
                      className='absolute inset-0'
                    >
                      <video
                        ref={videoRef}
                        src={VIDEO_SRC}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className='h-full w-full object-cover object-center'
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Play / Pause button */}
                {showVideo && (
                  <button
                    onClick={togglePlay}
                    className='absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60'
                    aria-label={isPaused ? 'Play video' : 'Pause video'}
                  >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  </button>
                )}

                {/* Progress bar on video */}
                {showVideo && (
                  <div className='absolute bottom-0 left-0 h-[3px] w-full bg-black/20'>
                    <div
                      className='h-full bg-gold transition-all duration-200'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Gold accent line */}
                <div className='absolute bottom-0 left-0 h-[3px] w-full bg-gold' />
              </div>
            </div>

            {/* Copy */}
            <div className='flex flex-col items-center gap-6 text-center md:items-start md:text-left'>
              {/* Star rating */}
              <div className='flex items-center gap-1'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className='fill-gold text-gold' />
                ))}
              </div>

              <p className='max-w-md font-serif text-2xl leading-snug text-navy md:text-3xl lg:text-4xl'>
                &ldquo;The Naji Gold Fur is IT. Everyone asks me where I got it.&rdquo;
              </p>

              <div className='flex flex-col items-center gap-2 md:items-start'>
                <p className='font-sans text-xs uppercase tracking-[0.2em] text-navy/60'>
                  — FÉROCE MUSE
                </p>
                <div className='flex items-center gap-2 text-navy/40'>
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><rect x='2' y='2' width='20' height='20' rx='5' ry='5' /><path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' /><line x1='17.5' y1='6.5' x2='17.51' y2='6.5' /></svg>
                  <span className='font-sans text-xs'>Verified Purchase</span>
                </div>
              </div>

              {/* CTA */}
              <a
                href='/product/naji-gold-fur-xl'
                className='mt-4 inline-block bg-navy px-8 py-4 font-sans text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-200 hover:bg-navy/90'
              >
                SHOP THE NAJI COLLECTION
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
