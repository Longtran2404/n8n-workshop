# Quick Deploy Script for N8N Workshop (PowerShell)
# Run this script to deploy to Vercel quickly

Write-Host "🚀 Starting N8N Workshop deployment..." -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Add all files
Write-Host "📦 Adding files to git..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Deploy: N8N Workshop platform with admin features and S3 integration"

# Check if remote exists
$remoteExists = $false
try {
    git remote get-url origin | Out-Null
    $remoteExists = $true
} catch {
    $remoteExists = $false
}

if (-not $remoteExists) {
    Write-Host "🔗 Please add your GitHub repository URL:" -ForegroundColor Red
    Write-Host "git remote add origin https://github.com/yourusername/n8n-workshop.git" -ForegroundColor Cyan
    Write-Host "Then run this script again." -ForegroundColor Red
    exit 1
}

# Push to GitHub
Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to vercel.com and import your GitHub repository" -ForegroundColor White
Write-Host "2. Set project name: 'n8n-workshop'" -ForegroundColor White  
Write-Host "3. Configure environment variables (see DEPLOYMENT.md)" -ForegroundColor White
Write-Host "4. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
