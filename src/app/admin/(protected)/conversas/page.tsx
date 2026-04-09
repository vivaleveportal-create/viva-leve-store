'use client'

import { useState, useEffect } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AdminHeader } from '@/components/admin/header'
import { 
  Search, 
  MessageSquare, 
  Smartphone, 
  Globe, 
  ChevronDown, 
  User, 
  Bot,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminConversasPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('channel', filter)
      if (dateFilter) params.append('date', dateFilter)
      
      const res = await fetch(`/api/admin/conversas?${params.toString()}`)
      const data = await res.json()
      if (res.ok) {
        setConversations(data)
      }
    } catch (err) {
      console.error('Erro ao carregar conversas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [filter, dateFilter])

  const filteredConversations = conversations.filter(c => {
    return c.identifier.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="p-4 md:p-6 space-y-6">
      <AdminHeader title="Central de Atendimento Fly" />

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar telefone/UUID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-viva-primary/20 transition-all text-gray-900"
            />
          </div>

          <div className="relative w-full md:w-48">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-viva-primary/20 transition-all text-gray-900"
            />
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg self-stretch md:self-auto">
          {[
            { id: 'all', label: 'Todos', icon: MessageSquare },
            { id: 'website', label: 'Website', icon: Globe },
            { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button 
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === tab.id 
                    ? "bg-white text-viva-primary shadow-sm" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-viva-primary" />
            <p className="font-medium">Carregando conversas...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-gray-200">
             <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <MessageSquare className="w-10 h-10" />
             </div>
             <h3 className="text-lg font-bold text-gray-900">Nenhuma conversa encontrada</h3>
             <p className="text-gray-500 text-sm">Tente ajustar seus filtros ou busca.</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div 
              key={conv._id} 
              className={cn(
                "bg-white rounded-xl shadow-sm border transition-all overflow-hidden",
                expandedId === conv._id ? "border-viva-primary ring-4 ring-viva-primary/5" : "border-gray-100 hover:border-gray-200"
              )}
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer group"
                onClick={() => setExpandedId(expandedId === conv._id ? null : conv._id)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    conv.channel === 'whatsapp' ? "bg-green-100 text-green-600" : "bg-viva-primary/10 text-viva-primary"
                  )}>
                    {conv.channel === 'whatsapp' ? <Smartphone className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{conv.identifier}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {conv.updatedAt ? format(new Date(conv.updatedAt), "d 'de' MMMM 'às' HH:mm", { locale: ptBR }) : 'S/ Data'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-right">
                  <div className="hidden md:block">
                    <div className="text-sm font-black text-gray-700">{conv.messages?.length || 0} <span className="font-normal text-gray-400">Msgs</span></div>
                    <div className="text-[10px] font-bold text-viva-primary uppercase tracking-tighter">
                      Ativo {formatDistanceToNow(new Date(conv.updatedAt), { locale: ptBR, addSuffix: true })}
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-gray-300 transition-transform duration-300",
                    expandedId === conv._id && "rotate-180 text-viva-primary"
                  )} />
                </div>
              </div>

              {expandedId === conv._id && (
                <div className="border-t border-gray-50 bg-[#fafafa] p-6 space-y-6 max-h-[600px] overflow-y-auto scroll-smooth no-scrollbar">
                  {conv.messages?.map((msg: any, idx: number) => (
                    <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-start" : "justify-end")}>
                      <div className={cn(
                        "max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm relative",
                        msg.role === 'user' 
                          ? "bg-gray-100 border border-gray-200 rounded-bl-none text-gray-800" 
                          : "bg-green-600 text-white rounded-br-none"
                      )}>
                        <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                          {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-white" />}
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest",
                            msg.role === 'user' ? "text-gray-500" : "text-white"
                          )}>
                            {msg.role === 'user' ? 'Cliente' : 'Fly'}
                          </span>
                        </div>
                        <div className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</div>
                        <div className={cn(
                          "text-[9px] font-bold text-right mt-2 opacity-50",
                          msg.role === 'assistant' && "text-white"
                        )}>
                          {format(new Date(msg.timestamp || conv.updatedAt), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest border border-gray-100">
                      Início da Conversa
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

