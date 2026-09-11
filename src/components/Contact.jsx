import React, { useState } from 'react'
import { Terminal, Send, CheckCircle2, AlertCircle } from 'lucide-react'

const infoCards = [
  {
    title: "Software Engineering",
    description: "Full-stack applications, scalable backend systems, REST APIs, and responsive digital products."
  },
  {
    title: "Data Science & ML",
    description: "Predictive modeling, EDA, time-series forecasting, and automated web scrapers."
  },
  {
    title: "Freelance & Remote Work",
    description: "Open to remote roles, contract development, and technical startup consulting."
  }
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required.'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.'
    if (!formData.message.trim()) newErrors.message = 'Message is required.'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSubmitted(false)
    } else {
      setErrors({})
      setSubmitted(true)
  return (
    <section id="contact" className="py-24 md:py-32 bg-ink-950 relative overflow-hidden border-t border-ink-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800 border border-ink-700 text-signal-glow text-xs font-mono mb-4">// Get In Touch</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white mb-4">Let's Work Together</h2>
          <p className="text-base text-mist-300">I'm available for software engineering opportunities, data science projects, and freelance collaborations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {infoCards.map((c, i) => (
            <div key={i} className="rounded-2xl bg-ink-900 border border-ink-700 p-6 shadow-xl">
              <Terminal className="w-5 h-5 text-signal mb-4" />
              <h3 className="text-lg font-display font-bold text-white mb-2">{c.title}</h3>
              <p className="text-sm text-mist-300">{c.description}</p>
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto rounded-2xl bg-ink-900 border border-ink-700 p-8 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-display font-bold text-white">Message Sent Successfully!</h3>
              <p className="text-mist-300 text-sm">Thank you for reaching out. I'll get back to you promptly at yusuphsaalim@gmail.com.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-2.5 rounded-xl bg-ink-800 text-mist-100 text-sm font-semibold border border-ink-700">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-mist-300 mb-2">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Alex Johnson" className="w-full px-4 py-3 rounded-xl bg-ink-950 border border-ink-700 text-mist-100 text-sm focus:border-signal outline-none" />
                  {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-mist-300 mb-2">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="alex@company.com" className="w-full px-4 py-3 rounded-xl bg-ink-950 border border-ink-700 text-mist-100 text-sm focus:border-signal outline-none" />
                  {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-mist-300 mb-2">Subject *</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Project Inquiry" className="w-full px-4 py-3 rounded-xl bg-ink-950 border border-ink-700 text-mist-100 text-sm focus:border-signal outline-none" />
                {errors.subject && <p className="mt-1 text-xs text-rose-400">{errors.subject}</p>}
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-mist-300 mb-2">Message *</label>
                <textarea name="message" rows={5} value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." className="w-full px-4 py-3 rounded-xl bg-ink-950 border border-ink-700 text-mist-100 text-sm focus:border-signal outline-none resize-none" />
                {errors.message && <p className="mt-1 text-xs text-rose-400">{errors.message}</p>}
              </div>
              <button type="submit" className="w-full py-4 rounded-xl bg-signal hover:bg-signal-dim text-white font-semibold text-sm shadow-lg shadow-signal/25 flex items-center justify-center gap-2 cursor-pointer">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

      setFormData({ name: '', email: '', subject: '', message: '' })
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }
