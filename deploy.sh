#!/bin/bash

# Quick Deploy Script for N8N Workshop
# Run this script to deploy to Vercel quickly

echo "🚀 Starting N8N Workshop deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: N8N Workshop platform with admin features and S3 integration"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository URL:"
    echo "git remote add origin https://github.com/yourusername/n8n-workshop.git"
    echo "Then run this script again."
    exit 1
fi

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Go to vercel.com and import your GitHub repository"
echo "2. Set project name: 'n8n-workshop'"
echo "3. Configure environment variables (see DEPLOYMENT.md)"
echo "4. Deploy!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
