'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AdminHeader } from '@/components/admin/header'
import { 
  Search, 
  UserPlus, 
  Filter, 
  Phone, 
  MapPin, 
  ShoppingBag,
  Calendar,
  Loader2,
  Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (productFilter !== 'all') params.append('product', productFilter)
      
      const res = await fetch(`/api/admin/leads?${params.toString()}`)
      const data = await res.json()
      if (res.ok) {
        setLeads(data)
      }
    } catch (err) {
      console.error('Erro ao carregar leads:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [statusFilter, productFilter])

  const filteredLeads = leads.filter(l => {
    const searchLower = search.toLowerCase()
    return (
      (l.nome?.toLowerCase() || '').includes(searchLower) ||
      (l.telefone?.toLowerCase() || '').includes(searchLower) ||
      (l.cep?.toLowerCase() || '').includes(searchLower)
    )
  })

  // Extrair produtos únicos para o filtro
  const uniqueProducts = Array.from(new Set(leads.map(l => l.produto_interesse).filter(Boolean)))

  return (
    <div className="p-4 md:p-6 space-y-6">
      <AdminHeader title="Gestão de Leads" />

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, fone ou CEP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-viva-primary/20 transition-all text-gray-900"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg focus:ring-viva-primary focus:border-viva-primary block p-2"
            >
              <option value="all">Todos Status</option>
              <option value="novo">Novo</option>
              <option value="contatado">Contatado</option>
              <option value="venda_concluida">Venda Concluída</option>
              <option value="perdido">Perdido</option>
            </select>

            <select 
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg focus:ring-viva-primary focus:border-viva-primary block p-2"
            >
              <option value="all">Todos Produtos</option>
              {uniqueProducts.map((p: any) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid/Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-viva-primary" />
            <p className="text-gray-400 font-medium">Carregando leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 opacity-20" />
            </div>
            <p className="font-bold">Nenhum lead encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Lead / Contato</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Localização</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Interesse</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{lead.nome || 'Sem nome'}</span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                          <Phone className="w-3 h-3" />
                          <span>{lead.telefone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xs text-gray-800 font-medium">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{lead.cep || '--'}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-0.5 ml-4.5">{lead.cidade || 'Não informada'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 bg-viva-primary/5 text-viva-primary px-2.5 py-1 rounded-full border border-viva-primary/10">
                        <Tag className="w-3 h-3" />
                        <span className="text-xs font-bold">{lead.produto_interesse || 'Geral'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                        lead.status === 'novo' ? "bg-blue-50 text-blue-600" :
                        lead.status === 'contatado' ? "bg-yellow-50 text-yellow-600" :
                        lead.status === 'venda_concluida' ? "bg-green-50 text-green-600" :
                        "bg-gray-100 text-gray-500"
                      )}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(lead.createdAt), 'dd/MM/yyyy')}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
