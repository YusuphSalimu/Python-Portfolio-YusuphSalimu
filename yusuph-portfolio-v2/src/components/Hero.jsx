import React, { useState, useEffect } from 'react'
import { ArrowRight, ShieldCheck, Linkedin } from 'lucide-react'

const terminalLines = [
  { text: '$ python train_model.py --dataset tz_stock_market', type: 'prompt' },
  { text: 'Epoch 12/12 — loss: 0.0421 — val_accuracy: 94.3%', type: 'success' },
  { text: '$ npm run build', type: 'prompt' },
  { text: '✓ built in 812ms', type: 'success' },
  { text: '$ git push origin main', type: 'prompt' },
  { text: '✓ deployed — client-ready', type: 'success' },
]

export default function Hero() {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (currentLineIndex < terminalLines.length) {
      const currentTarget = terminalLines[currentLineIndex].text
      if (currentCharIndex < currentTarget.length) {
        const timeout = setTimeout(() => setCurrentCharIndex(p => p + 1), 25)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setDisplayedLines(p => [...p, terminalLines[currentLineIndex]])
          setCurrentLineIndex(p => p + 1)
          setCurrentCharIndex(0)
        }, 400)
        return () => clearTimeout(timeout)
      }
    } else {
      setIsFinished(true)
    }
  }, [currentLineIndex, currentCharIndex])

  const handleScrollTo = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-ink-950">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-signal/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ink-800 border border-ink-700 text-signal-glow text-xs md:text-sm font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
            // Available for freelance & remote work
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-signal-glow via-signal to-amber">Yusuph Salimu</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-mist-300 font-body leading-relaxed mb-8 max-w-2xl">
            I engineer robust web applications, scalable backend systems, and data-driven machine learning solutions — building high-performance digital products for clients in Tanzania and worldwide.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a href="#projects" onClick={(e) => handleScrollTo(e, '#projects')} className="px-8 py-4 rounded-xl bg-signal hover:bg-signal-dim text-white font-semibold text-base shadow-lg shadow-signal/25 flex items-center gap-2 transition-all group">
              View My Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" onClick={(e) => handleScrollTo(e, '#contact')} className="px-8 py-4 rounded-xl bg-ink-800 hover:bg-ink-700 text-mist-100 font-semibold text-base border border-ink-700 transition-all">
              Let's Work Together
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-mist-400 uppercase tracking-wider mr-1">Verified:</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-800 border border-ink-700 text-mist-200 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-signal" /> Upwork Verified
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-800 border border-ink-700 text-mist-200 text-xs font-medium">
              <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" /> LinkedIn Professional
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 w-full">
          <div className="rounded-2xl bg-ink-900 border border-ink-700 shadow-2xl overflow-hidden font-mono text-sm">
            <div className="px-4 py-3 bg-ink-800 border-b border-ink-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              </div>
              <span className="text-xs text-mist-400 font-mono">engineer.sh</span>
              <div className="w-10" />
            </div>
            <div className="p-6 space-y-3 min-h-[260px] max-h-[320px] overflow-y-auto text-xs sm:text-sm">
              {displayedLines.map((line, idx) => (
                <div key={idx} className="leading-relaxed">
                  {line.type === 'prompt' ? (
                    <span className="text-signal font-semibold">{line.text}</span>
                  ) : (
                    <span className="text-amber font-medium">{line.text}</span>
                  )}
                </div>
              ))}
              {currentLineIndex < terminalLines.length && (
                <div className="leading-relaxed">
                  {terminalLines[currentLineIndex].type === 'prompt' ? (
                    <span className="text-signal font-semibold">
                      {terminalLines[currentLineIndex].text.substring(0, currentCharIndex)}
                    </span>
                  ) : (
                    <span className="text-amber font-medium">
                      {terminalLines[currentLineIndex].text.substring(0, currentCharIndex)}
                    </span>
                  )}
                  <span className="inline-block w-2 h-4 bg-signal ml-1 animate-pulse align-middle" />
                </div>
              )}
              {isFinished && (
                <div className="flex items-center gap-2 text-mist-400 pt-2">
                  <span className="text-signal">$</span>
                  <span className="inline-block w-2 h-4 bg-signal animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
