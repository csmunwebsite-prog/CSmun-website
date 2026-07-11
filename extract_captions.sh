#!/bin/bash
# Extract caption track URLs from YouTube pages
for vid in ChzKEFkv7Dg yPOr9Xg28AU KTr4sDnE2zE lnjpnhQPrRI 4nOiPrbcxyM HCGKEtP3Rww GM_Dgj23ePs ddS9cCaxQiU nCxGlgpafFk -- -TmTYMbfWEs JhRlyvPQvLQ FaP76l7BbiQ 5vPlnSKTruA paF5ZmsvTUY U-M-3BBRe5o EMuLbPUZblE; do
  [ "$vid" = "--" ] && continue
  echo "=== $vid ==="
  page=$(curl -s "https://www.youtube.com/watch?v=$vid")
  # Extract captionTracks baseUrl
  baseurl=$(echo "$page" | sed 's/\\u0026/\&/g' | grep -oE '"captionTracks":\[.*?\]' | head -1 | grep -oE '"baseUrl":"[^"]*"' | head -1 | sed 's/"baseUrl":"//;s/"$//')
  if [ -n "$baseurl" ]; then
    echo "Fetching captions..."
    curl -s "$baseurl" | sed 's/<[^>]*>//g' | head -80
  else
    echo "No captions found"
  fi
  echo ""
done
