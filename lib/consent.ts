// lib/consent.ts

export function grantConsent() {
  try {
    localStorage.setItem('cookieConsent', 'granted')
  } catch (err) {
    console.warn('Failed to store consent', err)
  }
}

export function denyConsent() {
  try {
    localStorage.setItem('cookieConsent', 'denied')
  } catch (err) {
    console.warn('Failed to store consent', err)
  }
}