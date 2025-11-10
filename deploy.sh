#!/bin/bash

# Vercel Deployment Script
# Run this after completing 'vercel login'

echo "🚀 Starting Vercel deployment..."
echo ""

# Check if already logged in
if ! npx vercel whoami &>/dev/null; then
    echo "❌ Not logged in. Please run: npx vercel login"
    echo "   Then run this script again."
    exit 1
fi

echo "✅ Authenticated. Deploying to production..."
echo ""

# Deploy to production
npx vercel --yes --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your site should now be live at the URL shown above."






