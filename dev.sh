#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

cat "$DIR/Dockerfile" | grep -v ^FROM | sed 's/^#FROM/FROM/' > "$DIR/Dockerfile.dev"

BUILD="`docker build -f "$DIR/Dockerfile.dev" "$DIR" | tail -n 1 | grep "Successfully built" | sed 's/.* //'`"

if [ "$BUILD" = "" ]; then
    echo "Build not successful; won't run"
else
    docker run "$BUILD"
fi
