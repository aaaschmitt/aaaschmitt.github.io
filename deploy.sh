#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# go to the out directory and create a *new* Git repo
cd dist
git init

# inside this git repo we'll pretend to be a new user
git config --global user.name "Andy Schmitt"
git config --global user.email "aschmitt@berkeley.edu"

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git add .
git commit -m "Deploy to aaaschmitt.github.io via Travis CI"

# Force push from the current repo's master branch to the remote
# repo's gh-pages branch. (All previous history on the gh-pages branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${DEPLOY_TOKEN}@${GH_REF}" master > /dev/null 2>&1