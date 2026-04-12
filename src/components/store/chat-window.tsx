'use client'

import React from 'react'
import { Send, X, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  input: string
  setInput: (val: string) => void
  isTyping: boolean
  showWppLink: boolean
  handleSendMessage: (e: React.FormEvent) => void
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  FlyAvatar: () => React.JSX.Element
}

export default function ChatWindow({
  isOpen,
  onClose,
  messages,
  input,
  setInput,
  isTyping,
  showWppLink,
  handleSendMessage,
  messagesEndRef,
  FlyAvatar
}: ChatWindowProps) {
  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-24 sm:right-4 sm:left-auto w-[calc(100%-2rem)] sm:w-80 md:w-96 h-[50vh] sm:h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-[100] transition-all overflow-hidden animate-in slide-in-from-bottom-5">
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
          onClick={onClose}
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

      {showWppLink && (
        <div 
          onClick={() => window.open(`https://wa.me/5521982266075`, '_blank')}
          className="text-xs text-viva-muted hover:text-viva-primary text-center py-2 cursor-pointer transition-colors border-t border-gray-50 bg-white"
        >
          Prefere continuar no WhatsApp? 💬
        </div>
      )}

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
  )
}
