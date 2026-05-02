# GitHub Actions Integration Guide - Release Notes Generator

## Overview

This guide explains how to integrate the `generate-release-notes.py` script with GitHub Actions to automatically generate release notes when tags are pushed.

## Workflow File

**Location**: `.github/workflows/generate-release-notes.yml`

**Triggers**:
1. **Automatic**: When a tag matching `v*` is pushed
2. **Manual**: Via workflow dispatch with custom version and previous tag

## Features

### ✅ Automatic Triggers
- Detects new tags pushed to repository
- Extracts version from tag name
- Finds previous tag automatically
- Generates release notes
- Creates GitHub Release
- Commits notes to repository

### ✅ Manual Triggers
- Manually specify version
- Manually specify previous tag
- Create pull request with notes
- Useful for retroactive releases

### ✅ Outputs
- Release notes file (artifact)
- GitHub Release with notes
- Committed to docs/releases/
- Workflow summary

## How It Works

### Automatic Workflow (Tag Push)

```
1. Developer pushes tag (e.g., git push origin v4.0.0)
   ↓
2. GitHub Actions detects tag matching v*
   ↓
3. Workflow starts automatically
   ↓
4. Checkout code with full history
   ↓
5. Set up Python 3.11
   ↓
6. Extract version from tag
   ↓
7. Find previous tag automatically
   ↓
8. Run generate-release-notes.py
   ↓
9. Create GitHub Release with notes
   ↓
10. Commit notes to docs/releases/
   ↓
11. Workflow complete ✅
```

### Manual Workflow (Workflow Dispatch)

```
1. Go to Actions → Generate Release Notes
   ↓
2. Click "Run workflow"
   ↓
3. Enter version (e.g., 4.0.0)
   ↓
4. Enter previous tag (e.g., v3.0.0)
   ↓
5. Click "Run workflow"
   ↓
6. Workflow executes same steps
   ↓
7. Creates Pull Request instead of direct commit
   ↓
8. Review and merge PR
   ↓
9. Done ✅
```

## Usage

### Automatic Release (Recommended)

#### Step 1: Create and Push Tag
```bash
# Create tag locally
git tag v4.0.0

# Push tag to GitHub
git push origin v4.0.0
```

#### Step 2: Monitor Workflow
- Go to GitHub repository
- Click "Actions" tab
- Find "Generate Release Notes" workflow
- Watch execution in real-time

#### Step 3: Review Results
- Check GitHub Release page
- Review generated release notes
- Verify artifact uploaded
- Confirm docs committed

### Manual Release (For Retroactive Releases)

#### Step 1: Trigger Workflow Manually
1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Generate Release Notes" workflow
4. Click "Run workflow"
5. Enter version and previous tag
6. Click "Run workflow"

#### Step 2: Review Pull Request
- Workflow creates PR with notes
- Review changes
- Merge when ready

#### Step 3: Verify
- Check docs/releases/ folder
- Confirm notes committed
- Update GitHub Release manually if needed

## Configuration

### Modify Triggers

Edit `.github/workflows/generate-release-notes.yml` to change triggers:

```yaml
on:
  push:
    tags:
      - 'v*'              # Trigger on v* tags
      - 'release-*'       # Add more patterns
  workflow_dispatch:      # Allow manual trigger
```

### Change Output Location

Modify the commit step to change where notes are saved:

```yaml
- name: Commit release notes
  run: |
    mkdir -p docs/releases    # Change this path
    cp RELEASE_NOTES_*.md docs/releases/
```

### Customize Release Settings

Modify the GitHub Release step:

```yaml
- name: Create GitHub Release
  uses: softprops/action-gh-release@v1
  with:
    draft: false          # Set to true for draft releases
    prerelease: false     # Set to true for pre-releases
    files: |              # Add more files
      RELEASE_NOTES_*.md
      dist/*.exe
```

## Workflow Steps Explained

### 1. Checkout Code
```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Full history for commit analysis
```

### 2. Set up Python
```yaml
- name: Set up Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.11'
```

### 3. Determine Version
```yaml
- name: Determine version and previous tag
  id: version
  run: |
    # Extract version from tag or use input
    # Find previous tag
    # Set outputs for next steps
```

### 4. Generate Release Notes
```yaml
- name: Generate release notes
  run: |
    python3 generate-release-notes.py \
      -v ${{ steps.version.outputs.VERSION }} \
      -p ${{ steps.version.outputs.PREVIOUS_TAG }} \
      -o RELEASE_NOTES_*.md
```

### 5. Create GitHub Release
```yaml
- name: Create GitHub Release with notes
  uses: softprops/action-gh-release@v1
  with:
    body_path: RELEASE_NOTES_*.md
```

### 6. Commit to Repository
```yaml
- name: Commit release notes
  run: |
    git config user.email "action@github.com"
    git config user.name "GitHub Action"
    git add docs/releases/RELEASE_NOTES_*.md
    git commit -m "docs: Add release notes"
    git push
```

## Examples

### Example 1: Automatic Release

```bash
# Create and push tag
git tag v4.0.0
git push origin v4.0.0

# GitHub Actions automatically:
# 1. Detects tag
# 2. Generates release notes
# 3. Creates GitHub Release
# 4. Commits notes to docs/releases/
```

### Example 2: Manual Release

1. Go to Actions → Generate Release Notes
2. Click "Run workflow"
3. Enter:
   - Version: 4.0.0
   - Previous Tag: v3.0.0
4. Workflow creates PR
5. Review and merge

### Example 3: Retroactive Release

For old releases without tags:

```bash
# Create tag for old commit
git tag v2.0.0 abc1234

# Manually trigger workflow
# Enter version: 2.0.0
# Enter previous tag: v1.0.0
```

## Permissions

The workflow requires these permissions:

```yaml
permissions:
  contents: write        # Write to repository
  pull-requests: write   # Create pull requests
```

These are automatically granted when workflow runs.

## Artifacts

### Generated Files

1. **RELEASE_NOTES_X.Y.Z.md**
   - Location: Repository root
   - Also saved to: docs/releases/
   - Uploaded as artifact (30 days retention)

2. **GitHub Release**
   - Created automatically
   - Body contains release notes
   - Linked from Releases page

### Accessing Artifacts

1. Go to Actions tab
2. Find completed workflow run
3. Scroll to "Artifacts" section
4. Download "release-notes"

## Troubleshooting

### Issue: Workflow doesn't trigger on tag push

**Solution**: Verify tag format matches pattern
```bash
# Correct format
git tag v4.0.0

# Incorrect formats
git tag 4.0.0          # Missing 'v'
git tag release-4.0.0  # Doesn't match v* pattern
```

### Issue: "Previous tag not found"

**Solution**: Ensure previous tag exists
```bash
# List all tags
git tag -l

# Create missing tag if needed
git tag v3.0.0 <commit-hash>
git push origin v3.0.0
```

### Issue: Workflow fails with "Python not found"

**Solution**: Already handled by workflow
- Python 3.11 is set up automatically
- No additional setup needed

### Issue: Release notes not committed

**Solution**: Check GitHub Actions permissions
- Verify workflow has write permissions
- Check branch protection rules
- Ensure no merge conflicts

### Issue: GitHub Release not created

**Solution**: Verify GITHUB_TOKEN
- Token is automatically provided
- No manual setup needed
- Check workflow logs for errors

## Best Practices

### 1. Use Conventional Commits
```bash
git commit -m "feat: Add new feature"
git commit -m "fix: Resolve bug"
```

### 2. Create Tags Consistently
```bash
# Good
git tag v4.0.0
git tag v4.0.1
git tag v5.0.0-beta.1

# Avoid
git tag 4.0.0
git tag release-4.0.0
git tag latest
```

### 3. Review Before Merging
- Check generated release notes
- Verify formatting
- Ensure all commits categorized correctly
- Add manual notes if needed

### 4. Keep Documentation Updated
- Update CHANGELOG.md manually if needed
- Add migration guides
- Document breaking changes
- Include performance metrics

### 5. Test Workflow
```bash
# Test with manual trigger first
# Verify output before automatic releases
# Check artifacts and pull requests
```

## Advanced Configuration

### Add Email Notifications

```yaml
- name: Send notification
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: ${{ secrets.MAIL_SERVER }}
    server_port: ${{ secrets.MAIL_PORT }}
    username: ${{ secrets.MAIL_USERNAME }}
    password: ${{ secrets.MAIL_PASSWORD }}
    subject: "Release v${{ steps.version.outputs.VERSION }} published"
    to: team@example.com
    from: github-actions@example.com
    body: |
      Release notes generated for v${{ steps.version.outputs.VERSION }}
      View: https://github.com/${{ github.repository }}/releases
```

### Add Slack Notification

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Release v${{ steps.version.outputs.VERSION }} published",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Release Notes Generated\n*Version*: v${{ steps.version.outputs.VERSION }}"
            }
          }
        ]
      }
```

### Add Discord Notification

```yaml
- name: Notify Discord
  uses: sarisia/actions-status-discord@v1
  with:
    webhook_url: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
    title: "Release v${{ steps.version.outputs.VERSION }}"
    description: "Release notes generated successfully"
```

## Monitoring

### View Workflow Runs

1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Generate Release Notes"
4. View all runs with status

### Check Logs

1. Click on specific workflow run
2. Click "Generate release notes" job
3. Expand any step to see logs
4. Check for errors or warnings

### Monitor Performance

- Typical execution time: 30-60 seconds
- Python setup: 10-15 seconds
- Release notes generation: 2-5 seconds
- GitHub Release creation: 5-10 seconds
- Git commit: 5-10 seconds

## Integration with Other Workflows

### Combine with Build Workflow

```yaml
# In build workflow
- name: Generate release notes
  if: startsWith(github.ref, 'refs/tags/v')
  run: |
    python3 generate-release-notes.py \
      -v ${GITHUB_REF#refs/tags/v} \
      -p $(git describe --tags --abbrev=0 HEAD^)
```

### Combine with Deploy Workflow

```yaml
# In deploy workflow
- name: Get release notes
  run: |
    VERSION=${GITHUB_REF#refs/tags/v}
    cat RELEASE_NOTES_$VERSION.md
```

## Security

### Token Permissions

The workflow uses `GITHUB_TOKEN` which is:
- Automatically generated per workflow run
- Limited to repository scope
- Expires after workflow completes
- Secure and isolated

### No Credentials Exposed

- No API keys in workflow
- No personal tokens needed
- No credentials in logs
- Safe for public repositories

## Support

For issues:
1. Check this guide
2. Review workflow logs
3. Verify tag format
4. Check previous tags exist
5. Open GitHub issue

## Version History

### v1.0.0 (Current)
- ✅ Automatic tag-based trigger
- ✅ Manual workflow dispatch
- ✅ GitHub Release creation
- ✅ Repository commit
- ✅ Artifact upload
- ✅ Workflow summary

## Future Enhancements

- [ ] Slack notifications
- [ ] Discord notifications
- [ ] Email notifications
- [ ] Changelog auto-update
- [ ] Breaking changes detection
- [ ] Performance comparison
- [ ] Dependency updates tracking

---

**Last Updated**: May 2, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
