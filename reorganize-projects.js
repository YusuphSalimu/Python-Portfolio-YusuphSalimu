const fs = require('fs');
const path = require('path');

const mappings = [
  { file: 'project-1.html', slug: 'ecommerce-price-tracker' },
  { file: 'project-2.html', slug: 'tanzania-stock-prediction' },
  { file: 'project-3.html', slug: 'hardware-stores' },
  { file: 'project-4.html', slug: 'farm-management-system' },
  { file: 'project-5.html', slug: 'leadpulse-ai' }
];

mappings.forEach(m => {
  const srcPath = path.join(__dirname, m.file);
  if (!fs.existsSync(srcPath)) {
    console.log(`Source not found: ${m.file}`);
    return;
  }
  let content = fs.readFileSync(srcPath, 'utf8');

  // Replace relative paths for subfolder structure
  content = content.replace(/href="css\/style\.css"/g, 'href="../../css/style.css"');
  content = content.replace(/src="\.\/assets\//g, 'src="../../assets/');
  content = content.replace(/href="\.\/assets\//g, 'href="../../assets/');
  content = content.replace(/href="\.\/index\.html/g, 'href="../../index.html');
  content = content.replace(/href="\.\/services\.html/g, 'href="../../services.html');
  content = content.replace(/src="\.\/index\.js"/g, 'src="../../index.js"');
  content = content.replace(/src="index\.js"/g, 'src="../../index.js"');

  const destDir = path.join(__dirname, 'projects', m.slug);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const destPath = path.join(destDir, 'index.html');
  fs.writeFileSync(destPath, content, 'utf8');
  console.log(`Moved and updated ${m.file} -> projects/${m.slug}/index.html`);

  // Remove old file
  fs.unlinkSync(srcPath);
  console.log(`Removed old ${m.file}`);
});
console.log('Project reorganization completed successfully.');
