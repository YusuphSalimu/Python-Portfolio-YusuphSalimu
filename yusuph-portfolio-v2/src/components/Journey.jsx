import React, { useEffect, useRef, useState } from 'react'
import { Briefcase, GraduationCap, Cpu } from 'lucide-react'

const timelineItems = [
  {
    label: "Present & Ongoing",
    type: "signal",
    title: "Software Engineering Student",
    description: "Studying Software Engineering at the University of Dodoma, Tanzania. Building rigorous foundations in data structures, algorithms, system design, and software architecture.",
    icon: GraduationCap,
  },
  {
    label: "Full-Stack & Backend Systems",
    type: "neutral",
    title: "Java Spring Boot & Web Architecture",
    description: "Developing enterprise-grade applications such as the Farm Management System using Java, Spring Boot, Spring Data JPA, and PostgreSQL. Creating high-performance responsive platforms like Hardware Stores (React & Tailwind CSS).",
    icon: Briefcase,
  },
  {
    label: "Data Science & AI Engineering",
    type: "amber",
    title: "Machine Learning & Automated Systems",
    description: "Building predictive analytical tools for emerging markets (Tanzania Stock Prediction), automated web scrapers (E-commerce Price Tracker, Real Estate Scraper), and asynchronous multi-tenant SaaS platforms (LeadPulse AI with Django, Celery, and Redis).",
    icon: Cpu,
  },
]

export default function Journey() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section id="journey" ref={ref} className="py-24 md:py-32 bg-ink-950 relative overflow-hidden border-t border-ink-800">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800 border border-ink-700 text-signal-glow text-xs font-mono mb-4">
            // Milestones & Growth
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            Educational & Professional Journey
          </h2>
          <p className="text-base sm:text-lg text-mist-300 font-body leading-relaxed">
            Milestones in software engineering, backend systems development, data science, and practical projects.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 md:pl-10">
          {/* Vertical Line */}
          <div className="absolute top-3 bottom-3 left-2.5 md:left-4.5 w-0.5 bg-ink-700" />

          <div className="space-y-12">
            {timelineItems.map((item, idx) => {
              const Icon = item.icon
              let badgeStyle = "bg-ink-800 text-mist-200 border-ink-700"
              let dotStyle = "bg-ink-700 border-ink-600 text-mist-300"
              if (item.type === 'signal') {
                badgeStyle = "bg-signal/15 text-signal-glow border-signal/30 font-semibold"
                dotStyle = "bg-signal border-signal/50 text-white shadow-lg shadow-signal/30"
              } else if (item.type === 'amber') {
                badgeStyle = "bg-amber/15 text-amber border-amber/30 font-semibold"
                dotStyle = "bg-amber border-amber/50 text-ink-950 shadow-lg shadow-amber/30"
              } else {
                badgeStyle = "bg-ink-800 text-mist-200 border-ink-700 font-semibold"
                dotStyle = "bg-ink-700 border-ink-600 text-mist-200"
              }

              return (
                <div
                  key={idx}
                  className={`relative transition-all duration-700 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${idx * 200}ms` }}
                >
                  {/* Dot Marker */}
                  <div className={`absolute -left-6 md:-left-8.5 top-1.5 w-7 h-7 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center z-10 ${dotStyle}`}>
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>

                  {/* Content Card */}
                  <div className="rounded-2xl bg-ink-900 border border-ink-700 p-6 sm:p-8 shadow-xl hover:border-ink-600 transition-all">
                    {/* Label Tag */}
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider border ${badgeStyle}`}>
                        {item.label}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                      {item.title}
                    </h3>

                    <p className="text-sm sm:text-base text-mist-300 font-body leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
