'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, X, User } from 'lucide-react'
import { trackEvent } from '@/lib/analytics-client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ProductChatProps {
  productSlug: string
  productName: string
}

import dynamic from 'next/dynamic'

const DynamicChatWindow = dynamic(() => import('./chat-window'), {
  ssr: false,
})

export default function ProductChat({ productSlug, productName }: ProductChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showWppLink, setShowWppLink] = useState(false)
  const [hasShownWppLink, setHasShownWppLink] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [showNotification, setShowNotification] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowNotification(true)
      }
    }, 45000)
    return () => clearTimeout(timer)
  }, [isOpen])

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleOpen = async () => {
    setIsOpen(true)
    setShowNotification(false)
    trackEvent('chat_opened', { product_id: productSlug, source: 'chat' })

    // Se for a primeira vez abrindo e não tiver mensagens, envia saudação
    if (messages.length === 0) {
      const greetings = [
        `Olá! Sou a Fly, da Viva Leve. Vi que você está de olho no ${productName}. Tem alguma dúvida?`,
        `Oi! Tudo bem? Sou a Fly. Se precisar de alguma informação sobre o ${productName}, é só me chamar.`,
        `Olá! Vi que está interessado no ${productName}. Sou a Fly e estou aqui se precisar de ajuda.`,
        `Oi! 👋 Sou a Fly. Posso te ajudar com alguma dúvida sobre o ${productName}?`,
        `Olá! Sou a Fly, da equipe aqui da Viva Leve. Alguma dúvida sobre o ${productName}?`,
        `Oi! Tudo certinho? Sou a Fly. Se quiser saber mais sobre o ${productName}, estou por aqui.`
      ]
      
      const initialText = greetings[Math.floor(Math.random() * greetings.length)]
      
      await sleep(1000)
      setIsTyping(true)
      await sleep(1500)
      setIsTyping(false)
      await runTypewriter(initialText)
    }
  }

  const runTypewriter = async (text: string) => {
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])
    
    let currentText = ''
    const chars = Array.from(text)
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i]
      currentText += char
      
      setMessages((prev) => {
        const copy = [...prev]
        if (copy.length > 0) {
          copy[copy.length - 1] = { ...copy[copy.length - 1], content: currentText }
        }
        return copy
      })

      // Human-like typing delay: random between 30ms and 70ms
      await sleep(Math.floor(Math.random() * 40) + 30)

      // Longer pause after punctuation
      if (['.', '?', '!', ','].includes(char) && i < chars.length - 1) {
        await sleep(Math.floor(Math.random() * 200) + 500)
      }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)
    trackEvent('chat_message_sent', { 
      product_id: productSlug, 
      source: 'chat',
      payload: { message: userMessage }
    })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          productSlug,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()
      const fullText = data.reply

      // Espera 1 segundo simulando digitação
      setIsTyping(true)
      await sleep(1000)
      setIsTyping(false)

      // Efeito Typewriter sofisticado
      await runTypewriter(fullText)

      // Mostrar link de WhatsApp após a primeira resposta real (não o welcome)
      if (!hasShownWppLink) {
        setShowWppLink(true)
        setHasShownWppLink(true)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Desculpe, tive um problema. Poderia tentar novamente?' },
      ])
    }
  }

  const FlyAvatar = () => (
    <div className="bg-viva-primary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm shrink-0">
      FL
    </div>
  )

  return (
    <>
      {/* Notification Bubble */}
      {showNotification && !isOpen && (
        <div 
          onClick={handleOpen}
          className="fixed bottom-60 left-4 right-auto sm:bottom-24 sm:right-6 sm:left-auto bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-xl border border-viva-primary/10 flex items-center gap-2 cursor-pointer z-[60] animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <span className="text-xs sm:text-sm font-medium text-gray-700">Posso te ajudar?</span>
          <div className="w-2 h-2 bg-viva-primary rounded-full animate-pulse" />
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-4 left-4 right-auto sm:bottom-6 sm:right-6 sm:left-auto bg-viva-primary text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-xl flex items-center justify-center z-[60] hover:scale-105 transition-transform"
        >
          <MessageCircle size={24} className="sm:hidden" />
          <MessageCircle size={28} className="hidden sm:block" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      <DynamicChatWindow 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        input={input}
        setInput={setInput}
        isTyping={isTyping}
        showWppLink={showWppLink}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
        FlyAvatar={FlyAvatar}
      />
    </>
  )
}
