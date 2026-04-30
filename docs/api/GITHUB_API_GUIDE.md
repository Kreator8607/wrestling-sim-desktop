# GitHub Release Automation - Complete API Guide

**Version**: 1.0  
**Date**: April 30, 2024  
**Project**: Pro Wrestling Sim v3.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Scripts Available](#scripts-available)
4. [API Basics](#api-basics)
5. [Usage Examples](#usage-examples)
6. [Configuration](#configuration)
7. [Advanced Usage](#advanced-usage)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)

---

## Overview

The GitHub Release Automation scripts provide automated ways to create and manage releases using the GitHub API. These scripts handle:

- Creating releases with descriptions
- Uploading release assets
- Managing draft and pre-releases
- Verifying GitHub tokens
- Handling errors and retries
- Generating release notes

### Why Use These Scripts?

- **Automation**: Eliminate manual release creation
- **Consistency**: Standardized release format
- **Efficiency**: Fast release creation
- **Integration**: Works with CI/CD pipelines
- **Flexibility**: Multiple language options

---

## Getting Started

### Prerequisites

1. **GitHub Account**
   - Active GitHub account
   - Repository access

2. **Personal Access Token**
   - Create at: https://github.com/settings/tokens
   - Required scopes: `repo` (full control)
   - Keep token secure!

3. **Tools** (varies by script)
   - Bash: curl, jq
   - Python: requests library
   - PowerShell: PowerShell 5.0+

### Quick Start

#### Bash (Linux/Mac)
```bash
chmod +x github-release.sh
./github-release.sh -t YOUR_TOKEN
```

#### Python (All Platforms)
```bash
pip install requests
python3 github-release.py -t YOUR_TOKEN
```

#### PowerShell (Windows)
```powershell
.\github-release.ps1 -Token YOUR_TOKEN
```

---

## Scripts Available

### 1. github-release.sh (Bash)

**Platform**: Linux/Mac/Windows (Git Bash)  
**Size**: 14 KB  
**Dependencies**: curl, jq

**Features**:
- CLI arguments
- Dry-run mode
- Asset upload
- Error handling
- Colored output

**Usage**:
```bash
./github-release.sh [OPTIONS]
```

**Options**:
```
-o, --owner OWNER           GitHub owner
-r, --repo REPO            Repository name
-t, --token TOKEN          GitHub token (required)
-n, --tag-name TAG         Tag version
-N, --release-name NAME    Release name
-b, --body TEXT            Description
-B, --body-file FILE       Description file
-d, --draft               Draft release
-p, --prerelease          Pre-release
-a, --upload-assets DIR   Assets directory
--dry-run                 Preview
-v, --verbose             Verbose
-h, --help                Help
```

### 2. github-release.py (Python)

**Platform**: All (Python 3.6+)  
**Size**: 15 KB  
**Dependencies**: requests

**Features**:
- Object-oriented design
- Token verification
- Asset upload
- Error handling
- Colored output

**Usage**:
```bash
python3 github-release.py [OPTIONS]
```

**Options**:
```
-o, --owner OWNER           GitHub owner
-r, --repo REPO            Repository name
-t, --token TOKEN          GitHub token (required)
-n, --tag-name TAG         Tag version
-N, --release-name NAME    Release name
-b, --body TEXT            Description
-B, --body-file FILE       Description file
-d, --draft               Draft release
-p, --prerelease          Pre-release
-a, --upload-assets DIR   Assets directory
--dry-run                 Preview
-v, --verbose             Verbose
-h, --help                Help
```

### 3. github-release.ps1 (PowerShell)

**Platform**: Windows  
**Size**: 16 KB  
**Requirements**: PowerShell 5.0+

**Features**:
- Parameter-based
- Token verification
- Asset upload
- Error handling
- Colored output

**Usage**:
```powershell
.\github-release.ps1 [OPTIONS]
```

**Parameters**:
```
-Owner TEXT             GitHub owner
-Repo TEXT             Repository name
-Token TEXT            GitHub token (required)
-TagName TEXT          Tag version
-ReleaseName TEXT      Release name
-Body TEXT             Description
-BodyFile PATH         Description file
-Draft                Draft release
-PreRelease            Pre-release
-UploadAssets PATH     Assets directory
-DryRun               Preview
-Verbose              Verbose
-Help                 Help
```

---

## API Basics

### GitHub API Endpoint

```
https://api.github.com/repos/{owner}/{repo}/releases
```

### Authentication

All requests require authentication via personal access token:

```
Authorization: token YOUR_TOKEN
```

### Rate Limiting

- **Authenticated**: 5,000 requests/hour
- **Unauthenticated**: 60 requests/hour
- **Asset Upload**: No rate limit

### Content Type

```
Content-Type: application/json
Accept: application/vnd.github.v3+json
```

---

## Usage Examples

### Example 1: Basic Release

```bash
./github-release.sh -t YOUR_TOKEN
```

**What happens**:
1. Verifies token
2. Creates release with default settings
3. Displays summary

### Example 2: Release with Description

```bash
./github-release.sh \
  -t YOUR_TOKEN \
  -n "v3.0.0" \
  -N "Pro Wrestling Sim v3.0.0" \
  -b "Release with new features and bug fixes"
```

### Example 3: Release from File

```bash
./github-release.sh \
  -t YOUR_TOKEN \
  -B CHANGELOG.md
```

### Example 4: Draft Release

```bash
./github-release.sh \
  -t YOUR_TOKEN \
  -d \
  -b "Work in progress"
```

### Example 5: Pre-release

```bash
./github-release.sh \
  -t YOUR_TOKEN \
  -p \
  -b "Beta version for testing"
```

### Example 6: With Assets

```bash
./github-release.sh \
  -t YOUR_TOKEN \
  -a ./dist
```

### Example 7: Dry Run

```bash
./github-release.sh \
  -t YOUR_TOKEN \
  --dry-run
```

### Example 8: Python Version

```bash
python3 github-release.py \
  -t YOUR_TOKEN \
  -B CHANGELOG.md \
  -a ./dist
```

### Example 9: PowerShell Version

```powershell
.\github-release.ps1 `
  -Token YOUR_TOKEN `
  -BodyFile CHANGELOG.md `
  -UploadAssets ./dist
```

### Example 10: Full Release

```bash
./github-release.sh \
  -o Kreator8607 \
  -r wrestling-sim-desktop \
  -t YOUR_TOKEN \
  -n "v3.0.0" \
  -N "Pro Wrestling Sim v3.0.0" \
  -B RELEASE_NOTES.md \
  -a ./dist \
  -v
```

---

## Configuration

### Environment Variables

```bash
export GITHUB_TOKEN=YOUR_TOKEN
export GITHUB_OWNER=Kreator8607
export GITHUB_REPO=wrestling-sim-desktop
```

### Configuration File

Edit `github-release.config`:

```
GITHUB_OWNER=Kreator8607
GITHUB_REPO=wrestling-sim-desktop
RELEASE_TAG=v3.0.0
RELEASE_NAME=Pro Wrestling Sim v3.0.0
DRAFT=false
PRERELEASE=false
```

### Using Configuration

```bash
# Load from config file
source github-release.config
./github-release.sh -t $GITHUB_TOKEN
```

---

## Advanced Usage

### Uploading Multiple Assets

```bash
./github-release.sh \
  -t YOUR_TOKEN \
  -a ./dist
```

**Supported formats**:
- .exe (Windows executables)
- .zip (Compressed archives)
- .txt (Text files)
- .md (Markdown files)
- .pdf (PDF documents)

### Creating Draft Releases

```bash
./github-release.sh \
  -t YOUR_TOKEN \
  -d \
  -b "Draft for review"
```

**Benefits**:
- Not visible to public
- Can be edited before publishing
- Useful for testing

### Pre-release Versions

```bash
./github-release.sh \
  -t YOUR_TOKEN \
  -p \
  -n "v3.0.0-beta" \
  -b "Beta version for testing"
```

**Use cases**:
- Beta releases
- Release candidates
- Early access versions

### Automated Releases

```bash
# In CI/CD pipeline
./github-release.sh \
  -t $GITHUB_TOKEN \
  -n $VERSION \
  -B CHANGELOG.md \
  -a ./dist \
  --dry-run
```

### Batch Releases

```bash
# Create multiple releases
for version in v3.0.0 v3.0.1 v3.1.0; do
  ./github-release.sh \
    -t YOUR_TOKEN \
    -n "$version" \
    -N "Pro Wrestling Sim $version"
done
```

---

## Troubleshooting

### Issue: "Invalid GitHub token"

**Cause**: Token is invalid or expired  
**Solution**:
```bash
# Create new token at:
# https://github.com/settings/tokens

# Verify token:
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/user
```

### Issue: "Repository not found"

**Cause**: Wrong owner/repo or no access  
**Solution**:
```bash
# Verify repository exists
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/OWNER/REPO

# Check permissions
# Token must have 'repo' scope
```

### Issue: "Tag does not exist"

**Cause**: Tag not created yet  
**Solution**:
```bash
# Create tag first
git tag -a v3.0.0 -m "Release v3.0.0"
git push origin v3.0.0

# Then create release
./github-release.sh -t YOUR_TOKEN
```

### Issue: "Asset upload failed"

**Cause**: File too large or permission issue  
**Solution**:
```bash
# Check file size (max 2GB)
ls -lh dist/

# Verify permissions
chmod 644 dist/*

# Try uploading again
./github-release.sh -t YOUR_TOKEN -a ./dist
```

### Issue: "Rate limit exceeded"

**Cause**: Too many API requests  
**Solution**:
```bash
# Wait for rate limit reset
# Check remaining:
curl -H "Authorization: token YOUR_TOKEN" \
  -i https://api.github.com/user

# Look for X-RateLimit-Remaining header
```

### Issue: "curl: command not found"

**Cause**: curl not installed  
**Solution**:
```bash
# Ubuntu/Debian
sudo apt-get install curl

# macOS
brew install curl

# Windows (use Python or PowerShell version)
python3 github-release.py -t YOUR_TOKEN
```

### Issue: "jq: command not found"

**Cause**: jq not installed  
**Solution**:
```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq

# Windows (use Python or PowerShell version)
python3 github-release.py -t YOUR_TOKEN
```

---

## API Reference

### Create Release

**Endpoint**:
```
POST /repos/{owner}/{repo}/releases
```

**Request**:
```json
{
  "tag_name": "v3.0.0",
  "name": "Pro Wrestling Sim v3.0.0",
  "body": "Release description",
  "draft": false,
  "prerelease": false
}
```

**Response**:
```json
{
  "id": 123456,
  "tag_name": "v3.0.0",
  "name": "Pro Wrestling Sim v3.0.0",
  "body": "Release description",
  "draft": false,
  "prerelease": false,
  "created_at": "2024-04-30T12:00:00Z",
  "published_at": "2024-04-30T12:00:00Z",
  "url": "https://api.github.com/repos/Kreator8607/wrestling-sim-desktop/releases/123456",
  "html_url": "https://github.com/Kreator8607/wrestling-sim-desktop/releases/tag/v3.0.0"
}
```

### Upload Asset

**Endpoint**:
```
POST /repos/{owner}/{repo}/releases/{release_id}/assets
```

**Parameters**:
```
name=Pro-Wrestling-Sim-3.0.0.exe
```

**Headers**:
```
Content-Type: application/x-msdownload
```

**Response**:
```json
{
  "id": 789012,
  "name": "Pro-Wrestling-Sim-3.0.0.exe",
  "size": 165000000,
  "download_count": 0,
  "created_at": "2024-04-30T12:00:00Z",
  "updated_at": "2024-04-30T12:00:00Z",
  "browser_download_url": "https://github.com/Kreator8607/wrestling-sim-desktop/releases/download/v3.0.0/Pro-Wrestling-Sim-3.0.0.exe"
}
```

### Get Release

**Endpoint**:
```
GET /repos/{owner}/{repo}/releases/{release_id}
```

**Response**: Release object (same as create)

### List Releases

**Endpoint**:
```
GET /repos/{owner}/{repo}/releases
```

**Response**: Array of release objects

### Delete Release

**Endpoint**:
```
DELETE /repos/{owner}/{repo}/releases/{release_id}
```

---

## Best Practices

### Security

1. **Protect Your Token**
   - Never commit to repository
   - Use environment variables
   - Rotate tokens regularly

2. **Use Scoped Tokens**
   - Only grant necessary permissions
   - Use 'repo' scope for releases

3. **Verify Releases**
   - Check release on GitHub
   - Verify asset integrity
   - Test downloads

### Workflow

1. **Test with Dry Run**
   ```bash
   ./github-release.sh -t YOUR_TOKEN --dry-run
   ```

2. **Create Release**
   ```bash
   ./github-release.sh -t YOUR_TOKEN
   ```

3. **Verify on GitHub**
   - Check release page
   - Verify assets
   - Check description

4. **Announce Release**
   - Update documentation
   - Notify users
   - Post on social media

---

## Integration Examples

### GitHub Actions

```yaml
- name: Create Release
  run: |
    ./github-release.sh \
      -t ${{ secrets.GITHUB_TOKEN }} \
      -B CHANGELOG.md \
      -a ./dist
```

### Cron Job (Linux)

```bash
# Daily release at 2 AM
0 2 * * * cd /path/to/repo && ./github-release.sh -t $GITHUB_TOKEN
```

### CI/CD Pipeline

```bash
# After build completes
npm run build:win
./github-release.sh \
  -t $GITHUB_TOKEN \
  -a ./dist
```

---

## FAQ

### Q: Can I update an existing release?

**A**: No, use the GitHub UI or delete and recreate.

### Q: What's the maximum file size for assets?

**A**: 2 GB per file, no limit on total.

### Q: Can I upload to multiple releases?

**A**: Yes, run script multiple times with different tag names.

### Q: How do I schedule automatic releases?

**A**: Use cron jobs or GitHub Actions workflows.

### Q: Can I use these scripts in CI/CD?

**A**: Yes, all scripts support environment variables and automation.

---

## Support

For issues or questions:

1. Check this guide
2. Review script help: `./github-release.sh -h`
3. Check GitHub API docs: https://docs.github.com/en/rest
4. Create GitHub issue

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Apr 30, 2024 | Initial release |

---

**Status**: ✅ Production Ready  
**Last Updated**: April 30, 2024
