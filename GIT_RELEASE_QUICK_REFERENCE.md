# Git Release - Quick Reference Card

## 🚀 Quick Start

### Linux/Mac
```bash
chmod +x git-release.sh
./git-release.sh
```

### Windows (PowerShell)
```powershell
.\git-release.ps1
```

### Interactive Menu
```bash
./git-release-interactive.sh
```

---

## 📋 Common Commands

### Standard Release
```bash
# Bash
./git-release.sh

# PowerShell
.\git-release.ps1
```

### Custom Message
```bash
# Bash
./git-release.sh -m "Release v3.0.0 with Windows build"

# PowerShell
.\git-release.ps1 -Message "Release v3.0.0"
```

### Custom Tag
```bash
# Bash
./git-release.sh -t v3.0.1

# PowerShell
.\git-release.ps1 -Tag v3.0.1
```

### Dry Run (Preview)
```bash
# Bash
./git-release.sh --dry-run

# PowerShell
.\git-release.ps1 -DryRun
```

### Different Branch
```bash
# Bash
./git-release.sh -b develop

# PowerShell
.\git-release.ps1 -Branch develop
```

---

## 🔧 Options

### Bash Options
```
-m, --message MESSAGE    Commit message
-t, --tag TAG           Tag version
-b, --branch BRANCH     Branch to push to
-d, --dry-run          Preview without executing
-v, --verbose          Verbose output
-h, --help             Show help
```

### PowerShell Parameters
```
-Message TEXT       Commit message
-Tag VERSION        Tag version
-Branch NAME        Branch to push to
-DryRun            Preview without executing
-Help              Show help
```

---

## 📁 Files

| File | Size | Purpose |
|------|------|---------|
| git-release.sh | 9.7 KB | Bash automation script |
| git-release.ps1 | 11.2 KB | PowerShell script |
| git-release-interactive.sh | 7.8 KB | Interactive menu |
| git-release.config | 4.2 KB | Configuration file |
| GIT_RELEASE_GUIDE.md | 12 KB | Full documentation |

---

## ✅ Workflow

```
1. Check git status
2. Stage changes (git add .)
3. Create commit
4. Create tag
5. Push commits
6. Push tags
7. Show summary
```

---

## 🎯 Examples

### Example 1: Quick Release
```bash
./git-release.sh
```

### Example 2: Release with Custom Message
```bash
./git-release.sh -m "Release v3.0.0: Build fixes" -t v3.0.0
```

### Example 3: Preview Changes
```bash
./git-release.sh --dry-run
```

### Example 4: Interactive Menu
```bash
./git-release-interactive.sh
# Then select: 1) Quick Release
```

### Example 5: Windows Release
```powershell
.\git-release.ps1 -Message "Release v3.0.0" -Tag v3.0.0
```

---

## ⚠️ Troubleshooting

### "Not a git repository"
```bash
cd wrestling-sim-desktop-v2
git status
```

### "Git user not configured"
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### "Permission denied"
```bash
chmod +x git-release.sh
chmod +x git-release-interactive.sh
```

### "Tag already exists"
```bash
./git-release.sh -t v3.0.1  # Use different tag
# OR
git tag -d v3.0.0           # Delete old tag
```

### PowerShell execution policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\git-release.ps1
```

---

## 📚 Help

```bash
# Bash help
./git-release.sh -h

# PowerShell help
.\git-release.ps1 -Help

# Full documentation
cat GIT_RELEASE_GUIDE.md
```

---

## 🔐 Best Practices

1. **Always use dry-run first**
   ```bash
   ./git-release.sh --dry-run
   ```

2. **Use meaningful messages**
   ```bash
   ./git-release.sh -m "Release v3.0.0: Features and fixes"
   ```

3. **Follow semantic versioning**
   - v3.0.0 (major)
   - v3.0.1 (patch)
   - v3.1.0 (minor)

4. **Verify before releasing**
   ```bash
   git status
   npm test
   npm run build:win
   ```

---

## 🚀 Release Process

```bash
# 1. Verify changes
git status

# 2. Preview release
./git-release.sh --dry-run

# 3. Execute release
./git-release.sh

# 4. Monitor GitHub Actions
# Visit: https://github.com/Kreator8607/wrestling-sim-desktop/actions

# 5. Download executable
# Visit: https://github.com/Kreator8607/wrestling-sim-desktop/releases
```

---

## 📞 Support

- **Full Guide**: `GIT_RELEASE_GUIDE.md`
- **Config File**: `git-release.config`
- **Help**: `./git-release.sh -h`

---

**Status**: ✅ Ready to Use  
**Version**: 1.0  
**Date**: April 30, 2024
