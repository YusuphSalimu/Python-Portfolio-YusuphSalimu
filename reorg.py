import os

mappings = [
    ("project-1.html", "ecommerce-price-tracker"),
    ("project-2.html", "tanzania-stock-prediction"),
    ("project-3.html", "hardware-stores"),
    ("project-4.html", "farm-management-system"),
    ("project-5.html", "leadpulse-ai"),
]

for src, slug in mappings:
    if not os.path.exists(src):
        print(f"Source not found: {src}")
        continue
    
    with open(src, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace('href="css/style.css"', 'href="../../css/style.css"')
    content = content.replace('src="./assets/', 'src="../../assets/')
    content = content.replace('href="./assets/', 'href="../../assets/')
    content = content.replace('href="./index.html', 'href="../../index.html')
    content = content.replace('href="./services.html', 'href="../../services.html')
    content = content.replace('src="./index.js"', 'src="../../index.js"')
    content = content.replace('src="index.js"', 'src="../../index.js"')
    
    dest_dir = os.path.join("projects", slug)
    os.makedirs(dest_dir, exist_ok=True)
    dest_path = os.path.join(dest_dir, "index.html")
    
    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    os.remove(src)
    print(f"Moved {src} to {dest_path}")

print("Reorganization complete.")
