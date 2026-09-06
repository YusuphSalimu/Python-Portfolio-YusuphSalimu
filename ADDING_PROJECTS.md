# Adding New Projects to the Portfolio

This guide explains how to add a new project (e.g., Project #6, #7) to your portfolio while maintaining the centralized data architecture and automatic homepage rendering.

---

## Step 1: Prepare Project Assets
1. Place your project showcase screenshot image inside the `./assets/jpeg/` or `./assets/png/` folder (recommended format: `.jpg`, `.png`, or `.webp`, 16:9 aspect ratio).

---

## Step 2: Add Project Data to `data/projects.js`
Open `data/projects.js` and append a new project object to the `projectsData` array:

```javascript
  {
    id: 6,
    title: "Your New Project Title",
    slug: "your-new-project-slug",
    category: "Web Development", // or "Data Science & Machine Learning", "Backend & Full-Stack", etc.
    shortDescription: "A brief 2-3 sentence overview of what the project does and the problem it solves.",
    fullDescription: "Comprehensive description of the project background, technical challenges, and implementation approach.",
    technologies: ["Python", "React", "Node.js", "PostgreSQL"],
    image: "./assets/jpeg/your-project-image.jpg",
    githubUrl: "https://github.com/YusuphSalimu/your-repo-name",
    demoUrl: "https://your-demo-url.onrender.com",
    caseStudyUrl: "./project-6.html", // Optional: create a case study page if needed
    featured: true,
    year: "2026"
  }
```

---

## Step 3: (Optional) Create a Dedicated Case Study Page
If you want a standalone case study page for the project:
1. Copy an existing case study file (e.g., `project-1.html`) and rename it to `project-6.html`.
2. Update the page title, meta description, hero heading, overview paragraphs, tools used, and links (`View Code` and `Live Demo`).

---

## Step 4: Test Locally
1. Run your local development preview:
   ```bash
   npm start
   ```
2. Open `http://localhost:3000` in your browser to verify that the new project card appears correctly in the Projects section with proper spacing, alignment, and working links.

---

## Step 5: Commit and Deploy
1. Check your git status:
   ```bash
   git status
   ```
2. Stage and commit your changes:
   ```bash
   git add .
   git commit -m "Add Project 6: [Project Title]"
   ```
3. Push to GitHub:
   ```bash
   git push origin main
   ```
4. Render will automatically detect the commit and deploy your updated portfolio live!
