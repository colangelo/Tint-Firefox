// web-ext configuration — controls what ships to AMO.
// Auto-loaded by `web-ext lint|build|sign` from the working directory.
// Only the extension itself should be packaged; everything below is excluded.
// (Hidden files/dirs like .git, .github, .amo.env are ignored by web-ext by default.)
module.exports = {
  ignoreFiles: [
    '**/*.md',            // README, CHANGELOG, CLAUDE.md, CLAUDE.local.md, ROADMAP, docs/*.md
    'LICENSE',
    'justfile',
    'package.sh',
    'icon.pxd',           // Pixelmator source
    'icon.png',           // master icon (shipped sizes live in icons/)
    'docs/**',
    'img/**',
    'screenshots/**',
    'web-ext-config.cjs',
    '*.xpi',
    '*.zip',
    '*-source.zip',
    'web-ext-artifacts/**',
  ],
};
