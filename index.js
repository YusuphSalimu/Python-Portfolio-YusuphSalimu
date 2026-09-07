import { projectsData } from './data/projects.js'


// ---
const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont')
const smallMenu = document.querySelector('.header__sm-menu')
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu')
const headerHamMenuCloseBtn = document.querySelector(
  '.header__main-ham-menu-close'
)
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-link')

hamMenuBtn.addEventListener('click', () => {
  if (smallMenu.classList.contains('header__sm-menu--active')) {
    smallMenu.classList.remove('header__sm-menu--active')
  } else {
    smallMenu.classList.add('header__sm-menu--active')
  }
  if (headerHamMenuBtn.classList.contains('d-none')) {
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  } else {
    headerHamMenuBtn.classList.add('d-none')
    headerHamMenuCloseBtn.classList.remove('d-none')
  }
})

for (let i = 0; i < headerSmallMenuLinks.length; i++) {
  headerSmallMenuLinks[i].addEventListener('click', () => {
    smallMenu.classList.remove('header__sm-menu--active')
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  })
}

// ---
const headerLogoConatiner = document.querySelector('.header__logo-container')

headerLogoConatiner.addEventListener('click', () => {
  location.href = 'index.html'
})

// --- Theme Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle')
const currentTheme = localStorage.getItem('theme') || 'dark'

if (currentTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light')
  if (themeToggleBtn) themeToggleBtn.textContent = '☀️'
} else {
  document.documentElement.setAttribute('data-theme', 'dark')
  if (themeToggleBtn) themeToggleBtn.textContent = '🌙'
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme')
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
      themeToggleBtn.textContent = '🌙'
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
      themeToggleBtn.textContent = '☀️'
    }
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
        const row = document.createElement('div')
        row.className = 'projects__row'
        
        const techBadges = project.technologies && project.technologies.length > 0 
          ? `<div style="display: flex; flex-wrap: wrap; gap: 0.8rem; margin-bottom: 2rem;">` + 
            project.technologies.map(t => `<span style="font-size: 1.2rem; font-weight: 600; background: var(--bg-card); color: var(--accent-primary); padding: 0.4rem 1rem; border-radius: 4px; border: 1px solid var(--border-color);">${t}</span>`).join('') + 
            `</div>` 
          : ''

        row.innerHTML = `
          <div class="projects__row-img-cont">
            <img src="${project.image}" alt="${project.title} project screenshot" class="projects__row-img" loading="lazy" />
          </div>
          <div class="projects__row-content">
            <span style="font-size: 1.3rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; display: inline-block;">${project.category}</span>
            <h3 class="projects__row-content-title">${project.title}</h3>
            <p class="projects__row-content-desc">${project.shortDescription}</p>
            ${techBadges}
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="${project.caseStudyUrl}" class="btn btn--med btn--theme dynamicBgClr" aria-label="View ${project.title} case study">View Project</a>
              ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--med btn--theme-inv" style="border: 2px solid var(--border-color); color: var(--text-primary); padding: 1.2rem 2.4rem; border-radius: 8px; font-weight: 700; font-size: 1.4rem;">View Code</a>` : ''}
              ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--med btn--theme-inv" style="border: 2px solid var(--accent-primary); color: var(--accent-primary); padding: 1.2rem 2.4rem; border-radius: 8px; font-weight: 700; font-size: 1.4rem;">Live Demo</a>` : ''}
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
          })
          btn.style.background = 'var(--accent-primary)'
          btn.style.color = '#ffffff'
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


