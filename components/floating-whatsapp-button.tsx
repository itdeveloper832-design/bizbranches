'use client'

import { MessageCircle } from 'lucide-react'

export default function FloatingWhatsAppButton() {
  const whatsappNumber = '923345636230'
  const message = encodeURIComponent('Hi, I want to promote my business on your listing website. Please share details.')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-green-600"
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  )
}
