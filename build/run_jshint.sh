#!/bin/bash

# Run jshint using the junit-compatible reporter for Jenkins. 

set -ex;
rm -f jshint.xml;
set +e;
jshint src/ --jslint-reporter > jshint.xml;
set -e;
