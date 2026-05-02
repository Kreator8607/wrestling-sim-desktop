# GitHub Actions Integration - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Option 1: Automatic Release (Recommended)

```bash
# 1. Create tag
git tag v4.0.0

# 2. Push tag
git push origin v4.0.0

# 3. GitHub Actions automatically:
#    - Generates release notes
#    - Creates GitHub Release
#    - Commits notes to repository
#    Done! ✅
```

### Option 2: Manual Release

1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Generate Release Notes"
4. Click "Run workflow"
5. Enter version: `4.0.0`
6. Enter previous tag: `v3.0.0`
7. Click "Run workflow"
8. Review and merge pull request

---

## 📋 What Happens Automatically

When you push a tag (e.g., `git push origin v4.0.0`):

✅ Workflow triggers automatically  
✅ Detects version from tag  
✅ Finds previous tag  
✅ Generates release notes  
✅ Creates GitHub Release  
✅ Commits notes to docs/releases/  
✅ Posts workflow summary  

---

## 🔍 Monitor Progress

1. Go to Actions tab
2. Find "Generate Release Notes" workflow
3. Watch real-time execution
4. Check results when complete

---

## 📁 Generated Files

- **RELEASE_NOTES_X.Y.Z.md** - Generated notes file
- **GitHub Release** - Created with notes as body
- **docs/releases/** - Notes committed here
- **Artifact** - Available for 30 days

---

## 🎯 Workflow File

**Location**: `.github/workflows/generate-release-notes.yml`

**Triggers**:
- Push tags matching `v*` (automatic)
- Manual dispatch (workflow_dispatch)

**Permissions**:
- Write to repository
- Create pull requests

---

## ✨ Features

### Automatic Detection
- Extracts version from tag
- Finds previous tag
- Parses commits automatically

### Smart Categorization
- Features (feat:)
- Bug fixes (fix:)
- Documentation (docs:)
- Performance (perf:)
- Refactoring (refactor:)
- Tests (test:)

### Multiple Outputs
- Release notes file
- GitHub Release
- Repository commit
- Workflow artifact

---

## 🐛 Troubleshooting

### Tag not triggering workflow?

**Check tag format**:
```bash
# Correct
git tag v4.0.0

# Incorrect
git tag 4.0.0          # Missing 'v'
git tag release-4.0.0  # Wrong pattern
```

### Previous tag not found?

**Verify tags exist**:
```bash
git tag -l              # List all tags
git tag v3.0.0 <hash>  # Create if missing
git push origin v3.0.0  # Push tag
```

### Workflow failed?

**Check logs**:
1. Go to Actions
2. Click failed workflow
3. Expand "Generate release notes" job
4. Check error messages

---

## 📚 Full Documentation

See `GITHUB_ACTIONS_INTEGRATION_GUIDE.md` for:
- Detailed workflow explanation
- Configuration options
- Advanced features
- Integration examples
- Troubleshooting guide

---

## 🎓 Examples

### Example 1: Release v4.0.0
```bash
git tag v4.0.0
git push origin v4.0.0
# Workflow runs automatically ✅
```

### Example 2: Release v5.0.0
```bash
git tag v5.0.0
git push origin v5.0.0
# Workflow runs automatically ✅
```

### Example 3: Manual Release
1. Actions → Generate Release Notes
2. Run workflow
3. Version: 4.0.0
4. Previous: v3.0.0
5. Creates PR for review ✅

---

## ✅ Checklist

- [x] Workflow file created
- [x] Python script ready
- [x] Triggers configured
- [x] Permissions set
- [x] Documentation complete
- [x] Ready to use

---

## 🚀 Next Steps

1. **Test with manual trigger**
   - Go to Actions
   - Run workflow manually
   - Verify output

2. **Create first automatic release**
   - Create tag: `git tag v4.0.0`
   - Push: `git push origin v4.0.0`
   - Monitor workflow

3. **Review results**
   - Check GitHub Release
   - Verify release notes
   - Confirm commit in docs/

4. **Share release**
   - Copy release URL
   - Announce to community
   - Collect feedback

---

**Status**: ✅ READY TO USE  
**Complexity**: ⭐ Easy  
**Time to Setup**: 2 minutes  

Start using GitHub Actions automation now! 🎉
