import os
import re
from PIL import Image

# Paths
posts_dir = "/home/ahmad/Documents/blog/content/posts/"
assets_dir = os.path.join(posts_dir, "assets")

# Regex to find image links without leading slash
image_link_pattern = re.compile(r'!\[\]\((?!/)(posts/assets/[^)]+)\)')

print("🔍 Processing image links in Markdown files...\n")

# Step 1: Fix image links
for filename in os.listdir(posts_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(posts_dir, filename)

        with open(filepath, "r") as file:
            content = file.read()

        updated_content = image_link_pattern.sub(r"![](/\1)", content)

        if updated_content != content:
            with open(filepath, "w") as file:
                file.write(updated_content)
            print(f"✅ Updated links in: {filename}")

# Step 2: Convert images to webp
print("\n🖼️ Converting non-webp images to .webp...\n")

supported_formats = ('.png', '.jpg', '.jpeg')

for root, _, files in os.walk(assets_dir):
    for file in files:
        if file.lower().endswith(supported_formats):
            full_path = os.path.join(root, file)
            base_name, ext = os.path.splitext(file)
            webp_path = os.path.join(root, base_name + ".webp")

            if not os.path.exists(webp_path):
                try:
                    with Image.open(full_path) as img:
                        img.save(webp_path, "webp")
                    print(f"🟢 Converted: {file} ➜ {base_name}.webp")
                except Exception as e:
                    print(f"❌ Failed to convert {file}: {e}")

print("\n🎉 All image paths processed and conversions done.")
