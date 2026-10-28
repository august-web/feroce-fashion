'use client'

import { useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'

const VIDEOS = [
  {
    src: '/videos/hero-1.mp4',
    title: 'The Collection',
    desc: 'Structured utility meets fierce elegance.',
  },
  {
    src: '/videos/hero-2.mp4',
    title: 'The Atelier Craft',
    desc: 'Handcrafted in limited production batches.',
  },
]

function VideoCard({ src, title, desc }: { src: string; title: string; desc: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  return (
    <div
      onClick={togglePlay}
      className="group relative aspect-[4/5] sm:aspect-[16/10] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-navy shadow-sm cursor-pointer"
    >
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 h-full w-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent pointer-events-none" />

      {/* Signature Floating Frosted Glass Capsule at Bottom */}
      <div className="absolute bottom-5 inset-x-5 sm:inset-x-6 backdrop-blur-md bg-white/80 border border-white/70 rounded-full px-5 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="min-w-0 pr-3">
          <p className="font-sans text-xs sm:text-sm font-bold text-navy truncate">
            {title}
          </p>
          <p className="text-[10px] text-navy/60 font-sans truncate">
            {desc}
          </p>
        </div>
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-navy text-white hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
          {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </div>
      </div>
    </div>
  )
}

export function VideoGrid() {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-10 sm:mb-14">
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-gold block mb-2">
            Dallas Atelier Craftsmanship
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-navy leading-[1.1]">
            Motion & Heritage
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {VIDEOS.map((v, i) => (
            <VideoCard key={i} src={v.src} title={v.title} desc={v.desc} />
          ))}
        </div>
      </div>
    </section>
  )
}
