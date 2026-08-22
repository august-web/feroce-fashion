'use client';

import { useRef, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const videos = [
  {
    src: '/videos/hero-1.mp4',
    label: 'THE COLLECTION',
    description: 'Structured utility meets fierce elegance.',
  },
  {
    src: '/videos/hero-2.mp4',
    label: 'THE CRAFT',
    description: 'Handcrafted in our Dallas atelier.',
  },
];

function VideoCard({ src, label, description }: { src: string; label: string; description: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, visible } = useScrollReveal();
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div
      ref={ref}
      className={'relative overflow-hidden bg-navy transition-all duration-700 ' + (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}
    >
      <div className='aspect-[4/5] md:aspect-video relative cursor-pointer' onClick={togglePlay}>
        <video
          ref={videoRef}
          src={src}
          className='absolute inset-0 h-full w-full object-cover'
          autoPlay
          loop
          muted
          playsInline
          preload='metadata'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent' />
        <div className='absolute bottom-0 left-0 p-6 md:p-8'>
          <p className='font-label text-[11px] uppercase tracking-[0.3em] text-gold mb-1'>{label}</p>
          <p className='font-serif text-lg md:text-xl text-white'>{description}</p>
        </div>
        <div className='absolute top-4 right-4 flex h-10 w-10 items-center justify-center bg-navy/40 backdrop-blur-sm text-white transition-opacity hover:bg-navy/60'>
          {playing ? (
            <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor'><rect x='6' y='4' width='4' height='16' /><rect x='14' y='4' width='4' height='16' /></svg>
          ) : (
            <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor'><polygon points='5,3 19,12 5,21' /></svg>
          )}
        </div>
      </div>
    </div>
  );
}

export function VideoGrid() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className='bg-white px-4 py-16 md:py-24'>
      <div className='max-w-7xl mx-auto'>
        <div
          ref={ref}
          className={'text-center mb-10 transition-all duration-700 ' + (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
        >
          <p className='font-label text-[11px] uppercase tracking-[0.3em] text-gold mb-3'>Discover</p>
          <h2 className='font-serif text-3xl md:text-4xl text-navy'>The World of Féroce</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
          {videos.map((v) => (
            <VideoCard key={v.src} {...v} />
          ))}
        </div>
      </div>
    </section>
  );
}
