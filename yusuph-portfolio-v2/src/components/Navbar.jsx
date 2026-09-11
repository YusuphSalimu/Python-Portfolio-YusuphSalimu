import React, { useState, useEffect } from 'react'
import { Terminal, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ]

  const handleScrollTo = (e, href) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ink-900/80 backdrop-blur-md border-b border-ink-700 shadow-xl py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 text-xl font-display font-bold text-mist-100 hover:text-signal-glow transition-colors"
        >
          <Terminal className="w-6 h-6 text-signal" />
          <span>yusuph.dev</span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-sm font-medium text-mist-300 hover:text-mist-100 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Let's Connect CTA */}
        <div className="hidden md:block">
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="px-5 py-2.5 rounded-lg bg-signal hover:bg-signal-dim text-white text-sm font-semibold shadow-lg shadow-signal/20 transition-all"
          >
            Let's Connect
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-mist-200 hover:text-white p-2"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-ink-900/95 backdrop-blur-lg border-b border-ink-700 px-6 py-6 shadow-2xl flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-base font-medium text-mist-200 hover:text-signal-glow transition-colors py-2 border-b border-ink-800"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="mt-2 w-full text-center py-3 rounded-lg bg-signal text-white font-semibold shadow-lg shadow-signal/25"
          >
            Let's Connect
          </a>
        </div>
      )}
    </header>
  )
}
