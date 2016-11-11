buildTools:
	ts-compile build-tools --config build-tools/ts-publish.json

serve:
	live-server --port=3004 --open=./example

dev: buildTools
	webpack --config ./build/webpack.config.js --watch

karma: buildTools
	karma start ./build/karma.config.js --single-run

preRelease: buildTools
	ts-pre-release build/ts-hook.js

test: build-tools karma

start: serve dev
