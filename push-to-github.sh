#!/bin/bash

echo "🚀 Pushing to GitHub..."
echo ""
echo "You'll need a GitHub Personal Access Token."
echo "If you don't have one, create it here: https://github.com/settings/tokens"
echo "Make sure to give it 'repo' permissions."
echo ""
echo "When prompted:"
echo "  Username: HBG20"
echo "  Password: [paste your Personal Access Token]"
echo ""

cd /Users/helenablasco/Data-landing-page
git push -u origin main

echo ""
echo "✅ Done! If successful, your code is now on GitHub."

