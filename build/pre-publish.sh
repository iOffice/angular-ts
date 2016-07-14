#!/bin/bash

git checkout pre-release
git fetch --prune
git reset --hard origin/master

bash build/transpile.sh || exit 0
git add lib/ -f

git commit -m "pre-release"
git push origin pre-release -f

git checkout master
echo '[DONE]'
