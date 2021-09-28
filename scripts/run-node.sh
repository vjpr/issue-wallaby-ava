#!/bin/sh

export SCRIPT_START_TIME=`date +"%Y-%m-%dT%H:%M:%S%z"`

# We run Node.js directly with following settings:

basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

# Use realpath otherwise it can be very long because of all the resolved symlinks.
pkgdir=$(realpath "$basedir/..")

# TODO(vjpr): Make more robust.
[[ $NO_LIVE_TRANSPILE = 1 ]] && CONDITIONS=node
CONDITIONS="${CONDITIONS:=transpile}"

node \
--no-warnings \
--experimental-loader=$pkgdir/node_modules/my-esm-loader/index.js \
--experimental-specifier-resolution=node \
--experimental-import-meta-resolve \
--experimental-vm-modules \
--conditions=$CONDITIONS \
"$@"
