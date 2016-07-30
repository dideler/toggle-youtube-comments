#!/usr/bin/env bash

zip -9 -r $(date +%F)-toggle-youtube-comments.zip . -x "*.git*" "*.md" "$0"
