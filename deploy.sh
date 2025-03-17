#!/bin/bash

echo "🚀 Starting CrowdSpin deployment..."

# Build the application
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Aborting deployment."
    exit 1
fi

# Create and switch to gh-pages branch
echo "🔄 Setting up gh-pages branch..."
git checkout -B gh-pages

# Move build files to root and clean up
echo "📋 Moving build files..."
mv dist/* .
rm -rf dist

# Ensure .nojekyll exists
echo "📄 Ensuring GitHub Pages configuration..."
touch .nojekyll

# Git operations
echo "🔄 Committing changes..."
git add .
git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

echo "⬆️ Pushing to GitHub..."
git push -f origin gh-pages

# Switch back to main branch
git checkout main

echo "✅ Deployment complete!"
echo "🌐 Your changes will be live at https://lukagrunt.github.io/crowdspin/ in a few minutes."
echo "   (GitHub Pages may take a few minutes to update)" 