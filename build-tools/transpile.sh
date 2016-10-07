#!/usr/bin/env bash

tsc \
  src/index.ts \
  typings/index.d.ts \
  --outDir lib \
  --declaration \
  --experimentalDecorators \
  --emitDecoratorMetadata \
  --target es3 \
  --noEmitHelpers
