'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUp, Send, Check } from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t-4 border-black bg-black text-white pt-16 pb-12 font-mono">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 pb-12 border-b-2 border-white/20">
          
          {/* Brand Info with RD Logo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 overflow-hidden border-2 border-[#FFE600] bg-[#4E3629]">
                <img
                  src="/cafe_pic/10001.jpg"
                  alt="Rora Dose Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-pixel text-3xl font-black text-[#FFE600] tracking-tight">
                RORA DOSE
              </span>
            </div>

            <p className="text-xs text-white/80 max-w-sm leading-relaxed">
              Waterfront specialty coffee bar inside Queen Aurora Garden Resort along Laguna de Bay. Single origins, slow pour-overs, and late-night kwentuhan until 1 AM.
            </p>

            <div className="font-arcade text-[8px] text-[#FFE600] space-y-1">
              <p>📍 QUEEN AURORA RESORT, CABUYAO, LAGUNA 4025</p>
              <p>⏰ OPEN DAILY: 10:00 AM — 1:00 AM</p>
              <p>📞 0927 953 2665</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4 text-xs font-silk">
            <div className="space-y-2">
              <p className="font-arcade text-[9px] text-[#00F0FF]">
                [INDEX]
              </p>
              <ul className="space-y-1.5 text-white/80">
                <li><a href="#menu" className="hover:text-[#FFE600]">MENU</a></li>
                <li><a href="#spaces" className="hover:text-[#FFE600]">SPACES</a></li>
                <li><a href="#craft" className="hover:text-[#FFE600]">CRAFT</a></li>
                <li><a href="#reserve" className="hover:text-[#FFE600]">RESERVE</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-arcade text-[9px] text-[#A3E635]">
                [COMMUNITY]
              </p>
              <ul className="space-y-1.5 text-white/80">
                <li><a href="#rewards" className="hover:text-[#FFE600]">PASSPORT</a></li>
                <li><a href="#visit" className="hover:text-[#FFE600]">DIRECTIONS</a></li>
                <li><a href="https://maps.app.goo.gl/c1mfgMUK8GrFe26d9?g_st=ipc" target="_blank" rel="noreferrer" className="hover:text-[#FFE600]">GOOGLE MAPS</a></li>
                <li><Link href="/admin" className="hover:text-[#FFE600] text-[#00F0FF] font-bold">[ADMIN OS]</Link></li>
              </ul>

            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <p className="font-arcade text-[9px] text-[#FF5722]">
              [SUBSCRIBE // ROAST DISPATCH]
            </p>
            <p className="text-xs text-white/80">
              Get notified of monthly single-origin releases and weekend cupping sessions.
            </p>

            {subscribed ? (
              <div className="border-2 border-[#A3E635] bg-neutral-900 p-2.5 text-xs text-[#A3E635] font-arcade">
                [✓] THANK YOU FOR SUBSCRIBING!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="YOUR EMAIL..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border-2 border-white bg-neutral-900 px-3 py-2 text-xs text-white placeholder:text-white/40 focus:border-[#FFE600] focus:outline-none"
                />
                <button
                  type="submit"
                  className="neo-btn bg-[#FFE600] px-3.5 py-2 text-black font-arcade text-xs"
                  aria-label="Subscribe"
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/60">
          <p>© {new Date().getFullYear()} RORA DOSE. HANDCRAFTED IN CABUYAO, LAGUNA.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 font-arcade text-[9px] text-[#FFE600] hover:text-white transition-colors"
          >
            <span>[▲ BACK TO TOP]</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
