#!/bin/bash

# Migrate posts from flat .md files to leaf bundle format
# This script converts content/posts/*.md to content/posts/*/index.md with images

set -e

POSTS_DIR="content/posts"
STATIC_IMG_DIR="static/img/posts"
MIGRATED=0
SKIPPED=0

echo "🚀 Starting post migration to leaf bundle format..."
echo

# Get post name from markdown filename (remove .md extension)
# and also handle posts that might already be in subdirectories
for post_file in "$POSTS_DIR"/*.md; do
    [ -f "$post_file" ] || continue
    
    post_name=$(basename "$post_file" .md)
    post_dir="$POSTS_DIR/$post_name"
    
    # Skip if already a leaf bundle
    if [ -d "$post_dir" ]; then
        echo "⏭️  SKIP: $post_name (already leaf bundle)"
        ((SKIPPED++))
        continue
    fi
    
    echo "📝 Migrating: $post_name"
    
    # Create directory
    mkdir -p "$post_dir"
    
    # Move .md file to index.md
    mv "$post_file" "$post_dir/index.md"
    
    # Extract image path from front matter
    image_path=$(grep -A 5 "^cover:" "$post_dir/index.md" | grep "image:" | head -1 | sed 's/.*image: "\([^"]*\)".*/\1/')
    
    if [ -z "$image_path" ]; then
        echo "  ⚠️  No image path found in front matter"
        ((SKIPPED++))
        continue
    fi
    
    # Extract just the filename from the image path (e.g., "mooncakes.jpg" from "img/posts/mooncakes.jpg")
    image_file=$(basename "$image_path")
    static_image_path="$STATIC_IMG_DIR/$image_file"
    
    # Copy image if it exists in static directory
    if [ -f "$static_image_path" ]; then
        cp "$static_image_path" "$post_dir/"
        echo "  ✓ Copied image: $image_file"
    else
        echo "  ⚠️  Image not found: $static_image_path"
    fi
    
    # Update front matter: change "img/posts/filename.jpg" to just "filename.jpg"
    sed -i '' "s|image: \"img/posts/\([^\"]*\)\"|image: \"\1\"|g" "$post_dir/index.md"
    echo "  ✓ Updated front matter"
    
    ((MIGRATED++))
    echo
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Migration complete!"
echo "   Migrated: $MIGRATED posts"
echo "   Skipped:  $SKIPPED posts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "Next steps:"
echo "  1. review changes: git status"
echo "  2. rebuild: npm run build"
echo "  3. deploy: wrangler pages deploy dist"
