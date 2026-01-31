#!/bin/bash

# Script to import AWS Certified Cloud Practitioner articles to Hugo blog
# Usage: ./import-aws-articles.sh

SOURCE_DIR="/home/ahmad/Documents/blog/temp/1-Notes/AWS Certified Cloud Practitioner"
DEST_DIR="/home/ahmad/Documents/blog/content/posts"
ASSETS_SRC="$SOURCE_DIR/assets"
ASSETS_DEST="$DEST_DIR/assets/aws"

# Create assets destination folder
mkdir -p "$ASSETS_DEST"

# Copy all images to assets/aws/
echo "Copying images..."
cp -r "$ASSETS_SRC"/* "$ASSETS_DEST/" 2>/dev/null
echo "Images copied to $ASSETS_DEST"

# Get current date
CURRENT_DATE=$(date +%Y-%m-%d)

# Process each markdown file
echo ""
echo "Processing markdown files..."

for file in "$SOURCE_DIR"/*.md; do
    [ -f "$file" ] || continue

    # Get filename without path
    filename=$(basename "$file")

    # Extract title from filename (remove leading number and dot, remove .md)
    # e.g., "1. Cloud Computing.md" -> "Cloud Computing"
    title=$(echo "$filename" | sed 's/^[0-9]*\. //' | sed 's/\.md$//')

    # Create slug from title (lowercase, replace spaces with dashes)
    slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g' | sed 's/--*/-/g')
    slug="aws-ccp-${slug}"

    # Read the content
    content=$(cat "$file")

    # Remove first line if it starts with # (hashtags line)
    content=$(echo "$content" | sed '1{/^#[a-z]/d}')

    # Fix image paths: /1-Notes/AWS Certified Cloud Practitioner/assets/ -> /posts/assets/aws/
    content=$(echo "$content" | sed 's|/1-Notes/AWS%20Certified%20Cloud%20Practitioner/assets/|/posts/assets/aws/|g')
    content=$(echo "$content" | sed 's|/1-Notes/AWS Certified Cloud Practitioner/assets/|/posts/assets/aws/|g')

    # Remove image dimensions like |715x358 from ![|715x358](path)
    content=$(echo "$content" | sed 's/!\[|[0-9]*x[0-9]*\]/![]/g')

    # Create frontmatter
    frontmatter="---
title: \"AWS CCP - ${title}\"
draft: false
date: ${CURRENT_DATE}
description: \"AWS Certified Cloud Practitioner notes on ${title}\"
categories:
  - tech
tags:
  - aws
  - cloud
  - certification
Author: Ahmad Hassan
---"

    # Combine frontmatter and content
    output="${frontmatter}

${content}"

    # Write to destination
    dest_file="${DEST_DIR}/${slug}.md"
    echo "$output" > "$dest_file"

    echo "Created: $slug.md"
done

echo ""
echo "Done! All articles imported to $DEST_DIR"
echo "Images are in $ASSETS_DEST"
