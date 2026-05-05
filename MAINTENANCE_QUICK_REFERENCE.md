# GitHub Actions Maintenance - Quick Reference Guide

**Version:** 1.0  
**Last Updated:** May 3, 2026  

---

## 🚀 Quick Commands

### Weekly Maintenance (Every Monday)

```bash
# Run maintenance check locally
./scripts/maintenance-check.sh

# Check for vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# View detailed audit report
npm audit --json | jq .
```

### Monthly Maintenance (First day of month)

```bash
# Update minor versions
npm update

# Update specific package
npm install package-name@latest

# Update all packages (careful!)
npm install --save-dev npm-check-updates
npx ncu -u
npm install

# Test after updates
npm run build:win
npm test
```

### Emergency (Critical Vulnerability)

```bash
# 1. Assess impact
npm audit

# 2. Fix automatically
npm audit fix

# 3. If manual fix needed
npm install package-name@version

# 4. Test thoroughly
npm run build:win
npm test

# 5. Commit and push
git add -A
git commit -m "fix: Security patch for critical vulnerability"
git push origin master
```

---

## 📋 Maintenance Checklist

### Daily (Automated)
- [ ] GitHub Actions workflows running
- [ ] Build status green
- [ ] No error logs

### Weekly (Manual)
- [ ] Run maintenance-check.sh
- [ ] Review npm audit results
- [ ] Check for deprecation warnings
- [ ] Review GitHub Actions logs

### Monthly (Planned)
- [ ] Update minor versions
- [ ] Test all workflows
- [ ] Create release if needed
- [ ] Update documentation

### Quarterly (Strategic)
- [ ] Evaluate major version updates
- [ ] Plan architecture changes
- [ ] Review security posture
- [ ] Update maintenance plan

---

## 🔍 Key Files to Monitor

| File | Purpose | Check Frequency |
|------|---------|-----------------|
| `package.json` | Dependencies | Weekly |
| `.github/workflows/*.yml` | Actions workflows | Weekly |
| `npm audit` output | Security | Weekly |
| `npm outdated` output | Updates | Weekly |
| GitHub Actions logs | Build status | Daily |
| Deprecation warnings | Compatibility | Weekly |

---

## ⚠️ Common Issues & Solutions

### Issue: npm audit shows vulnerabilities

```bash
# Solution 1: Auto-fix
npm audit fix

# Solution 2: Manual fix
npm install vulnerable-package@latest

# Solution 3: Accept risk (if safe)
npm audit --audit-level=moderate
```

### Issue: GitHub Actions deprecated warning

```bash
# Find deprecated actions
grep -r "@v3" .github/workflows/
grep -r "@v2" .github/workflows/

# Update to latest version
# Change: uses: actions/checkout@v3
# To: uses: actions/checkout@v4
```

### Issue: Node.js version mismatch

```bash
# Check current version
node --version

# Update Node.js
nvm install 24.x
nvm use 24.x

# Verify
node --version
npm --version
```

### Issue: Build fails after update

```bash
# 1. Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Test build
npm run build:win

# 3. If still fails, rollback
git revert <commit-hash>
npm install
```

---

## 📊 Monitoring Dashboard

### GitHub Actions
- **URL:** https://github.com/Kreator8607/wrestling-sim-desktop/actions
- **Check:** Build status, recent runs, logs

### npm Registry
- **URL:** https://www.npmjs.com/
- **Check:** Package versions, security advisories

### Node.js
- **URL:** https://nodejs.org/en/about/releases/
- **Check:** LTS releases, security updates

### Electron
- **URL:** https://github.com/electron/electron/releases
- **Check:** Latest releases, breaking changes

---

## 🔄 Update Strategy

### Security Patches (Critical)
- **Action:** Apply immediately
- **Timeline:** < 4 hours
- **Testing:** Minimal (build + smoke test)
- **Deployment:** Direct to production

### Bug Fixes (High)
- **Action:** Apply within 1 week
- **Timeline:** < 1 week
- **Testing:** Full test suite
- **Deployment:** Next release

### Minor Updates (Medium)
- **Action:** Apply monthly
- **Timeline:** < 1 month
- **Testing:** Full test suite
- **Deployment:** Next release

### Major Updates (Low)
- **Action:** Plan quarterly
- **Timeline:** < 3 months
- **Testing:** Extensive testing
- **Deployment:** Major release

---

## 📞 Escalation Path

```
Issue Found
    ↓
Developer (Assess)
    ↓
Senior Dev (Implement)
    ↓
DevOps Lead (Review)
    ↓
Tech Lead (Approve)
    ↓
Deploy
```

---

## 🎯 Success Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| Vulnerabilities | 0 critical | Continuous |
| Build Success | > 99% | Daily |
| Update Lag | < 30 days | Monthly |
| Test Coverage | > 80% | Monthly |
| Uptime | > 99.9% | Monthly |

---

## 📚 Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **npm Docs:** https://docs.npmjs.com/
- **Node.js LTS Schedule:** https://nodejs.org/en/about/releases/
- **Electron Docs:** https://www.electronjs.org/docs
- **Security Best Practices:** https://cheatsheetseries.owasp.org/

---

## 🔐 Security Best Practices

1. **Keep dependencies updated** - Run npm audit weekly
2. **Use lock files** - Commit package-lock.json
3. **Automate updates** - Use Dependabot
4. **Test thoroughly** - Full test suite before deploy
5. **Monitor production** - Watch for errors
6. **Document changes** - Update changelog
7. **Review PRs** - Check for security issues
8. **Use secrets** - Never commit credentials

---

## 📝 Maintenance Log Template

```markdown
## Maintenance Log - YYYY-MM-DD

### Checks Performed
- [ ] npm audit
- [ ] npm outdated
- [ ] GitHub Actions status
- [ ] Build logs

### Issues Found
- Issue 1: Description
- Issue 2: Description

### Actions Taken
- Action 1: Description
- Action 2: Description

### Status
- [ ] All issues resolved
- [ ] Some issues pending
- [ ] Critical issues requiring escalation

### Next Steps
- Step 1
- Step 2

### Sign-off
- Developer: [Name]
- Date: YYYY-MM-DD
```

---

## 🎓 Training Checklist

For new team members:

- [ ] Understand maintenance plan
- [ ] Know how to run maintenance checks
- [ ] Understand update strategy
- [ ] Know escalation path
- [ ] Understand security best practices
- [ ] Can handle common issues
- [ ] Know resources and documentation

---

## 📞 Contact Information

**DevOps Lead:** [Name]  
**Tech Lead:** [Name]  
**Slack Channel:** #devops  
**Email:** devops@wrestling-sim.com  

---

## ✅ Approval Checklist

Before deploying any updates:

- [ ] All tests passing
- [ ] No breaking changes
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Reviewed by senior dev
- [ ] Approved by tech lead
- [ ] Tested in staging
- [ ] Ready for production

---

**Last Reviewed:** May 3, 2026  
**Next Review:** June 3, 2026  
**Status:** ✅ Active

---

*Quick Reference Guide - Pro Wrestling Sim v5.0.0*
