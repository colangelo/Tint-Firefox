#!/bin/bash
# Package extension for Firefox AMO submission

set -e

cd "$(dirname "$0")"

VERSION=$(grep '"version"' manifest.json | sed 's/.*: "\(.*\)".*/\1/')
XPI_NAME="colorful-windows-enhanced-${VERSION}.xpi"
SRC_NAME="colorful-windows-enhanced-${VERSION}-source.zip"

# Clean up old packages
rm -f *.xpi *-source.zip

# Create .xpi (extension package)
zip -r "$XPI_NAME" \
  manifest.json \
  background.js \
  popup.html \
  popup.css \
  popup.js \
  color-picker.html \
  color-picker.js \
  color-utils.js \
  icons/ \
  -x "*.DS_Store"

# Create source.zip for code review
zip -r "$SRC_NAME" \
  manifest.json \
  background.js \
  popup.html \
  popup.css \
  popup.js \
  color-picker.html \
  color-picker.js \
  color-utils.js \
  icons/ \
  README.md \
  LICENSE \
  CLAUDE.md \
  -x "*.DS_Store"

echo ""
echo "Created packages for Firefox AMO submission:"
ls -lh "$XPI_NAME" "$SRC_NAME"
echo ""
echo "Next steps:"
echo "1. Go to https://addons.mozilla.org/en-US/developers/"
echo "2. Upload $XPI_NAME as the extension"
echo "3. Upload $SRC_NAME as the source code for review"
