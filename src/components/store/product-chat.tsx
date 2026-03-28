'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, X, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ProductChatProps {
  productSlug: string
  productName: string
}

export default function ProductChat({ productSlug, productName }: ProductChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    const chatOpenedKey = `chat-opened-${productSlug}`
    const alreadyOpened = sessionStorage.getItem(chatOpenedKey)

    if (!alreadyOpened) {
      const timer = setTimeout(() => {
        handleOpen()
        sessionStorage.setItem(chatOpenedKey, 'true')
      }, 7000)
      return () => clearTimeout(timer)
    }
  }, [productSlug])

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleOpen = async () => {
    setIsOpen(true)
    if (messages.length === 0) {
      const initialText = `Olá! 👋 Sou Fly, da Viva Leve. Vi que você está vendo o ${productName}. Posso te ajudar com alguma dúvida? 😊`
      
      // Delays per manual
      await sleep(600)
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

      // Interval between characters
      await sleep(20)

      // Pause after sentences (. ? !)
      if (['.', '?', '!'].includes(char) && i < chars.length - 1) {
        await sleep(400)
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
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 bg-viva-primary text-white rounded-full w-14 h-14 shadow-xl flex items-center justify-center z-50 hover:scale-105 transition-transform"
        >
          <MessageCircle size={28} />
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:bottom-24 sm:right-4 w-[calc(100%-2rem)] sm:w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-[100] transition-all overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-viva-primary p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <FlyAvatar />
              <div>
                <h3 className="font-bold text-sm leading-none">Fly</h3>
                <span className="text-xs text-white/80">Viva Leve Portal</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && <FlyAvatar />}
                <div
                  className={`px-4 py-2 text-sm max-w-[80%] ${
                    m.role === 'user'
                      ? 'bg-viva-primary text-white rounded-2xl rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <FlyAvatar />
                <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 flex gap-1 items-center h-8">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre o produto..."
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-viva-primary focus:ring-1 focus:ring-viva-primary/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-viva-primary text-white rounded-full p-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
