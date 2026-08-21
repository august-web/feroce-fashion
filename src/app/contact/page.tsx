'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] md:h-[50vh] overflow-hidden">
        <img src="/images/about-hero.jpg" alt="Féroce" className="absolute inset-0 h-full w-full object-cover object-center" style={{ objectPosition: '50% 70%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-navy/20" />
        <div className="relative z-10 flex h-full items-end px-5 pb-10 md:items-center md:pb-0 md:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl w-full">
            <p className="label mb-3 text-gold">Get in Touch</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white">Contact Us</h1>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Left - Contact Info */}
            <div>
              <ScrollReveal>
                <p className="label mb-4 text-gold">Reach Out</p>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy mb-6">We would love to hear from you.</h2>
                <p className="text-sm text-navy/60 leading-relaxed mb-10">Whether you have a question about an order, need styling advice, or want to collaborate — we are here. DM us on Instagram for the fastest response.</p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-gold/40 text-gold">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy/40 mb-1">Email</p>
                      <a href="mailto:Ferocefashionff@gmail.com" className="text-sm text-navy font-medium hover:text-gold transition-colors">Ferocefashionff@gmail.com</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-gold/40 text-gold">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy/40 mb-1">Instagram</p>
                      <a href="https://www.instagram.com/ferocefashion_ff" target="_blank" rel="noopener noreferrer" className="text-sm text-navy font-medium hover:text-gold transition-colors">@ferocefashion_ff</a>
                      <p className="text-[10px] text-navy/40 mt-0.5">DM for purchase</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-gold/40 text-gold">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.19 8.19 0 005.58 2.17V12a4.85 4.85 0 01-5.58-2.71V6.69h5.58z" /></svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy/40 mb-1">TikTok</p>
                      <a href="https://www.tiktok.com/@ferocefashion_ff" target="_blank" rel="noopener noreferrer" className="text-sm text-navy font-medium hover:text-gold transition-colors">@ferocefashion_ff</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-gold/40 text-gold">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy/40 mb-1">Shipping</p>
                      <p className="text-sm text-navy font-medium">International Shipping Available</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right - Contact Form */}
            <div>
              <ScrollReveal delay={150}>
                <div className="bg-white border border-line p-8 md:p-10">
                  <h3 className="font-serif text-xl font-semibold text-navy mb-2">Send Us a Message</h3>
                  <p className="text-xs text-navy/40 mb-6">We typically respond within 24 hours.</p>

                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:Ferocefashionff@gmail.com?subject=Inquiry from Feroce Website'; }}>
                    <div>
                      <label className="block text-[11px] font-sans uppercase tracking-[0.08em] text-navy/60 mb-1.5">Name</label>
                      <input type="text" placeholder="Your name" className="w-full border border-[#d1cec7] bg-white px-4 text-[16px] font-sans text-navy placeholder:text-[#8a857c]/60 min-h-[48px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all duration-150" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-sans uppercase tracking-[0.08em] text-navy/60 mb-1.5">Email</label>
                      <input type="email" placeholder="you@example.com" className="w-full border border-[#d1cec7] bg-white px-4 text-[16px] font-sans text-navy placeholder:text-[#8a857c]/60 min-h-[48px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all duration-150" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-sans uppercase tracking-[0.08em] text-navy/60 mb-1.5">Subject</label>
                      <select className="w-full border border-[#d1cec7] bg-white px-4 text-[16px] font-sans text-navy min-h-[48px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all duration-150 appearance-none">
                        <option>General Inquiry</option>
                        <option>Order Support</option>
                        <option>Styling Advice</option>
                        <option>Collaboration</option>
                        <option>Press</option>
                      </select>
                    </div>
                    <div>
                                            <label className="block text-[11px] font-sans uppercase tracking-[0.08em] text-navy/60 mb-1.5">Message</label>
                      <textarea rows={5} placeholder="Tell us how we can help..." className="w-full border border-[#d1cec7] bg-white px-4 py-3 text-[16px] font-sans text-navy placeholder:text-[#8a857c]/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all duration-150 resize-none" />
                    </div>
                    <button type="submit" className="w-full btn-primary py-4 min-h-[48px] text-center">Send Message</button>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
          <ScrollReveal>
            <p className="label mb-3 text-gold">Common Questions</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy mb-10">Frequently Asked</h2>
            <div className="space-y-4 text-left">
              {[{q:"How long does shipping take?",a:"Standard shipping is 5-7 business days. Express shipping (2-3 business days) is available at checkout. We ship internationally."},{q:"Do you accept returns?",a:"Yes - free returns within 30 days of delivery. Items must be unused with tags attached."},{q:"How do I care for my bag?",a:"Store in the included dust bag. Avoid prolonged sun exposure. Clean with a soft, dry cloth. Condition leather every 3-6 months."},{q:"Can I purchase via DM?",a:"Yes - DM us on Instagram @ferocefashion_ff for direct purchase options."}].map((faq,i)=>(
                <div key={i} className="border border-line p-5 md:p-6">
                  <h3 className="font-serif text-sm font-semibold text-navy mb-2">{faq.q}</h3>
                  <p className="text-xs text-navy/50 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}