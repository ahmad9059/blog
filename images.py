import os
import re

# Path to the directory containing markdown files
posts_dir = "/home/ahmad/Documents/blog/content/posts/"

# Regex to find image links without leading slash
image_link_pattern = re.compile(r'!\[\]\((?!/)(posts/assets/[^)]+)\)')

print("Processing image links in Markdown files...\n")

# Process each markdown file
for filename in os.listdir(posts_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(posts_dir, filename)

        with open(filepath, "r") as file:
            content = file.read()

        # Add leading slash to image paths that don't have it
        updated_content = image_link_pattern.sub(r"![](/\1)", content)

        # Write back only if changes were made
        if updated_content != content:
            with open(filepath, "w") as file:
                file.write(updated_content)
            print(f"✅ Updated: {filename}")

print("\Image paths updated successfully.")
