#!/usr/bin/env bash

# Build the project
npm run build

# Navigate into the build output directory
cd dist

# Create a .nojekyll file to bypass Jekyll processing
touch .nojekyll

# Copy the CNAME file
cp ../public/CNAME .

# Deploy to GitHub Pages
git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/RiqCodedIt/prodriq-site.git main:gh-pages

cd - 