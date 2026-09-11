import React from 'react'
import { ArrowRight, Terminal } from 'lucide-react'

const skillGroups = [
  {
    title: "Languages & Software Engineering",
    type: "signal",
    skills: ["Python", "Java", "JavaScript", "SQL"]
  },
  {
    title: "Backend & Web Systems",
    type: "neutral",
    skills: ["Spring Boot", "Django", "REST APIs", "Node.js", "React", "Tailwind CSS"]
  },
  {
    title: "Data Science & AI",
    type: "amber",
    skills: ["Machine Learning", "Scikit-learn", "Pandas & NumPy", "Selenium & BeautifulSoup", "Web Scraping", "Celery & Redis"]
  }
]

export default function About() {
  const handleScrollToContact = (e) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="about" className="py-24 md:py-32 bg-ink-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-signal/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header & Profile Avatar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800 border border-ink-700 text-signal-glow text-xs font-mono mb-4">
              // About
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Engineering robust web systems and data-driven intelligence
            </h2>
            <p className="text-base sm:text-lg text-mist-300 font-body leading-relaxed">
              I'm Yusuph Salimu, a Software Engineer and Data Scientist studying Software Engineering at the University of Dodoma, Tanzania. I specialize in building end-to-end digital solutions — from scalable backend architectures and full-stack web applications to automated scraping pipelines and predictive machine learning models. My work bridges clean, responsive frontend interfaces with reliable backend engineering, whether I'm architecting Spring Boot platforms, building Django SaaS products, or analyzing financial market data with Python.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-ink-900 border-2 border-ink-700 shadow-2xl overflow-hidden group">
              <img
                src="/yusuph-salimu.png"
                alt="Yusuph Salimu"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="text-xs font-mono text-signal-glow bg-ink-900/90 px-2.5 py-1 rounded-md border border-ink-700">
                  Yusuph Salimu
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Grouped Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {skillGroups.map((group, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-ink-900 border border-ink-700 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:border-ink-600 group"
            >
              {/* Terminal Chrome Bar */}
              <div className="px-4 py-3 bg-ink-800 border-b border-ink-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-mist-400">
                  <Terminal className="w-3.5 h-3.5 text-signal" />
                  <span>skills_env</span>
                </div>
              </div>

              {/* Panel Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
                    {group.title}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {group.skills.map((skill, sIdx) => {
                      let badgeStyle = "bg-ink-800 text-mist-200 border-ink-700"
                      if (group.type === 'signal') {
                        badgeStyle = "bg-signal/10 text-signal-glow border-signal/30 font-medium"
                      } else if (group.type === 'amber') {
                        badgeStyle = "bg-amber/10 text-amber border-amber/30 font-medium"
                      }
                      return (
                        <span
                          key={sIdx}
                          className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-mono border transition-colors ${badgeStyle}`}
                        >
                          {skill}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Let's Connect CTA */}
        <div className="flex justify-start">
          <a
            href="#contact"
            onClick={handleScrollToContact}
            className="px-8 py-4 rounded-xl bg-signal hover:bg-signal-dim text-white font-semibold text-base shadow-lg shadow-signal/25 inline-flex items-center gap-2 transition-all group"
          >
            Let's Connect
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
