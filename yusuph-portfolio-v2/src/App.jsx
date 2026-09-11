import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

export default function App() {
  return (
    <div className="min-h-screen bg-ink-950 text-mist-100 selection:bg-signal selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-ink-800">
          <h2 className="text-3xl font-display font-bold text-white mb-4">About Me</h2>
          <p className="text-mist-300">Placeholder for About section.</p>
        </section>
        <section id="skills" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-ink-800">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Technical Skills</h2>
          <p className="text-mist-300">Placeholder for Skills section.</p>
        </section>
        <section id="projects" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-ink-800">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-mist-300">Placeholder for Projects section.</p>
        </section>
        <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-ink-800">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-mist-300">Placeholder for Contact section.</p>
        </section>
      </main>
    </div>
  )
}
