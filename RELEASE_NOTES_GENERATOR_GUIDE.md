# Pro Wrestling Sim - Release Notes Generator Guide

## Overview

The Release Notes Generator automatically creates professional release notes from git commits. It categorizes commits using conventional commit format and generates formatted Markdown documentation.

## Scripts Available

### 1. Python Version (Recommended)
**File**: `generate-release-notes.py`  
**Platform**: All (Python 3.6+)  
**Status**: ✅ Tested and Working

### 2. Bash Version
**File**: `generate-release-notes.sh`  
**Platform**: Linux/Mac/Windows (Git Bash)  
**Status**: ⚠️ Available (use Python for better compatibility)

## Installation

### Prerequisites
```bash
# Python version
pip3 install requests

# Bash version
# Requires: git, curl, jq
sudo apt-get install git curl jq  # Ubuntu/Debian
brew install git curl jq          # macOS
```

## Usage

### Python Version

#### Basic Usage
```bash
python3 generate-release-notes.py -v 4.0.0 -p 3.0.0
```

#### With Custom Output File
```bash
python3 generate-release-notes.py -v 4.0.0 -p 3.0.0 -o CHANGELOG.md
```

#### Verbose Mode
```bash
python3 generate-release-notes.py -v 4.0.0 -p 3.0.0 --verbose
```

#### Command Line Options
```
-v, --version VERSION          Version number (e.g., 4.0.0) (required)
-p, --previous-tag TAG         Previous tag for comparison (required)
-o, --output FILE              Output file (default: RELEASE_NOTES_VERSION.md)
--verbose                      Verbose output
-h, --help                     Show help message
```

### Bash Version

#### Basic Usage
```bash
chmod +x generate-release-notes.sh
./generate-release-notes.sh -v 4.0.0 -p v3.0.0
```

#### With Custom Output File
```bash
./generate-release-notes.sh -v 4.0.0 -p v3.0.0 -o CHANGELOG.md
```

#### Verbose Mode
```bash
./generate-release-notes.sh -v 4.0.0 -p v3.0.0 --verbose
```

## Conventional Commit Format

The generator recognizes the following commit prefixes:

### Supported Prefixes
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `perf:` - Performance improvements
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Other changes

### Example Commits
```
feat: Add database optimization layer
fix: Resolve memory leak in cache system
docs: Update installation guide
perf: Optimize query performance by 4.8x
refactor: Reorganize module structure
test: Add unit tests for cache layer
```

## Output Format

### Generated Markdown Structure
```markdown
# Pro Wrestling Sim vX.Y.Z

**Release Date**: Month DD, YYYY

## Overview
[Release summary and statistics]

## 🚀 New Features
[List of new features]

## 🐛 Bug Fixes
[List of bug fixes]

## 📈 Performance Improvements
[Performance enhancements]

## 📚 Documentation
[Documentation changes]

## 🔧 Refactoring
[Code refactoring changes]

## 👥 Contributors
[List of contributors]

## 📥 Installation
[Installation instructions]

## 🔗 Links
[Relevant links]

## 📝 Changelog
[Link to full changelog]
```

## Examples

### Example 1: Generate for v4.0.0
```bash
python3 generate-release-notes.py -v 4.0.0 -p 3.0.0
```

Output: `RELEASE_NOTES_4.0.0.md`

### Example 2: Generate for v5.0.0 with Custom Output
```bash
python3 generate-release-notes.py -v 5.0.0 -p 4.0.0 -o CHANGELOG_v5.md
```

Output: `CHANGELOG_v5.md`

### Example 3: Generate with Verbose Output
```bash
python3 generate-release-notes.py -v 4.0.0 -p 3.0.0 --verbose
```

Output:
```
✓ Tags validated
▶ Parsing commits between v3.0.0 and HEAD
✓ Parsed 15 commits
→ Features: 5
→ Fixes: 3
→ Docs: 2
→ Performance: 1
→ Contributors: 3
▶ Generating Markdown release notes
✓ Release notes generated: RELEASE_NOTES_4.0.0.md
```

## Automation

### Scheduled Generation
Add to crontab to generate release notes automatically:

```bash
# Generate release notes on the 1st of each month at 10:00 UTC
0 10 1 * * cd /path/to/wrestling-sim-desktop && python3 generate-release-notes.py -v $(date +%Y.%m.0) -p $(date -d '1 month ago' +%Y.%m.0)
```

### GitHub Actions Integration
Add to `.github/workflows/release.yml`:

```yaml
- name: Generate Release Notes
  run: |
    python3 generate-release-notes.py \
      -v ${{ github.ref_name }} \
      -p $(git describe --tags --abbrev=0 HEAD^) \
      -o RELEASE_NOTES.md

- name: Upload Release Notes
  uses: actions/upload-artifact@v2
  with:
    name: release-notes
    path: RELEASE_NOTES.md
```

## Troubleshooting

### Issue: "Tag not found"
**Solution**: Ensure tags exist in the repository
```bash
git tag -l  # List all tags
git tag v4.0.0  # Create tag if missing
```

### Issue: "No commits found"
**Solution**: Check if commits exist between tags
```bash
git log v3.0.0..HEAD --oneline
```

### Issue: Python script not executable
**Solution**: Make it executable
```bash
chmod +x generate-release-notes.py
```

### Issue: Bash script errors
**Solution**: Use Python version instead (more reliable)
```bash
python3 generate-release-notes.py -v 4.0.0 -p 3.0.0
```

## Best Practices

### 1. Use Conventional Commits
Always use conventional commit format for consistency:
```bash
git commit -m "feat: Add new feature"
git commit -m "fix: Resolve bug"
```

### 2. Create Tags Before Release
```bash
git tag v4.0.0
git push origin v4.0.0
```

### 3. Generate Before Publishing
Generate release notes before creating GitHub release:
```bash
python3 generate-release-notes.py -v 4.0.0 -p 3.0.0
# Review RELEASE_NOTES_4.0.0.md
# Then publish to GitHub
```

### 4. Customize Output
Edit the generated file before publishing:
- Add additional context
- Include breaking changes
- Add migration guides
- Include performance metrics

## Integration with Release Process

### Complete Release Workflow
```bash
# 1. Create tag
git tag v4.0.0
git push origin v4.0.0

# 2. Generate release notes
python3 generate-release-notes.py -v 4.0.0 -p 3.0.0

# 3. Review and customize
nano RELEASE_NOTES_4.0.0.md

# 4. Create GitHub release
./create-release-v4.0.0.sh -t $GITHUB_TOKEN -B RELEASE_NOTES_4.0.0.md

# 5. Upload executable
./upload-release-asset.sh -t $GITHUB_TOKEN -r 316310400 -f ./dist/Pro-Wrestling-Sim-4.0.0.exe

# 6. Announce release
# Share link and notify community
```

## Performance

### Generation Time
- Python version: ~2-5 seconds
- Bash version: ~3-8 seconds

### Output Size
- Typical release notes: 5-10 KB
- With many commits: 15-20 KB

## Support

For issues or questions:
1. Check this guide
2. Review script help: `python3 generate-release-notes.py -h`
3. Check git log: `git log --oneline`
4. Open GitHub issue

## Version History

### v1.0.0 (Current)
- ✅ Python implementation
- ✅ Bash implementation
- ✅ Conventional commit support
- ✅ Markdown output
- ✅ Contributor tracking
- ✅ Performance metrics

## Future Enhancements

- [ ] JSON output format
- [ ] HTML output format
- [ ] Automatic GitHub release creation
- [ ] Breaking changes detection
- [ ] Dependency updates tracking
- [ ] Performance comparison
- [ ] Security updates highlighting

---

**Last Updated**: May 2, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
