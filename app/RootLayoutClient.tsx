'use client'

import React from 'react'
import { Navbar } from '@/components/Navbar'
import FabFeedback from '@/components/Feedback/FabFeedback'
import CookieBanner from '@/components/CookieBanner'

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Cookie banner (always top-level and visible) */}
      <CookieBanner />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main>{children}</main>

      {/* Floating feedback */}
      <FabFeedback />
    </>
  )
}