# Git Release Automation - Complete Guide

**Version**: 1.0  
**Date**: April 30, 2024  
**Project**: Pro Wrestling Sim v3.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Scripts Available](#scripts-available)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Configuration](#configuration)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Usage](#advanced-usage)

---

## Overview

The Git Release Automation scripts provide an automated way to manage the release workflow for Pro Wrestling Sim v3.0.0. These scripts handle:

- Staging all changes
- Creating commits with consistent messages
- Creating annotated tags
- Pushing commits and tags to remote
- Generating release checksums
- Triggering GitHub Actions workflows

### Available Scripts

| Script | Platform | Type | Purpose |
|--------|----------|------|---------|
| `git-release.sh` | Linux/Mac | Bash | Automated release with CLI options |
| `git-release.ps1` | Windows | PowerShell | Automated release with PowerShell |
| `git-release-interactive.sh` | Linux/Mac/Git Bash | Bash | Interactive menu-driven release |
| `git-release.config` | All | Config | Customizable settings |

---

## Quick Start

### Linux/Mac Users

```bash
# Make script executable (one-time)
chmod +x git-release.sh

# Run with default settings
./git-release.sh

# Or use interactive menu
./git-release-interactive.sh
```

### Windows Users

```powershell
# Run with default settings
.\git-release.ps1

# Or with custom options
.\git-release.ps1 -Message "Custom message" -Tag v3.0.1
```

---

## Scripts Available

### 1. git-release.sh (Bash - Linux/Mac)

**Features**:
- Command-line arguments
- Dry-run mode
- Verbose output
- Colored output
- Error handling
- Git validation

**File Size**: 9.7 KB  
**Executable**: Yes

**Usage**:
```bash
./git-release.sh [OPTIONS]
```

**Options**:
```
-m, --message MESSAGE    Commit message
-t, --tag TAG           Tag version
-b, --branch BRANCH     Branch to push to
-d, --dry-run          Preview without executing
-v, --verbose          Verbose output
-h, --help             Show help
```

### 2. git-release.ps1 (PowerShell - Windows)

**Features**:
- Parameter-based configuration
- Colored output
- Error handling
- Git validation
- Interactive prompts

**File Size**: 11.2 KB  
**Requires**: PowerShell 5.0+

**Usage**:
```powershell
.\git-release.ps1 [OPTIONS]
```

**Options**:
```
-Message TEXT       Commit message
-Tag VERSION        Tag version
-Branch NAME        Branch to push to
-DryRun            Preview without executing
-Help              Show help
```

### 3. git-release-interactive.sh (Interactive Menu)

**Features**:
- Interactive menu system
- Configuration management
- Dry-run preview
- Git status display
- User-friendly interface

**File Size**: 7.8 KB  
**Executable**: Yes

**Usage**:
```bash
./git-release-interactive.sh
```

**Menu Options**:
1. Quick Release
2. Configure Settings
3. Preview Changes (Dry Run)
4. View Git Status
5. Exit

### 4. git-release.config (Configuration File)

**Features**:
- Customizable defaults
- Well-documented options
- Multiple sections
- Easy to modify

**File Size**: 4.2 KB  
**Format**: Key=Value pairs

---

## Installation

### Prerequisites

- Git installed and configured
- Repository initialized
- Remote origin configured
- User has push permissions

### Setup Steps

1. **Clone or download scripts**:
   ```bash
   # Scripts are in the project root
   cd wrestling-sim-desktop-v2
   ```

2. **Make scripts executable** (Linux/Mac):
   ```bash
   chmod +x git-release.sh
   chmod +x git-release-interactive.sh
   ```

3. **Verify Git configuration**:
   ```bash
   git config user.name
   git config user.email
   ```

4. **Test with dry-run**:
   ```bash
   # Bash
   ./git-release.sh --dry-run
   
   # PowerShell
   .\git-release.ps1 -DryRun
   ```

---

## Usage

### Basic Usage

#### Linux/Mac - Automated Script

```bash
# Standard release
./git-release.sh

# With custom message
./git-release.sh -m "Release v3.0.0 with Windows build"

# With custom tag
./git-release.sh -t v3.0.1

# Dry run (preview)
./git-release.sh --dry-run

# Help
./git-release.sh -h
```

#### Windows - PowerShell Script

```powershell
# Standard release
.\git-release.ps1

# With custom message
.\git-release.ps1 -Message "Release v3.0.0"

# With custom tag
.\git-release.ps1 -Tag v3.0.1

# Dry run
.\git-release.ps1 -DryRun

# Help
.\git-release.ps1 -Help
```

#### Interactive Menu

```bash
./git-release-interactive.sh

# Then select options from menu:
# 1) Quick Release
# 2) Configure Settings
# 3) Preview Changes
# 4) View Git Status
# 5) Exit
```

### Workflow

All scripts follow this workflow:

```
1. Check git status
   ↓
2. Validate configuration
   ↓
3. Stage all changes (git add .)
   ↓
4. Create commit (git commit -m "...")
   ↓
5. Create tag (git tag -a ...)
   ↓
6. Push commits (git push origin BRANCH)
   ↓
7. Push tags (git push origin TAG)
   ↓
8. Display summary
```

---

## Configuration

### Using Configuration File

Edit `git-release.config` to set defaults:

```bash
# Edit configuration
nano git-release.config
# or
vim git-release.config
```

### Configuration Options

#### Release Information

```
COMMIT_MESSAGE=Release: Pro Wrestling Sim v3.0.0
TAG_VERSION=v3.0.0
BRANCH=main
```

#### Git Configuration

```
REMOTE=origin
CREATE_ANNOTATED_TAG=true
DELETE_EXISTING_TAG=false
```

#### Workflow Options

```
AUTO_STAGE=true
REQUIRE_CONFIRMATION=true
VERBOSE=false
DRY_RUN=false
```

#### GitHub Configuration

```
GITHUB_OWNER=Kreator8607
GITHUB_REPO=wrestling-sim-desktop
```

---

## Examples

### Example 1: Standard Release

```bash
./git-release.sh
```

**What happens**:
1. Checks git status
2. Shows changes to be committed
3. Asks for confirmation
4. Stages all changes
5. Creates commit
6. Creates tag
7. Pushes to remote
8. Shows summary

### Example 2: Custom Release with Message

```bash
./git-release.sh -m "Release v3.0.0 with build fixes" -t v3.0.0
```

**What happens**:
1. Uses custom message
2. Uses custom tag
3. Follows standard workflow
4. Displays summary

### Example 3: Dry Run (Preview)

```bash
./git-release.sh --dry-run
```

**What happens**:
1. Shows all steps that would be executed
2. Does NOT make any changes
3. Useful for verification

### Example 4: Interactive Menu

```bash
./git-release-interactive.sh
```

**What happens**:
1. Shows interactive menu
2. Allows configuration changes
3. Preview changes
4. Execute release
5. Show results

### Example 5: Windows PowerShell

```powershell
.\git-release.ps1 -Message "Release v3.0.0" -Tag v3.0.0 -Branch main
```

**What happens**:
1. Validates git configuration
2. Shows changes
3. Asks for confirmation
4. Executes workflow
5. Shows summary

---

## Troubleshooting

### Issue: "Not a git repository"

**Cause**: Script is not in a git repository  
**Solution**:
```bash
# Navigate to repository root
cd wrestling-sim-desktop-v2

# Verify git is initialized
git status
```

### Issue: "Git user.name not configured"

**Cause**: Git user not configured  
**Solution**:
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Issue: "Permission denied"

**Cause**: Script not executable  
**Solution**:
```bash
chmod +x git-release.sh
chmod +x git-release-interactive.sh
```

### Issue: "Failed to push commits"

**Cause**: Network issue or permission problem  
**Solution**:
```bash
# Check remote
git remote -v

# Test connection
git fetch origin

# Check permissions
git push origin main --dry-run
```

### Issue: "Tag already exists"

**Cause**: Tag version already created  
**Solution**:
```bash
# Option 1: Use different tag
./git-release.sh -t v3.0.1

# Option 2: Delete old tag
git tag -d v3.0.0
git push origin :refs/tags/v3.0.0

# Option 3: Use interactive menu (will ask to recreate)
./git-release-interactive.sh
```

### Issue: PowerShell execution policy error

**Cause**: PowerShell execution policy restricts scripts  
**Solution**:
```powershell
# Temporarily allow for this session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Then run script
.\git-release.ps1
```

---

## Advanced Usage

### Custom Commit Message

```bash
./git-release.sh -m "Release v3.0.0: Windows build, animations, themes"
```

### Multiple Tags

```bash
# Release v3.0.0
./git-release.sh -t v3.0.0

# Release v3.0.1 (patch)
./git-release.sh -t v3.0.1 -m "Patch: Build fixes"
```

### Different Branches

```bash
# Release to develop branch
./git-release.sh -b develop

# Release to production branch
./git-release.sh -b production
```

### Verbose Output

```bash
# Bash
./git-release.sh --verbose

# PowerShell
.\git-release.ps1 -Verbose
```

### Dry Run with Custom Settings

```bash
# Preview custom release
./git-release.sh -m "Custom message" -t v3.0.1 --dry-run
```

### Chaining with Other Commands

```bash
# Build and release
npm run build:win && ./git-release.sh

# Test and release
npm test && ./git-release.sh
```

---

## Best Practices

### Before Releasing

1. **Verify changes**:
   ```bash
   git status
   git diff
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Build locally**:
   ```bash
   npm run build:win
   ```

4. **Use dry-run**:
   ```bash
   ./git-release.sh --dry-run
   ```

### During Release

1. **Use meaningful messages**:
   ```bash
   ./git-release.sh -m "Release v3.0.0: Features, fixes, and improvements"
   ```

2. **Follow semantic versioning**:
   - Major: v3.0.0 (breaking changes)
   - Minor: v3.1.0 (new features)
   - Patch: v3.0.1 (bug fixes)

3. **Create annotated tags**:
   ```bash
   # Scripts use annotated tags by default
   git tag -a v3.0.0 -m "Release v3.0.0"
   ```

### After Release

1. **Monitor GitHub Actions**:
   - Check workflow status
   - Verify build completion
   - Download artifacts

2. **Verify release**:
   - Check GitHub Releases page
   - Verify checksums
   - Test executable

3. **Announce release**:
   - Update documentation
   - Notify users
   - Post on social media

---

## Script Comparison

| Feature | Bash | PowerShell | Interactive |
|---------|------|-----------|-------------|
| CLI Arguments | ✅ | ✅ | ❌ |
| Dry Run | ✅ | ✅ | ✅ |
| Menu Interface | ❌ | ❌ | ✅ |
| Configuration | ✅ | ✅ | ✅ |
| Colored Output | ✅ | ✅ | ✅ |
| Error Handling | ✅ | ✅ | ✅ |
| Git Validation | ✅ | ✅ | ✅ |
| Windows Compatible | ✅ (Git Bash) | ✅ | ✅ (Git Bash) |
| Linux Compatible | ✅ | ❌ | ✅ |
| Mac Compatible | ✅ | ❌ | ✅ |

---

## FAQ

### Q: Can I use these scripts on Windows?

**A**: Yes! Use `git-release.ps1` for native PowerShell, or use `git-release.sh` with Git Bash.

### Q: What if I make a mistake?

**A**: Use `--dry-run` to preview changes before executing. You can also undo with:
```bash
git reset --soft HEAD~1  # Undo commit
git tag -d v3.0.0       # Delete tag
git push origin --delete v3.0.0  # Delete remote tag
```

### Q: Can I customize the scripts?

**A**: Yes! Edit `git-release.config` to change defaults, or pass options via command-line arguments.

### Q: How do I schedule automatic releases?

**A**: Use cron (Linux/Mac) or Task Scheduler (Windows):
```bash
# Cron example (daily at 2 AM)
0 2 * * * cd /path/to/repo && ./git-release.sh
```

### Q: Can I use these with GitHub Actions?

**A**: Yes! The scripts integrate with GitHub Actions. Tags automatically trigger workflows.

---

## Support

For issues or questions:

1. Check this guide
2. Review script help: `./git-release.sh -h`
3. Check git status: `git status`
4. Review logs: `cat git-release.log`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Apr 30, 2024 | Initial release |

---

## License

These scripts are part of Pro Wrestling Sim v3.0.0 and are released under the MIT License.

---

**Last Updated**: April 30, 2024  
**Status**: ✅ Production Ready
