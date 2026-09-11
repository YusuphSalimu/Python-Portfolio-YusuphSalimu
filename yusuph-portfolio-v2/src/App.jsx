import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Journey from './components/Journey'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-ink-950 text-mist-100 selection:bg-signal selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Journey />
        <Projects />
        <section id="skills" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-ink-800">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Technical Skills</h2>
          <p className="text-mist-300">Placeholder for Skills section.</p>
        </section>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
