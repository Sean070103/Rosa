import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ROSA DOSE',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#C8521A',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#FAF4E8] text-[#341F14] selection:bg-[#FBE48A] selection:text-[#341F14] font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}



