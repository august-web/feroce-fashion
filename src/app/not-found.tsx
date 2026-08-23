import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <section className='relative bg-navy min-h-[85vh] flex items-center justify-center overflow-hidden'>
      {/* Background logo watermark */}
      <div className='absolute inset-0 flex items-center justify-center opacity-[0.04]'>
        <img src='/logo.png' alt='' className='h-64 w-64 md:h-96 md:w-96 object-contain' />
      </div>

      {/* Gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-navy/50 via-transparent to-navy/50' />

      <div className='relative z-10 mx-auto max-w-lg px-6 py-16 sm:py-24 text-center'>
        {/* Gold accent line */}
        <div className='h-px w-12 bg-gold mx-auto mb-8' />

        <p className='font-label text-[11px] uppercase tracking-[0.3em] text-gold mb-4'>Error</p>

        <h1 className='font-serif text-6xl sm:text-7xl md:text-8xl font-semibold text-white mb-4 leading-none'>
          404
        </h1>

        <h2 className='font-serif text-xl sm:text-2xl text-white/90 mb-4'>
          Page Not Found
        </h2>

        <p className='text-sm text-white/50 mb-10 max-w-xs mx-auto leading-relaxed'>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* CTA buttons */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Link
            href='/'
            className='inline-flex items-center justify-center min-h-[48px] bg-white text-navy uppercase font-sans font-medium text-[11px] px-8 py-4 transition-all duration-300 hover:bg-gold hover:text-navy'
            style={{ letterSpacing: '0.2em' }}
          >
            Back to Home
          </Link>
          <Link
            href='/shop'
            className='inline-flex items-center justify-center min-h-[48px] border border-white/30 text-white uppercase font-sans font-medium text-[11px] px-8 py-4 transition-all duration-300 hover:border-gold hover:text-gold'
            style={{ letterSpacing: '0.2em' }}
          >
            Shop Collection
          </Link>
        </div>

        {/* Quick links */}
        <div className='mt-12 flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/30'>
          <Link href='/about' className='hover:text-gold transition-colors'>About</Link>
          <span>·</span>
          <Link href='/contact' className='hover:text-gold transition-colors'>Contact</Link>
          <span>·</span>
          <Link href='/faq' className='hover:text-gold transition-colors'>FAQ</Link>
        </div>
      </div>
    </section>
  );
}
