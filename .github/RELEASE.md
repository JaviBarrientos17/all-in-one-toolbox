# 📦 Release Process

## Creating a New Release

### Option 1: Using Git Tags (Recommended)

1. Update version in `package.json`
2. Create and push a tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. GitHub Actions will automatically build and publish the release

### Option 2: Manual Trigger

1. Go to **Actions** → **Publish Windows Package**
2. Click **Run workflow**
3. Enter the version number (e.g., `1.0.0`)
4. Click **Run workflow**

## What Gets Published

The workflow creates:

1. **GitHub Release** with:
   - Release notes
   - Package metadata

2. **GitHub Packages** with:
   - Package metadata
   - Visible in the repository's Packages section

## Version Numbering

Follow semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

Examples: `1.0.0`, `1.1.0`, `1.1.1`

## System Requirements

This is a web-based application, no specific system requirements needed. Access through any modern browser.
