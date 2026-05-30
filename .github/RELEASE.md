# 📦 Release Process

## Creating a New Release

### Option 1: Using Git Tags (Recommended)

1. Update version in `package.json` and `src-tauri/tauri.conf.json`
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
   - Windows NSIS Installer (`.exe`) - Recommended for most users
   - Windows MSI Installer (`.msi`) - Traditional installer
   - Release notes

2. **GitHub Packages** with:
   - Package metadata listing available installers
   - Visible in the repository's Packages section

## Version Numbering

Follow semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

Examples: `1.0.0`, `1.1.0`, `1.1.1`

## System Requirements

- Windows 10 (version 1809+) or Windows 11
- 64-bit processor

## Installers Comparison

| Installer | Format | Auto-update | Corporate | Size |
|-----------|--------|-------------|-----------|------|
| NSIS      | `.exe` | ✅ Yes      | ⚠️ Maybe  | Smaller |
| MSI       | `.msi` | ❌ No       | ✅ Yes    | Larger |

**Recommendation**: Use NSIS (`.exe`) for regular users, MSI for enterprise deployments.
