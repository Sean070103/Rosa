'use client'

import { useState } from 'react'
import { ArrowUp, Send } from 'lucide-react'

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
    <footer className="border-t-4 border-[#341F14] bg-[#341F14] text-[#FAF4E8] pt-16 pb-12 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 pb-12 border-b-2 border-[#FAF4E8]/20">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="size-12 overflow-hidden border-2 border-[#FBE48A] rounded-full bg-[#4E3629]">
                <img
                  src="/cafe_pic/10001.jpg"
                  alt="Rosa Dose Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <span className="font-editorial text-3xl font-black italic text-[#FBE48A] tracking-tight">
                  ROSA DOSE
                </span>
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#FAF4E8]/70 mt-0.5">
                  Waterfront Roastery &amp; Bakery [PH]
                </p>
              </div>
            </div>

            <p className="font-sans text-xs text-[#FAF4E8]/80 max-w-sm leading-relaxed">
              Waterfront specialty coffee bar inside Queen Aurora Garden Resort along Laguna de Bay. Single origins, slow pour-overs, and late-night kwentuhan until 1 AM.
            </p>

            <div className="font-sans text-xs text-[#FBE48A] space-y-1.5">
              <p>✿ Queen Aurora Resort, Cabuyao, Laguna 4025</p>
              <p>✿ Open Daily: 10:00 AM — 1:00 AM</p>
              <p>✿ 0927 953 2665</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <p className="font-editorial italic text-sm font-black text-[#FBE48A]">
                The Menu
              </p>
              <ul className="space-y-2 text-[#FAF4E8]/75 font-sans">
                <li><a href="#menu" className="hover:text-[#FBE48A] transition-colors">Menu</a></li>
                <li><a href="#spaces" className="hover:text-[#FBE48A] transition-colors">Spaces</a></li>
                <li><a href="#craft" className="hover:text-[#FBE48A] transition-colors">The Craft</a></li>
                <li><a href="#reserve" className="hover:text-[#FBE48A] transition-colors">Reserve</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-editorial italic text-sm font-black text-[#FBE48A]">
                Community
              </p>
              <ul className="space-y-2 text-[#FAF4E8]/75 font-sans">
                <li><a href="#rewards" className="hover:text-[#FBE48A] transition-colors">Passport</a></li>
                <li><a href="#visit" className="hover:text-[#FBE48A] transition-colors">Directions</a></li>
                <li><a href="https://maps.app.goo.gl/c1mfgMUK8GrFe26d9?g_st=ipc" target="_blank" rel="noreferrer" className="hover:text-[#FBE48A] transition-colors">Google Maps</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <p className="font-editorial italic text-base font-black text-[#FBE48A]">
              Subscribe // Roast Dispatch
            </p>
            <p className="font-sans text-xs text-[#FAF4E8]/80 leading-relaxed">
              Get notified of monthly single-origin releases and weekend cupping sessions.
            </p>

            {subscribed ? (
              <div className="border-2 border-[#FBE48A] bg-[#341F14]/80 p-3 font-editorial italic text-sm text-[#FBE48A]">
                ✿ Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border-2 border-[#FBE48A]/40 bg-[#FAF4E8]/10 px-3.5 py-2.5 font-sans text-xs text-[#FAF4E8] placeholder:text-[#FAF4E8]/40 focus:border-[#FBE48A] focus:outline-none"
                />
                <button
                  type="submit"
                  className="retro-btn border-[#FBE48A] bg-[#FBE48A] px-3.5 py-2.5 text-[#341F14] font-bold hover:bg-[#C8521A] hover:text-[#FAF4E8]"
                  aria-label="Subscribe"
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-[#FAF4E8]/60">
          <p className="font-editorial italic">
            © {new Date().getFullYear()} Rosa Dose. Handcrafted in Cabuyao, Laguna.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 font-sans text-xs font-bold text-[#FBE48A] hover:text-[#FAF4E8] transition-colors"
          >
            <ArrowUp className="size-3.5" />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
