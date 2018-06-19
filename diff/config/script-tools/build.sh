#!/usr/bin/env bash

source util.sh

function baseBuild() {
  local nodeEnv=${1:-local}

  rm -rf ${buildDir}
  NODE_ENV=${nodeEnv} webpack --config config/webpack.prod.config.js --mode production
  
  _generateLog
}

if [ "$1" = "prod" ]
then
  shift 1
  set -- "production $*"
fi


echo "===== build $* ====="
resetDir
baseBuild $*