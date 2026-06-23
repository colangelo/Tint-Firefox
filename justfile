# Colorful Windows Enhanced - Project Management
# Run `just` to see available recipes

# Default recipe - show help
default:
    @just --list

# Package extension for Firefox AMO submission
package:
    ./package.sh

# Lint the extension with web-ext (same check CI runs)
lint:
    npx --yes web-ext@latest lint --source-dir .

# Submit the current source to AMO (listed channel). Creds pulled from 1Password.
# Reads op:// references from gitignored .amo.env; never writes secrets to disk.
submit:
    #!/usr/bin/env bash
    set -euo pipefail
    [ -f .amo.env ] || { echo "Missing .amo.env (see CLAUDE.local.md / amo-submit skill)"; exit 1; }
    source .amo.env
    echo "Submitting $(just version) to AMO (listed)..."
    export WEB_EXT_API_KEY="$(op read "$AMO_OP_USERNAME")"
    export WEB_EXT_API_SECRET="$(op read "$AMO_OP_PASSWORD")"
    npx --yes web-ext@latest sign --channel listed --source-dir .

# Bump version (usage: just bump 4.4.4)
bump version:
    @echo "Bumping version to {{version}}..."
    sed -i '' 's/"version": "[^"]*"/"version": "{{version}}"/' manifest.json
    @echo "Updated manifest.json to v{{version}}"
    @grep '"version"' manifest.json

# Build and package with version bump (usage: just release 4.4.4)
release version: (bump version) package
    @echo ""
    @echo "Release {{version}} ready for upload"

# Open Firefox debugging page
debug:
    open "about:debugging#/runtime/this-firefox"

# Validate manifest.json
validate:
    @echo "Validating manifest.json..."
    @python3 -c "import json; json.load(open('manifest.json')); print('✓ Valid JSON')"
    @grep -q '"id":' manifest.json && echo "✓ Has gecko.id" || echo "✗ Missing gecko.id"
    @grep -q '"data_collection_permissions"' manifest.json && echo "✓ Has data_collection_permissions" || echo "✗ Missing data_collection_permissions"

# Show current version
version:
    @grep '"version"' manifest.json | sed 's/.*: "\(.*\)".*/v\1/'

# Git status
status:
    git status --short

# Commit with message (usage: just commit "message")
commit message:
    git add -A
    git commit -m "{{message}}"

# Push to casomai remote
push:
    git push casomai main

# Push current branch to casomai
push-branch:
    git push casomai $(git branch --show-current)

# Clean build artifacts
clean:
    rm -f *.xpi *-source.zip
    @echo "Cleaned build artifacts"

# List package contents
inspect:
    @echo "=== XPI Contents ==="
    @unzip -l *.xpi 2>/dev/null | tail -n +4 | head -n -2 || echo "No .xpi file found"

# Show recent git log
log:
    git log --oneline -10

# Switch gh account to casomai
gh-casomai:
    command gh auth switch --user casomai

# Switch gh account to colangelo
gh-colangelo:
    command gh auth switch --user colangelo

# Full release workflow (usage: just full-release 4.4.4)
full-release version: clean (release version)
    @echo ""
    @echo "=== Release Checklist ==="
    @echo "1. Commit + push; merge dev -> main"
    @echo "2. git tag v{{version}} && git push origin v{{version}}   (CI: lint + build + GH Release)"
    @echo "3. just submit   (web-ext sign --channel listed -> AMO, creds from 1Password)"
