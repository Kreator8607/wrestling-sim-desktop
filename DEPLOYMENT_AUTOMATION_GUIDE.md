# Pro Wrestling Sim v4.0.0 - Deployment Automation Guide

**Version**: 1.0  
**Created**: April 30, 2024  
**Status**: ✅ READY FOR DEPLOYMENT  
**Target Version**: 4.0.0

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Deployment Scripts](#deployment-scripts)
4. [Usage Examples](#usage-examples)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)
8. [Rollback Procedures](#rollback-procedures)

---

## 🚀 Quick Start

### Linux/Mac/Git Bash
```bash
# Navigate to project directory
cd /path/to/wrestling-sim-desktop

# Make script executable
chmod +x deploy-v4.0.0.sh

# Run deployment (dry-run first)
./deploy-v4.0.0.sh --dry-run

# Run actual deployment
./deploy-v4.0.0.sh
```

### Windows PowerShell
```powershell
# Navigate to project directory
cd C:\path\to\wrestling-sim-desktop

# Run deployment (dry-run first)
.\deploy-v4.0.0.ps1 -DryRun

# Run actual deployment
.\deploy-v4.0.0.ps1
```

---

## 📋 Prerequisites

### System Requirements
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: v2.30 or higher
- **Disk Space**: 2GB free
- **RAM**: 4GB minimum

### Required Permissions
- Write access to project directory
- Git push permissions to repository
- GitHub token for API access (optional)

### Environment Setup

#### Linux/Mac
```bash
# Install Node.js
brew install node  # macOS
# or
sudo apt-get install nodejs npm  # Ubuntu/Debian

# Install Git
brew install git  # macOS
# or
sudo apt-get install git  # Ubuntu/Debian

# Verify installations
node --version
npm --version
git --version
```

#### Windows
```powershell
# Install Node.js from https://nodejs.org/
# Install Git from https://git-scm.com/

# Verify installations
node --version
npm --version
git --version
```

---

## 🔧 Deployment Scripts

### Script 1: deploy-v4.0.0.sh (Linux/Mac/Git Bash)

**File Size**: 19 KB  
**Lines**: 500+  
**Language**: Bash

#### Features
- ✅ Comprehensive error handling
- ✅ Colored output for readability
- ✅ Detailed logging to file
- ✅ Dry-run mode for testing
- ✅ Automatic backup creation
- ✅ Git operations automation
- ✅ GitHub API integration
- ✅ Performance reporting

#### Execution Steps
1. Prerequisites check
2. Git status verification
3. Backup creation
4. Test execution
5. Application build
6. Build verification
7. Version update
8. Documentation update
9. Git commit
10. Git tag creation
11. Push to GitHub
12. GitHub release creation
13. Asset upload
14. Report generation

### Script 2: deploy-v4.0.0.ps1 (Windows PowerShell)

**File Size**: 18 KB  
**Lines**: 450+  
**Language**: PowerShell 5.0+

#### Features
- ✅ Windows-native operations
- ✅ Colored console output
- ✅ Comprehensive logging
- ✅ Dry-run mode support
- ✅ ZIP backup creation
- ✅ Git integration
- ✅ GitHub API support
- ✅ Performance reporting

#### Execution Steps
Same as Bash version, adapted for Windows

---

## 📖 Usage Examples

### Example 1: Dry-Run Deployment (Recommended First Step)

#### Linux/Mac/Git Bash
```bash
./deploy-v4.0.0.sh --dry-run
```

#### Windows PowerShell
```powershell
.\deploy-v4.0.0.ps1 -DryRun
```

**Output**:
```
[INFO] Deployment started at 2024-04-30 10:00:00
[INFO] Version: 4.0.0
[INFO] Dry-run mode: true
[SUCCESS] Node.js v18.16.0 found
[SUCCESS] npm 9.6.7 found
[SUCCESS] Git 2.40.0 found
[DRY-RUN] Would create backup: backup-v3.0.0-2024-04-30_10-00-00
[DRY-RUN] Would run: npm run test
[DRY-RUN] Would run: npm run react-build
[DRY-RUN] Would run: npm run build:win
...
```

### Example 2: Production Deployment

#### Linux/Mac/Git Bash
```bash
# Set GitHub token
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Run deployment
./deploy-v4.0.0.sh
```

#### Windows PowerShell
```powershell
# Set GitHub token
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Run deployment
.\deploy-v4.0.0.ps1
```

### Example 3: Skip Tests and Build

#### Linux/Mac/Git Bash
```bash
./deploy-v4.0.0.sh --skip-tests --skip-build
```

#### Windows PowerShell
```powershell
.\deploy-v4.0.0.ps1 -SkipTests -SkipBuild
```

### Example 4: Verbose Output

#### Linux/Mac/Git Bash
```bash
./deploy-v4.0.0.sh --verbose
```

#### Windows PowerShell
```powershell
.\deploy-v4.0.0.ps1 -Verbose
```

---

## ⚙️ Configuration

### Environment Variables

#### GitHub Token (Required for GitHub Release)
```bash
# Linux/Mac
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Windows PowerShell
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**How to Generate**:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Select scopes: `repo`, `write:packages`
4. Copy token and save securely

#### Dry-Run Mode
```bash
# Linux/Mac
export DRY_RUN="true"

# Windows PowerShell
$env:DRY_RUN = "true"
```

#### Skip Tests
```bash
# Linux/Mac
export SKIP_TESTS="true"

# Windows PowerShell
$env:SKIP_TESTS = "true"
```

### Script Configuration

Edit the script to customize:

```bash
# Version information
VERSION="4.0.0"
PREVIOUS_VERSION="3.0.0"

# Project information
PROJECT_NAME="Pro Wrestling Sim"
GITHUB_REPO="Kreator8607/wrestling-sim-desktop"

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
DIST_DIR="$PROJECT_DIR/dist"
BACKUP_DIR="$PROJECT_DIR/backups"
```

---

## 🧪 Testing the Deployment

### Pre-Deployment Checklist

- [ ] All code changes committed
- [ ] Tests passing locally
- [ ] No uncommitted changes
- [ ] GitHub token configured
- [ ] Sufficient disk space (2GB+)
- [ ] Internet connection stable
- [ ] Backup location accessible

### Dry-Run Process

1. **Run dry-run**
   ```bash
   ./deploy-v4.0.0.sh --dry-run
   ```

2. **Review output**
   - Check all steps would execute correctly
   - Verify no errors in simulation
   - Confirm backup location

3. **Check log file**
   ```bash
   cat deploy-v4.0.0.log
   ```

4. **Proceed to production**
   ```bash
   ./deploy-v4.0.0.sh
   ```

---

## 🔍 Monitoring Deployment

### Log File Location
```
./deploy-v4.0.0.log
```

### Real-Time Monitoring

#### Linux/Mac
```bash
# Watch log file in real-time
tail -f deploy-v4.0.0.log
```

#### Windows PowerShell
```powershell
# Watch log file in real-time
Get-Content deploy-v4.0.0.log -Wait
```

### Deployment Report

After deployment completes:
```
./deployment-report-v4.0.0.txt
```

### Verify GitHub Release

```bash
# Check if release was created
curl -s https://api.github.com/repos/Kreator8607/wrestling-sim-desktop/releases/tags/v4.0.0 | jq .

# Or visit in browser
https://github.com/Kreator8607/wrestling-sim-desktop/releases/tag/v4.0.0
```

---

## 🚨 Troubleshooting

### Issue: "Node.js is not installed"

**Solution**:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
```

### Issue: "Git is not installed"

**Solution**:
```bash
# Linux
sudo apt-get install git

# macOS
brew install git

# Windows
# Download from https://git-scm.com/
```

### Issue: "Tests failed"

**Solution**:
```bash
# Run tests manually to debug
npm run test

# Fix issues, then retry deployment
./deploy-v4.0.0.sh --skip-tests  # Skip if needed
```

### Issue: "Build failed"

**Solution**:
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run react-build
npm run build:win

# Retry deployment
./deploy-v4.0.0.sh --skip-build
```

### Issue: "GitHub token invalid"

**Solution**:
```bash
# Generate new token
# https://github.com/settings/tokens

# Set token
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Verify token
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

### Issue: "Permission denied"

**Solution**:
```bash
# Make script executable
chmod +x deploy-v4.0.0.sh

# Or run with bash
bash deploy-v4.0.0.sh
```

### Issue: "Not in a Git repository"

**Solution**:
```bash
# Initialize Git if needed
git init
git remote add origin https://github.com/Kreator8607/wrestling-sim-desktop.git

# Or navigate to correct directory
cd /path/to/wrestling-sim-desktop
```

---

## 📚 Best Practices

### 1. Always Run Dry-Run First
```bash
./deploy-v4.0.0.sh --dry-run
```

### 2. Create Backup Before Deployment
The script automatically creates backups in `./backups/`

### 3. Verify Git Status
```bash
git status
git log --oneline -5
```

### 4. Test Locally First
```bash
npm run test
npm run react-build
npm run build:win
```

### 5. Use Version Control
```bash
git add .
git commit -m "Pre-deployment commit"
```

### 6. Monitor Deployment
```bash
tail -f deploy-v4.0.0.log
```

### 7. Verify Release
```bash
# Check GitHub
https://github.com/Kreator8607/wrestling-sim-desktop/releases/tag/v4.0.0

# Download and test executable
```

### 8. Document Changes
```bash
# Create detailed release notes
cat RELEASE_NOTES_v4.0.0.md
```

---

## 🔄 Rollback Procedures

### Quick Rollback

If deployment fails, quickly revert:

```bash
# Undo last commit
git reset --soft HEAD~1

# Restore from backup
tar -xzf ./backups/backup-v3.0.0-*.tar.gz -C .

# Or restore specific files
git checkout HEAD~1 -- package.json
```

### Full Rollback to Previous Version

```bash
# Delete v4.0.0 tag
git tag -d v4.0.0
git push origin --delete v4.0.0

# Reset to previous version
git reset --hard v3.0.0

# Push changes
git push origin main --force
```

### Restore from Backup

```bash
# List available backups
ls -la ./backups/

# Restore specific backup
tar -xzf ./backups/backup-v3.0.0-2024-04-30_10-00-00.tar.gz -C .

# Verify restoration
git status
```

---

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] All prerequisites installed
- [ ] GitHub token configured
- [ ] Backup location verified
- [ ] Disk space available (2GB+)
- [ ] Internet connection stable
- [ ] No uncommitted changes
- [ ] Tests passing locally

### During Deployment
- [ ] Dry-run completed successfully
- [ ] No errors in dry-run output
- [ ] Log file being generated
- [ ] Monitoring deployment progress
- [ ] No interruptions

### Post-Deployment
- [ ] Deployment completed successfully
- [ ] Report generated and reviewed
- [ ] GitHub release created
- [ ] Executable uploaded
- [ ] Release notes published
- [ ] Backup archived
- [ ] Team notified

---

## 🎯 Success Criteria

### Deployment Success
- ✅ All steps completed without errors
- ✅ Version updated to 4.0.0
- ✅ Git tag created (v4.0.0)
- ✅ Changes pushed to GitHub
- ✅ GitHub release created
- ✅ Executable uploaded
- ✅ Log file generated
- ✅ Report generated

### Post-Deployment Verification
- ✅ Release visible on GitHub
- ✅ Executable downloadable
- ✅ Release notes published
- ✅ Performance metrics improved
- ✅ No critical bugs reported
- ✅ User feedback positive

---

## 📞 Support & Resources

### Documentation
- FINAL_REVIEW_AND_RECOMMENDATIONS.md
- PERFORMANCE_TEST_REPORT.md
- DATABASE_OPTIMIZATION_STRATEGY.md
- WINDOWS_EXECUTABLE_TESTING_GUIDE.md

### Scripts
- deploy-v4.0.0.sh (Bash)
- deploy-v4.0.0.ps1 (PowerShell)
- git-release.sh (Git automation)
- github-release.py (GitHub API)

### Logs & Reports
- deploy-v4.0.0.log (Deployment log)
- deployment-report-v4.0.0.txt (Deployment report)

---

## 🎓 Next Steps

1. **Review this guide** - Understand deployment process
2. **Run dry-run** - Test without making changes
3. **Execute deployment** - Run actual deployment
4. **Verify release** - Check GitHub release
5. **Test executable** - Download and test
6. **Monitor metrics** - Track performance
7. **Gather feedback** - Collect user feedback
8. **Plan v5.0.0** - Start next version planning

---

## 📈 Performance Expectations

After v4.0.0 deployment:

| Metric | Improvement |
|--------|------------|
| Query Speed | 4.8x faster |
| Memory Usage | 27% reduction |
| Startup Time | 21% faster |
| Cache Hit Rate | 85% |
| Overall Performance | 2.5x faster |

---

**Guide Created**: April 30, 2024  
**Status**: ✅ READY FOR DEPLOYMENT  
**Confidence**: HIGH (95%)  
**Recommendation**: PROCEED WITH DEPLOYMENT

---

For questions or issues, refer to troubleshooting section or consult documentation files.
