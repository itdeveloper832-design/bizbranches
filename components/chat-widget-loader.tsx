'use client'

// Client wrapper — ssr:false is only valid inside a Client Component.
// layout.tsx (Server Component) imports this file instead of ChatWidget directly.
import dynamic from 'next/dynamic'

const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), {
  ssr: false,
  loading: () => null,
})

export default function ChatWidgetLoader() {
  return <ChatWidget />
}
