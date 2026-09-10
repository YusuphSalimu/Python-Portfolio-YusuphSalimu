import { projectsData } from './data/projects.js'


// --- Navigation & Mobile Menu ---
const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont')
const smallMenu = document.querySelector('.header__sm-menu')
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu')
const headerHamMenuCloseBtn = document.querySelector('.header__main-ham-menu-close')
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-link')

if (hamMenuBtn && smallMenu) {
  hamMenuBtn.setAttribute('role', 'button')
  hamMenuBtn.setAttribute('tabindex', '0')
  hamMenuBtn.setAttribute('aria-label', 'Open navigation menu')
  hamMenuBtn.setAttribute('aria-expanded', 'false')

  const toggleMenu = () => {
    const isExpanded = smallMenu.classList.toggle('header__sm-menu--active')
    hamMenuBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false')
    hamMenuBtn.setAttribute('aria-label', isExpanded ? 'Close navigation menu' : 'Open navigation menu')

    if (headerHamMenuBtn && headerHamMenuCloseBtn) {
      headerHamMenuBtn.classList.toggle('d-none', isExpanded)
      headerHamMenuCloseBtn.classList.toggle('d-none', !isExpanded)
    }
  }

  hamMenuBtn.addEventListener('click', toggleMenu)
  hamMenuBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleMenu()
    }
  })
}

if (headerSmallMenuLinks && headerSmallMenuLinks.length > 0) {
  headerSmallMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (smallMenu) {
        smallMenu.classList.remove('header__sm-menu--active')
        if (hamMenuBtn) {
          hamMenuBtn.setAttribute('aria-expanded', 'false')
          hamMenuBtn.setAttribute('aria-label', 'Open navigation menu')
        }
      }
      if (headerHamMenuBtn) headerHamMenuBtn.classList.remove('d-none')
      if (headerHamMenuCloseBtn) headerHamMenuCloseBtn.classList.add('d-none')
    })
  })
}

// --- Logo Click ---
const headerLogoConatiner = document.querySelector('.header__logo-container')
if (headerLogoConatiner) {
  headerLogoConatiner.addEventListener('click', () => {
    location.href = 'index.html'
  })
}

// --- Theme Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle')
const currentTheme = localStorage.getItem('theme') || 'dark'

function updateTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  if (themeToggleBtn) {
    themeToggleBtn.textContent = theme === 'light' ? '☀️' : '🌙'
    themeToggleBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme')
  }
}

updateTheme(currentTheme)

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme')
    updateTheme(activeTheme === 'light' ? 'dark' : 'light')
  })
}
// --- Dynamic Projects Rendering & Filtering ---
document.addEventListener('DOMContentLoaded', () => {
  const projectsContainer = document.getElementById('projects-container')
  const projectFiltersContainer = document.getElementById('project-filters')

  if (!projectsContainer) return

  try {
    function renderProjects(filterCategory = 'All') {
      projectsContainer.innerHTML = ''
      const filtered = filterCategory === 'All' 
        ? projectsData 
        : projectsData.filter(p => p.category === filterCategory)

      if (filtered.length === 0) {
        projectsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 1.6rem; padding: 4rem 0;">No projects found in this category.</p>'
        return
      }

      filtered.forEach(project => {
        const row = document.createElement('article')
        row.className = 'projects__row'
        
        const techBadges = project.technologies && project.technologies.length > 0 
          ? `<div style="display: flex; flex-wrap: wrap; gap: 0.8rem; margin-bottom: 2rem;">` + 
            project.technologies.map(t => `<span style="font-size: 1.2rem; font-weight: 600; background: var(--bg-card); color: var(--accent-primary); padding: 0.4rem 1rem; border-radius: 4px; border: 1px solid var(--border-color);">${t}</span>`).join('') + 
            `</div>` 
          : ''

        row.innerHTML = `
          <div class="projects__row-img-cont" style="aspect-ratio: 16 / 9; overflow: hidden; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card);">
            <img src="${project.image}" alt="${project.title} project screenshot" class="projects__row-img" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div class="projects__row-content">
            <span style="font-size: 1.3rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; display: inline-block;">${project.category}</span>
            <h3 class="projects__row-content-title" style="font-family: var(--font-display); font-size: 2.4rem; margin-bottom: 1.5rem; color: var(--text-primary);">${project.title}</h3>
            <p class="projects__row-content-desc" style="font-size: 1.6rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem;">${project.shortDescription}</p>
            ${techBadges}
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="${project.caseStudyUrl}" class="btn btn--med btn--theme dynamicBgClr" style="padding: 1.2rem 2.4rem; border-radius: 8px; font-weight: 700; font-size: 1.4rem; background: var(--accent-primary); color: #fff;" aria-label="View ${project.title} case study">View Project</a>
              ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--med btn--theme-inv" style="border: 2px solid var(--border-color); color: var(--text-primary); background: var(--bg-card); padding: 1.2rem 2.4rem; border-radius: 8px; font-weight: 700; font-size: 1.4rem;" aria-label="View ${project.title} source code on GitHub">GitHub</a>` : ''}
              ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--med btn--theme-inv" style="border: 2px solid var(--accent-primary); color: var(--accent-primary); background: var(--bg-card); padding: 1.2rem 2.4rem; border-radius: 8px; font-weight: 700; font-size: 1.4rem;" aria-label="View live demo of ${project.title}">Live Demo</a>` : ''}
            </div>
          </div>
        `
        projectsContainer.appendChild(row)
      })
    }

    if (projectFiltersContainer) {
      const categories = ['All', ...new Set(projectsData.map(p => p.category))]
      projectFiltersContainer.innerHTML = ''

      categories.forEach(cat => {
        const btn = document.createElement('button')
        btn.textContent = cat
        btn.className = cat === 'All' ? 'filter-btn active' : 'filter-btn'
        btn.setAttribute('aria-pressed', cat === 'All' ? 'true' : 'false')
        btn.style.cssText = `
          padding: 0.8rem 1.6rem;
          font-size: 1.4rem;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
          background: ${cat === 'All' ? 'var(--accent-primary)' : 'var(--bg-card)'};
          color: ${cat === 'All' ? '#ffffff' : 'var(--text-primary)'};
        `
        btn.addEventListener('click', () => {
          document.querySelectorAll('.filter-btn').forEach(b => {
            b.style.background = 'var(--bg-card)'
            b.style.color = 'var(--text-primary)'
            b.setAttribute('aria-pressed', 'false')
          })
          btn.style.background = 'var(--accent-primary)'
          btn.style.color = '#ffffff'
          btn.setAttribute('aria-pressed', 'true')
          renderProjects(cat)
        })
        projectFiltersContainer.appendChild(btn)
      })
    }

    renderProjects('All')
  } catch (err) {
    console.error('Error rendering dynamic projects:', err)
    projectsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 1.6rem; padding: 4rem 0;">Projects are currently unavailable. Please check back shortly.</p>'
  }
})


