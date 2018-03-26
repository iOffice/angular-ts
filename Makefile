## Tasks

test: tcBuild

preRelease: build
  PRERELEASE=true tc-builder run

tcBuild: info build
  tc-builder run

docs: FORCE
  cd src; ../node_modules/.bin/typedoc --out ../docs main --target es6 --ignoreCompilerErrors --mode modules --module commonjs --hideGenerator --excludePrivate --name '@ioffice/angular-ts $(VERSION)'

serveDocs:
  cd docs; python -m SimpleHTTPServer 8000

## Dependencies

build: FORCE
  tc-builder build

clean:
  rm -rf build

info:
  node --version
  npm --version
  tsc --version
  typedoc --version

FORCE:
    