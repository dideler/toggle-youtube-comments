#!/usr/bin/env bash

zip -9 -r $(date +%F_%H%M)-toggle-youtube-comments.zip . -x "*.git*" "*.md" "$0"
