#!/bin/sh
UNIT_TEST_URL=http://$1/index.html?tapOutput=true;
BUILD_DIR="`dirname \"$0\"`"
phantomjs $BUILD_DIR/run_qunit.js $UNIT_TEST_URL
