import os
import re

# Path to the directory containing markdown files
posts_dir = "/home/ahmad/Documents/blog/content/posts/"

# Matches any image path not starting with a slash
image_link_pattern = re.compile(r'(!\[[^\]]*\])\((?!/)([^)]+)\)')

print("Processing image links in Markdown files...")

# Process each markdown file
for filename in os.listdir(posts_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(posts_dir, filename)

        with open(filepath, "r") as file:
            content = file.read()

        # Add leading slash to image paths that don't start with one
        updated_content = image_link_pattern.sub(r"\1(/\\2)", content)
        updated_content = re.sub(r'\\/', '/', updated_content)  # Clean up any escaping

        # Write back only if there were changes
        if updated_content != content:
            with open(filepath, "w") as file:
                file.write(updated_content)
            print(f"✅ Updated: {filename}")
        else:
            print(f"⏩ Skipped (no changes): {filename}")

print("Done.")
