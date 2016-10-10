#!/usr/bin/env bash

tsc \
  ./build-tools/karma.config.ts \
  --outDir build \
  --declaration \
  --experimentalDecorators \
  --emitDecoratorMetadata \
  --target es5 \
  --noEmitHelpers

tslint \
  ./build-tools/karma.config.ts
