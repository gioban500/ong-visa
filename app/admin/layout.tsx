'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircleHeart,
  X,
} from 'lucide-react';
import { clearAllClientData } from '@/lib/client-data-cache';

const navigationGroups = [
  {
    label: 'Vue d’ensemble',
    items: [{ href: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' }],
  },
  {
    label: 'Au service du public',
    items: [
      { href: '/admin/messages', icon: Mail, label: 'Messages & écoute' },
      { href: '/admin/centers', icon: MapPin, label: 'Centres de dépistage' },
    ],
  },
  {
    label: 'Contenus du site',
    items: [
      { href: '/admin/site-content', icon: BookOpen, label: 'Sections & prévention' },
      { href: '/admin/cancers', icon: HeartHandshake, label: 'Fiches cancers' },
      { href: '/admin/blog', icon: FileText, label: 'Articles & actualités' },
    ],
  },
];

const pageTitles: Record<string, string> = Object.fromEntries(
  navigationGroups.flatMap((group) => group.items.map(({ href, label }) => [href, label])),
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const pageTitle = pageTitles[pathname] || 'Espace administration';
  const adminInitials = adminEmail
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'V';

  useEffect(() => {
    if (isLoginPage) return;

    let current = true;
    fetch('/api/admin/session', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          router.replace('/admin/login');
          return;
        }
        const data = await response.json();
        if (current) setAdminEmail(data.admin.email);
      })
      .catch((error: unknown) => {
        console.error('Admin session check failed:', error);
        router.replace('/admin/login');
      });

    return () => {
      current = false;
    };
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (!adminEmail) {
    return (
      <div className="admin-loading">
        <span className="admin-loading-mark"><Image src="/logo.png" alt="" width={38} height={38} /></span>
        <span className="admin-loading-spinner" aria-label="Chargement de votre espace" />
      </div>
    );
  }

  return (
    <div className="admin-layout-root">
      {isSidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Fermer le panneau de navigation"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-brand-row">
          <Link href="/admin" className="admin-brand" onClick={() => setIsSidebarOpen(false)}>
            <span className="admin-brand-logo">
              <Image src="/logo.png" alt="Logo ONG VISA" width={48} height={48} />
            </span>
            <span className="admin-brand-copy">
              <strong>ONG VISA</strong>
              <span>Administration</span>
            </span>
          </Link>
          <button
            type="button"
            className="admin-mobile-close"
            aria-label="Fermer le menu"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-caption">Votre espace de gestion</div>
        <nav className="admin-navigation" aria-label="Navigation d’administration">
          {navigationGroups.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <p className="admin-nav-label">{group.label}</p>
              {group.items.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href
                  || (href !== '/admin' && pathname.startsWith(`${href}/`));
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`admin-nav-link ${isActive ? 'is-active' : ''}`}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{label}</span>
                    {isActive && <ChevronRight className="admin-nav-chevron" size={15} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-mission-card">
            <span className="admin-mission-icon"><HeartHandshake size={18} /></span>
            <p>Ensemble pour la santé et le bien-être des femmes.</p>
          </div>
          <Link href="/" className="admin-site-link">
            <span>Voir le site public</span>
            <ArrowUpRight size={16} />
          </Link>
          <button
            type="button"
            onClick={async () => {
              try {
                await fetch('/api/admin/logout', { method: 'POST' });
              } finally {
                clearAllClientData();
                setAdminEmail('');
              }
              router.replace('/admin/login');
            }}
            className="admin-logout"
          >
            <LogOut size={17} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="admin-menu-toggle"
              aria-label="Ouvrir le menu"
            >
              <Menu size={21} />
            </button>
            <div>
              <span className="admin-topbar-eyebrow">ONG VISA · ESPACE ADMIN</span>
              <h1>{pageTitle}</h1>
            </div>
          </div>
          <div className="admin-user">
            <span className="admin-user-avatar">{adminInitials}</span>
            <span className="admin-user-copy">
              <strong>{adminEmail}</strong>
              <span>Administrateur</span>
            </span>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
