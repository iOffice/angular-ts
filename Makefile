## Tasks

test: travis

preRelease: build
	PRERELEASE=true tc-builder run

travis: build
	tc-builder run


## Example

start:
	cd example; python -m SimpleHTTPServer 8001

dev:
	webpack --config ./example/webpack.config.ts --watch

## Dependencies

build: FORCE
	tc-builder compile

clean:
	rm -rf build

FORCE:
