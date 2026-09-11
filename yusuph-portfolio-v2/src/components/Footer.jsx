import React from 'react'
import { Code, Globe, Terminal } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-ink-800 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Name & Bio */}
        <div className="max-w-md text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xl font-display font-bold text-white mb-3">
            <Terminal className="w-5 h-5 text-signal" />
            <span>Yusuph Salimu</span>
          </div>
          <p className="text-sm text-mist-300 font-body leading-relaxed">
            Freelance in Web Development and Data Science, and a Software Engineering student at the University of Dodoma, Tanzania, building modern websites, automation tools, and practical digital solutions.
          </p>
        </div>

        {/* Right: Connect & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-mist-400">Connect</h4>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/YusuphSalimu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-ink-800 border border-ink-700 text-mist-200 hover:text-white hover:border-signal transition-colors flex items-center gap-2 text-xs font-mono"
            >
              <Code className="w-4 h-4 text-signal" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/yusuph-salimu-7818333aa/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-ink-800 border border-ink-700 text-mist-200 hover:text-white hover:border-signal transition-colors flex items-center gap-2 text-xs font-mono"
            >
              <Globe className="w-4 h-4 text-[#0a66c2]" /> LinkedIn
            </a>
          </div>
          <p className="text-xs text-mist-400 font-mono mt-2">
            © 2026 Yusuph Salimu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
