'use client'

import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { ShoppingBag, Menu, X, User, LogOut, Package } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/stores/cart'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

interface NavbarClientProps {
  user: { id: string; email: string } | null
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const itemCount = useCartStore((s) => s.items.length)
  const router = useRouter()
  const t = useTranslations('Navigation')

  async function handleLogout() {
    await fetch('/api/auth/user/logout', { method: 'POST' })
    router.refresh()
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="flex items-center gap-6 bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-[0_4px_20px_-4px_rgba(26,46,45,0.15)] w-full max-w-4xl border border-white/20">
        <Link href="/" className="shrink-0">
          <Image 
            src="/logo/logo.png" 
            alt="Viva Leve Portal" 
            width={120} 
            height={36} 
            className="h-9 w-auto" 
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <Link href="/products" className="text-viva-muted hover:text-viva-text font-medium text-sm transition-colors">
            {t('products')}
          </Link>
          <Link href={{ pathname: '/', hash: 'categories' }} className="text-viva-muted hover:text-viva-text font-medium text-sm transition-colors">
            {t('categories')}
          </Link>
          <Link href="/quem-somos" className="text-viva-muted hover:text-viva-text font-medium text-sm transition-colors">
            {t('about')}
          </Link>
          <Link href="/contato" className="text-viva-muted hover:text-viva-text font-medium text-sm transition-colors">
            {t('contact')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-viva-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-viva-primary" />
                </div>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-11 w-48 bg-white rounded-2xl border shadow-xl py-2 z-50 overflow-hidden">
                  <Link
                    href="/account/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    {t('myOrders')}
                  </Link>
                  <hr className="my-1 border-gray-50" />
                  <button
                    onClick={() => { setDropdownOpen(false); handleLogout() }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="hidden md:flex p-2 text-viva-muted hover:text-viva-text transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          )}

          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-viva-muted hover:text-viva-primary group"
          >
            <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-viva-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          <LanguageSwitcher />

          <button
            className="md:hidden p-2 text-viva-muted hover:text-viva-text"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu - floating panel */}
        {open && (
          <div className="absolute top-full left-0 right-0 md:hidden bg-white rounded-2xl shadow-xl mt-3 p-6 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200 border border-gray-100">
            <Link href="/products" className="block text-lg font-semibold text-viva-text hover:text-viva-primary transition-colors" onClick={() => setOpen(false)}>
              {t('products')}
            </Link>
            <Link href={{ pathname: '/', hash: 'categories' }} className="block text-lg font-semibold text-viva-text hover:text-viva-primary transition-colors" onClick={() => setOpen(false)}>
              {t('categories')}
            </Link>
            <Link href="/quem-somos" className="block text-lg font-semibold text-viva-text hover:text-viva-primary transition-colors" onClick={() => setOpen(false)}>
              {t('about')}
            </Link>
            <Link href="/contato" className="block text-lg font-semibold text-viva-text hover:text-viva-primary transition-colors" onClick={() => setOpen(false)}>
              {t('contact')}
            </Link>
          {user ? (
            <>
              <Link href="/account/orders" className="block text-base font-semibold text-viva-text py-1" onClick={() => setOpen(false)}>
                {t('myOrders')}
              </Link>
              <button
                onClick={() => { setOpen(false); handleLogout() }}
                className="block text-red-600 font-semibold w-full text-left py-1"
              >
                {t('signOut')}
              </button>
            </>
          ) : (
            <Link href="/sign-in" className="block text-base font-semibold text-viva-text py-1" onClick={() => setOpen(false)}>
              {t('signIn')}
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
