import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import SideNav from '../../components/layout/side_nav'
import ToastContainer from '../../components/layout/toast'
import { DndContext } from '@dnd-kit/core'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '뮤지오',
  description: '뮤지오 재고관리',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SideNav />
        <main>{children}</main>
        <ToastContainer />
      </body>
    </html>
  )
}
