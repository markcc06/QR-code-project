'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const updateConsent = (status: 'granted' | 'denied') => {
  if (typeof window === 'undefined') return
  const w = window as any
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', {
      ad_storage: status,
      analytics_storage: status,
      ad_user_data: status,
      ad_personalization: status,
    })
  }
  try {
    localStorage.setItem('cookieConsent', status)
  } catch {}
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log('CookieBanner useEffect running')
    const timer = setTimeout(() => {
      try {
        const consent = localStorage.getItem('cookieConsent')
        console.log('consent:', consent)
        // Force visible during development for testing
        if (process.env.NODE_ENV === 'development') {
          setVisible(true)
        } else if (!consent) {
          setVisible(true)
        }
      } catch (e) {
        console.warn('LocalStorage or region detection unavailable.', e)
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted || !visible) return null

  const banner = (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-t border-neutral-200 dark:border-neutral-700 shadow-[0_-2px_8px_rgba(0,0,0,0.1)] z-[2147483647]">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-center sm:text-left leading-relaxed">
          We use cookies to improve your experience, analyze traffic, and serve personalized ads. By continuing, you agree to our cookie policy.
        </p>
        <div className="flex justify-center sm:justify-end gap-3">
          <button
            onClick={() => {
              updateConsent('granted')
              setVisible(false)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => {
              updateConsent('denied')
              setVisible(false)
            }}
            className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-4 py-2 text-sm rounded-md transition-colors dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(banner, document.body)
}