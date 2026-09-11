import React, { useState } from 'react'
import { projects } from '../data/projects'
import { ExternalLink, Code, Eye, Terminal } from 'lucide-react'

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', ...new Set(projects.map(p => p.category))]
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="projects" className="py-24 md:py-32 bg-ink-950 relative overflow-hidden border-t border-ink-800">
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-signal/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800 border border-ink-700 text-signal-glow text-xs font-mono mb-4">
            // Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            Projects
          </h2>
          <p className="text-base sm:text-lg text-mist-300 font-body leading-relaxed">
            Showcasing real-world work across software engineering, backend systems, data science, and AI automation.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-signal text-white shadow-lg shadow-signal/25'
                  : 'bg-ink-900 text-mist-300 border border-ink-700 hover:border-ink-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-ink-900 border border-ink-700 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-ink-600 group"
            >
              <div className="px-4 py-3 bg-ink-800 border-b border-ink-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-mist-400 truncate max-w-[240px] sm:max-w-xs">
                  <Terminal className="w-3.5 h-3.5 text-signal flex-shrink-0" />
                  <span className="truncate">{project.category.toLowerCase().replace(/[\s&]+/g, '_')}.py</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-signal uppercase tracking-wider mb-2">
                    {project.category}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3 group-hover:text-signal-glow transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-mist-300 font-body leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-ink-800 text-mist-300 border border-ink-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-ink-800">
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg bg-ink-800 text-mist-500 border border-ink-700 text-xs font-semibold uppercase tracking-wider cursor-not-allowed flex items-center gap-1.5 opacity-60"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Project
                  </button>
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg bg-ink-800 text-mist-500 border border-ink-700 text-xs font-semibold uppercase tracking-wider cursor-not-allowed flex items-center gap-1.5 opacity-60"
                  >
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </button>
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg bg-ink-800 text-mist-500 border border-ink-700 text-xs font-semibold uppercase tracking-wider cursor-not-allowed flex items-center gap-1.5 opacity-60"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
