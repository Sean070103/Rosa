import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RORA DOSE ☕ [PIXEL ED.] | Waterfront Specialty Cafe · Cabuyao',
  description: 'Specialty coffee by Laguna de Bay at Queen Aurora Garden Resort. Open daily 10 AM to 1 AM.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFE600',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#FFFDF0] text-black selection:bg-[#FFE600] selection:text-black font-mono">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}


