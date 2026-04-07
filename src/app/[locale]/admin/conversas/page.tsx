'use client'

import { useState, useEffect } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AdminConversasPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchConversations(password)
  }

  const fetchConversations = async (pass: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/conversas', {
        headers: {
          'Authorization': `Bearer ${pass}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
        setIsAuthenticated(true)
        localStorage.setItem('admin_conversas_pass', pass)
      } else {
        setError('Senha incorreta')
        setIsAuthenticated(false)
      }
    } catch (err) {
      setError('Erro ao carregar conversas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedPass = localStorage.getItem('admin_conversas_pass')
    if (savedPass) {
      setPassword(savedPass)
      fetchConversations(savedPass)
    }
  }, [])

  const filteredConversations = conversations.filter(c => 
    filter === 'all' || c.channel === filter
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00756e]/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#00756e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#00756e] mb-2 text-center">Admin Conversas</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">Acesso restrito. Digite a senha administrativa.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Senha de Acesso</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00756e] focus:border-transparent outline-none transition-all text-gray-900"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium animate-pulse">
                {error}
              </div>
            )}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#00756e] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#00756e]/20 hover:bg-[#005a55] transition-all disabled:opacity-50 active:scale-95 translate-y-0 hover:-translate-y-0.5"
            >
              {loading ? 'Verificando...' : 'Entrar no Painel'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Painel de Conversas <span className="text-[#00756e]">Fly</span></h1>
            <p className="text-gray-500 mt-1">Monitore os atendimentos em tempo real através dos canais.</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 self-start">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'website', label: 'Website' },
              { id: 'whatsapp', label: 'WhatsApp' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === tab.id ? 'bg-[#00756e] text-white shadow-md shadow-[#00756e]/20' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-4">
          {filteredConversations.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
               <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
               </div>
               <h3 className="text-lg font-bold text-gray-900">Nenhuma conversa por aqui</h3>
               <p className="text-gray-500">Quando os clientes falarem com a Fly, as mensagens aparecerão aqui.</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div key={conv._id} className={`bg-white rounded-2xl shadow-sm border transition-all ${expandedId === conv._id ? 'border-[#80b023] ring-1 ring-[#80b023]/20' : 'border-gray-200'}`}>
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(expandedId === conv._id ? null : conv._id)}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${conv.channel === 'whatsapp' ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-[#00756e]/10 text-[#00756e]'}`}>
                      {conv.channel === 'whatsapp' ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold text-gray-900 text-lg leading-none mb-1">{conv.identifier}</div>
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                        {conv.updatedAt ? format(new Date(conv.updatedAt), "d 'de' MMMM 'às' HH:mm", { locale: ptBR }) : 'S/ Data'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden md:block">
                      <div className="text-sm font-black text-gray-800">{conv.messages?.length || 0} <span className="font-medium text-gray-400">Mensagens</span></div>
                      <div className="text-[10px] font-bold text-[#80b023] uppercase tracking-tighter">
                        Atividade {formatDistanceToNow(new Date(conv.updatedAt), { locale: ptBR, addSuffix: true })}
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg transition-colors ${expandedId === conv._id ? 'bg-[#80b023] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <svg className={`w-5 h-5 transition-transform ${expandedId === conv._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>

                {expandedId === conv._id && (
                  <div className="border-t border-gray-100 bg-[#fafafa] p-6 space-y-6 max-h-[600px] overflow-y-auto">
                    {conv.messages?.map((msg: any, idx: number) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-3xl p-4 shadow-sm relative ${
                          msg.role === 'user' 
                            ? 'bg-white border border-gray-100 rounded-bl-none text-gray-800' 
                            : 'bg-[#eef8f0] text-[#004d48] rounded-br-none'
                        }`}>
                          <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-40">
                            {msg.role === 'user' ? '👤 Cliente' : '🤖 Fly Atendente'}
                          </div>
                          <div className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</div>
                          <div className="text-[9px] font-bold text-right mt-2 opacity-30">
                            {format(new Date(msg.timestamp || conv.updatedAt), 'HH:mm')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
