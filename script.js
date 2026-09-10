const fs = require('fs');
const path = require('path');

const mappings = [
  ['project-1.html', 'ecommerce-price-tracker'],
  ['project-2.html', 'tanzania-stock-prediction'],
  ['project-3.html', 'hardware-stores'],
  ['project-4.html', 'farm-management-system'],
  ['project-5.html', 'leadpulse-ai']
];

mappings.forEach(([file, slug]) => {
  const srcPath = path.join(process.cwd(), file);
  if (!fs.existsSync(srcPath)) {
    console.log('Not found:', file);
    return;
  }
  let c = fs.readFileSync(srcPath, 'utf8');
  c = c.replace(/href="css\/style\.css"/g, 'href="../../css/style.css"');
  c = c.replace(/src="\.\/assets\//g, 'src="../../assets/');
  c = c.replace(/href="\.\/assets\//g, 'href="../../assets/');
  c = c.replace(/href="\.\/index\.html"/g, 'href="../../index.html"');
  c = c.replace(/href="\.\/index\.html#/g, 'href="../../index.html#');
  c = c.replace(/href="\.\/services\.html"/g, 'href="../../services.html"');
  c = c.replace(/src="\.\/index\.js"/g, 'src="../../index.js"');
  c = c.replace(/src="index\.js"/g, 'src="../../index.js"');

  const destDir = path.join(process.cwd(), 'projects', slug);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'index.html'), c, 'utf8');
  fs.unlinkSync(srcPath);
  console.log('Moved', file, '-> projects/' + slug + '/index.html');
});
console.log('Reorganization complete.');
