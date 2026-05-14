'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/blog', label: 'Blog' },
  { href: '/add-business', label: 'Add Business' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-[#0f2b3d] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo-img.png"
              alt="PakBizBranches Logo"
              width={40}
              height={40}
              className="object-contain rounded-md"
              priority
            />
            <span className="text-white font-bold text-xl tracking-tight">
              PakBiz<span className="text-[#60a5fa]">Branches</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-[#60a5fa]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/add-business"
              className="ml-2 px-4 py-2 rounded-lg bg-[#60a5fa] text-white text-sm font-semibold hover:bg-blue-400 transition-colors duration-200 cursor-pointer"
            >
              List Free
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 cursor-pointer"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav
          className="md:hidden bg-[#0a1e2b] border-t border-white/10 px-4 py-4 flex flex-col gap-3"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                pathname === link.href
                  ? 'bg-[#60a5fa]/20 text-[#60a5fa]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/add-business"
            onClick={() => setOpen(false)}
            className="mt-1 px-4 py-2 rounded-lg bg-[#60a5fa] text-white text-sm font-semibold text-center hover:bg-blue-400 transition-colors"
          >
            List Free
          </Link>
        </nav>
      )}
    </header>
  )
}
