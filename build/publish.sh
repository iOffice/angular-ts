#!/bin/bash

VERSION=$(node --eval "console.log(require('./package.json').version);")

git checkout -b build

bash build/transpile.sh || exit 0
git add lib/ -f

git commit -m "v$VERSION"

git tag v$VERSION -f
git push --tags -f

git checkout master
git branch -D build
