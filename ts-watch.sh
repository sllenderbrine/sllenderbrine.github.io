#!/bin/bash
cd "$(dirname "$(readlink -f "$0")")" || exit 1

gnome-terminal -- bash -lc '
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
npm run watch
exec bash
'