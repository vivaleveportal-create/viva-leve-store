import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    pathnames: {
        '/': '/',

        // Auth & Account
        '/account': {
            pt: '/conta',
            en: '/account'
        },
        '/account/orders': {
            pt: '/conta/pedidos',
            en: '/account/orders'
        },
        '/sign-in': {
            pt: '/entrar',
            en: '/sign-in'
        },
        '/sign-up': {
            pt: '/cadastrar',
            en: '/sign-up'
        },

        // Store
        '/products': {
            pt: '/produtos',
            en: '/products'
        },
        '/cart': {
            pt: '/carrinho',
            en: '/cart'
        },
        '/thank-you': {
            pt: '/obrigado',
            en: '/thank-you'
        },

        // Pages
        '/contato': {
            pt: '/contato',
            en: '/contact'
        },
        '/privacidade': {
            pt: '/privacidade',
            en: '/privacy'
        },
        '/termos': {
            pt: '/termos',
            en: '/terms'
        },
        '/quem-somos': {
            pt: '/quem-somos',
            en: '/about-us'
        },
        '/cookies': {
            pt: '/cookies',
            en: '/cookies'
        }
    }
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
