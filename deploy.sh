#!/bin/bash

echo "🚀 Starting CrowdSpin deployment..."

# Build the application
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Aborting deployment."
    exit 1
fi

# Deploy to GitHub Pages repository
echo "📁 Setting up GitHub Pages deployment..."
git add .
git commit -m "Update CrowdSpin - $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

# Deploy to custom domain
echo "📁 Setting up custom domain deployment..."
mkdir -p ../lukagrunt.com/crowdspin

# Clean the existing files
echo "🧹 Cleaning old files..."
rm -rf ../lukagrunt.com/crowdspin/*

# Copy the built files to the crowdspin directory
echo "📋 Copying new files..."
cp -r dist/* ../lukagrunt.com/crowdspin/

# Navigate to the domain directory
cd ../lukagrunt.com

# Ensure .nojekyll exists
touch .nojekyll

# Git operations for custom domain
echo "🔄 Committing changes to custom domain..."
git add crowdspin .nojekyll
git commit -m "Update CrowdSpin - $(date '+%Y-%m-%d %H:%M:%S')"
git push

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to custom domain! Please check your git configuration."
    exit 1
fi

# Navigate back to the project directory
cd ../CrowdSpin

echo "✅ Deployment complete!"
echo "🌐 Your changes will be live at:"
echo "   - https://lukagrunt.github.io/CrowdSpin/"
echo "   - https://lukagrunt.com/crowdspin/"
echo "   (Changes may take a few minutes to propagate)" 