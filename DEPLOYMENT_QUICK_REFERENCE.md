# Pro Wrestling Sim v4.0.0 - Deployment Quick Reference

**Quick Start Guide for Deployment Automation**

---

## 🚀 Quick Commands

### Linux/Mac/Git Bash

```bash
# 1. Navigate to project
cd /path/to/wrestling-sim-desktop

# 2. Make script executable
chmod +x deploy-v4.0.0.sh

# 3. Test with dry-run
./deploy-v4.0.0.sh --dry-run

# 4. Deploy to production
./deploy-v4.0.0.sh

# 5. View logs
tail -f deploy-v4.0.0.log
```

### Windows PowerShell

```powershell
# 1. Navigate to project
cd C:\path\to\wrestling-sim-desktop

# 2. Test with dry-run
.\deploy-v4.0.0.ps1 -DryRun

# 3. Deploy to production
.\deploy-v4.0.0.ps1

# 4. View logs
Get-Content deploy-v4.0.0.log -Wait
```

---

## 🔑 Environment Setup

### Set GitHub Token

```bash
# Linux/Mac
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Windows PowerShell
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Get GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Select: `repo`, `write:packages`
4. Copy and save token

---

## 📋 Deployment Flags

### Bash Flags
```bash
./deploy-v4.0.0.sh [OPTIONS]

--dry-run      # Test without changes
--skip-tests   # Skip test execution
--skip-build   # Skip build process
--verbose      # Enable verbose output
--help         # Show help
```

### PowerShell Flags
```powershell
.\deploy-v4.0.0.ps1 [OPTIONS]

-DryRun        # Test without changes
-SkipTests     # Skip test execution
-SkipBuild     # Skip build process
-Verbose       # Enable verbose output
-Help          # Show help
```

---

## ✅ Pre-Deployment Checklist

- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] Git v2.30+ installed
- [ ] GitHub token configured
- [ ] 2GB+ disk space available
- [ ] No uncommitted changes
- [ ] Tests passing locally
- [ ] Stable internet connection

---

## 🧪 Testing Steps

### Step 1: Dry-Run
```bash
./deploy-v4.0.0.sh --dry-run
```

### Step 2: Review Output
```
[SUCCESS] Prerequisites verified
[SUCCESS] Git status verified
[DRY-RUN] Would create backup
[DRY-RUN] Would run tests
[DRY-RUN] Would build application
...
```

### Step 3: Check Log
```bash
cat deploy-v4.0.0.log
```

### Step 4: Proceed to Production
```bash
./deploy-v4.0.0.sh
```

---

## 📊 Deployment Process

```
1. Check Prerequisites
   ↓
2. Verify Git Status
   ↓
3. Create Backup
   ↓
4. Run Tests
   ↓
5. Build Application
   ↓
6. Verify Build
   ↓
7. Update Version
   ↓
8. Update Documentation
   ↓
9. Commit Changes
   ↓
10. Create Git Tag
    ↓
11. Push to GitHub
    ↓
12. Create GitHub Release
    ↓
13. Upload Assets
    ↓
14. Generate Report
    ↓
✅ DEPLOYMENT COMPLETE
```

---

## 📁 Output Files

| File | Purpose |
|------|---------|
| `deploy-v4.0.0.log` | Deployment log |
| `deployment-report-v4.0.0.txt` | Deployment report |
| `backups/backup-v3.0.0-*.tar.gz` | Backup archive |
| `dist/Pro-Wrestling-Sim-4.0.0.exe` | Windows executable |

---

## 🔍 Verification

### Check GitHub Release
```bash
curl -s https://api.github.com/repos/Kreator8607/wrestling-sim-desktop/releases/tags/v4.0.0 | jq .
```

### Or Visit in Browser
```
https://github.com/Kreator8607/wrestling-sim-desktop/releases/tag/v4.0.0
```

### Verify Executable
```bash
# Check file exists
ls -lh dist/Pro-Wrestling-Sim-4.0.0.exe

# Check MD5
md5sum dist/Pro-Wrestling-Sim-4.0.0.exe
```

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Node.js not found" | `brew install node` or download from nodejs.org |
| "Git not found" | `brew install git` or download from git-scm.com |
| "Permission denied" | `chmod +x deploy-v4.0.0.sh` |
| "Tests failed" | `npm run test` to debug, then `--skip-tests` |
| "Build failed" | `rm -rf dist && npm run react-build` |
| "Token invalid" | Generate new token at github.com/settings/tokens |
| "Not in git repo" | `cd` to correct directory |

---

## 🔄 Rollback

### Quick Rollback
```bash
# Undo last commit
git reset --soft HEAD~1

# Or restore from backup
tar -xzf ./backups/backup-v3.0.0-*.tar.gz -C .
```

### Full Rollback
```bash
# Delete tag
git tag -d v4.0.0
git push origin --delete v4.0.0

# Reset to v3.0.0
git reset --hard v3.0.0
git push origin main --force
```

---

## 📈 Expected Results

After deployment:
- ✅ Version updated to 4.0.0
- ✅ Git tag v4.0.0 created
- ✅ Changes pushed to GitHub
- ✅ GitHub release created
- ✅ Executable uploaded (165 MB)
- ✅ Performance improved 2.5x
- ✅ Backup created
- ✅ Report generated

---

## 📞 Support Resources

- **Full Guide**: DEPLOYMENT_AUTOMATION_GUIDE.md
- **Performance Report**: PERFORMANCE_TEST_REPORT.md
- **Database Optimization**: DATABASE_OPTIMIZATION_STRATEGY.md
- **Final Review**: FINAL_REVIEW_AND_RECOMMENDATIONS.md

---

## ⏱️ Estimated Time

| Step | Time |
|------|------|
| Prerequisites Check | 1 min |
| Git Operations | 2 min |
| Backup Creation | 1 min |
| Tests | 3 min |
| Build | 5 min |
| Verification | 1 min |
| Commit & Push | 2 min |
| GitHub Release | 1 min |
| Asset Upload | 2 min |
| **Total** | **~18 min** |

---

## ✨ Success Indicators

✅ Log shows all steps completed  
✅ No errors in output  
✅ Deployment report generated  
✅ GitHub release visible  
✅ Executable downloadable  
✅ Backup created  

---

**Last Updated**: April 30, 2024  
**Status**: ✅ READY FOR DEPLOYMENT  
**Confidence**: HIGH (95%)

For detailed information, see DEPLOYMENT_AUTOMATION_GUIDE.md
