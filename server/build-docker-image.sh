#!/bin/bash

docker compose down

rm -rf dist
npm run build
docker build -t af-memory-game:1.0 .
