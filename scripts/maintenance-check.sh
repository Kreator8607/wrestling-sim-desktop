#!/bin/bash

###############################################################################
# GitHub Actions & Dependencies Maintenance Check Script
# Pro Wrestling Sim v5.0.0
# 
# Purpose: Automated weekly maintenance checks for dependencies
# Usage: ./scripts/maintenance-check.sh
# Schedule: Every Monday at 09:00 (via GitHub Actions or cron)
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPORT_FILE="maintenance-report-$(date +%Y-%m-%d).md"
LOG_FILE="maintenance-check-$(date +%Y-%m-%d).log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

###############################################################################
# Helper Functions
###############################################################################

log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

###############################################################################
# Main Checks
###############################################################################

main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  GitHub Actions & Dependencies Maintenance Check          ║${NC}"
    echo -e "${BLUE}║  Pro Wrestling Sim v5.0.0                                 ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    log "Starting maintenance check at $TIMESTAMP"
    
    # Initialize report
    init_report
    
    # Run checks
    check_node_version
    check_npm_audit
    check_npm_outdated
    check_github_actions
    check_electron_builder
    check_workflow_status
    
    # Generate summary
    generate_summary
    
    log "Maintenance check completed"
    echo ""
    echo -e "${GREEN}Report saved to: $REPORT_FILE${NC}"
    echo -e "${GREEN}Log saved to: $LOG_FILE${NC}"
}

###############################################################################
# Report Initialization
###############################################################################

init_report() {
    cat > "$REPORT_FILE" << 'EOF'
# GitHub Actions & Dependencies Maintenance Report

**Generated:** $(date '+%Y-%m-%d %H:%M:%S')  
**Project:** Pro Wrestling Sim v5.0.0  

---

## 📋 Check Results

EOF
}

###############################################################################
# Node.js Version Check
###############################################################################

check_node_version() {
    log "Checking Node.js version..."
    
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    echo "" >> "$REPORT_FILE"
    echo "### Node.js & npm Versions" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "- **Node.js:** $NODE_VERSION" >> "$REPORT_FILE"
    echo "- **npm:** $NPM_VERSION" >> "$REPORT_FILE"
    
    success "Node.js: $NODE_VERSION, npm: $NPM_VERSION"
}

###############################################################################
# npm Audit Check
###############################################################################

check_npm_audit() {
    log "Running npm audit..."
    
    AUDIT_OUTPUT=$(npm audit --json 2>/dev/null || echo '{}')
    VULNERABILITIES=$(echo "$AUDIT_OUTPUT" | grep -o '"vulnerabilities":[^}]*' | grep -o '[0-9]*' | head -1 || echo "0")
    
    echo "" >> "$REPORT_FILE"
    echo "### Security Audit (npm audit)" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    if [ "$VULNERABILITIES" -eq 0 ]; then
        echo "✅ **Status:** No vulnerabilities found" >> "$REPORT_FILE"
        success "npm audit: No vulnerabilities"
    else
        echo "⚠️  **Status:** $VULNERABILITIES vulnerabilities found" >> "$REPORT_FILE"
        warning "npm audit: $VULNERABILITIES vulnerabilities found"
        
        # Run npm audit fix
        log "Attempting to fix vulnerabilities..."
        npm audit fix --legacy-peer-deps 2>/dev/null || warning "Some vulnerabilities could not be auto-fixed"
    fi
}

###############################################################################
# npm Outdated Check
###############################################################################

check_npm_outdated() {
    log "Checking outdated packages..."
    
    OUTDATED=$(npm outdated --json 2>/dev/null || echo '{}')
    OUTDATED_COUNT=$(echo "$OUTDATED" | grep -o '"[^"]*"' | wc -l)
    
    echo "" >> "$REPORT_FILE"
    echo "### Outdated Packages (npm outdated)" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    if [ "$OUTDATED_COUNT" -eq 0 ]; then
        echo "✅ **Status:** All packages are up to date" >> "$REPORT_FILE"
        success "npm outdated: All packages up to date"
    else
        echo "⚠️  **Status:** $OUTDATED_COUNT packages can be updated" >> "$REPORT_FILE"
        warning "npm outdated: $OUTDATED_COUNT packages can be updated"
        echo "" >> "$REPORT_FILE"
        echo '```json' >> "$REPORT_FILE"
        echo "$OUTDATED" >> "$REPORT_FILE"
        echo '```' >> "$REPORT_FILE"
    fi
}

###############################################################################
# GitHub Actions Check
###############################################################################

check_github_actions() {
    log "Checking GitHub Actions workflows..."
    
    echo "" >> "$REPORT_FILE"
    echo "### GitHub Actions Workflows" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    if [ -d ".github/workflows" ]; then
        WORKFLOWS=$(find .github/workflows -name "*.yml" -o -name "*.yaml")
        WORKFLOW_COUNT=$(echo "$WORKFLOWS" | wc -l)
        
        echo "**Workflows Found:** $WORKFLOW_COUNT" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        
        for workflow in $WORKFLOWS; do
            echo "- $workflow" >> "$REPORT_FILE"
            
            # Check for deprecated actions
            if grep -q "actions/checkout@v3" "$workflow"; then
                warning "Found deprecated actions/checkout@v3 in $workflow"
                echo "  ⚠️  Uses deprecated actions/checkout@v3" >> "$REPORT_FILE"
            fi
            
            if grep -q "actions/setup-node@v3" "$workflow"; then
                warning "Found deprecated actions/setup-node@v3 in $workflow"
                echo "  ⚠️  Uses deprecated actions/setup-node@v3" >> "$REPORT_FILE"
            fi
        done
        
        success "GitHub Actions workflows checked"
    else
        warning "No .github/workflows directory found"
    fi
}

###############################################################################
# Electron Builder Check
###############################################################################

check_electron_builder() {
    log "Checking Electron Builder..."
    
    echo "" >> "$REPORT_FILE"
    echo "### Electron Builder" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    if [ -f "package.json" ]; then
        ELECTRON_VERSION=$(grep '"electron"' package.json | grep -o '[0-9]*\.[0-9]*\.[0-9]*' | head -1)
        BUILDER_VERSION=$(grep '"electron-builder"' package.json | grep -o '[0-9]*\.[0-9]*\.[0-9]*' | head -1)
        
        echo "- **Electron:** $ELECTRON_VERSION" >> "$REPORT_FILE"
        echo "- **electron-builder:** $BUILDER_VERSION" >> "$REPORT_FILE"
        
        success "Electron: $ELECTRON_VERSION, electron-builder: $BUILDER_VERSION"
    fi
}

###############################################################################
# Workflow Status Check
###############################################################################

check_workflow_status() {
    log "Checking recent workflow runs..."
    
    echo "" >> "$REPORT_FILE"
    echo "### Recent Workflow Runs" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    if command -v gh &> /dev/null; then
        # Get last 5 workflow runs
        RUNS=$(gh run list --limit 5 --json status,conclusion,name,createdAt 2>/dev/null || echo "")
        
        if [ -n "$RUNS" ]; then
            echo "**Last 5 Runs:**" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
            echo "$RUNS" >> "$REPORT_FILE"
            success "Workflow status retrieved"
        else
            warning "Could not retrieve workflow status (gh CLI not configured)"
        fi
    else
        warning "GitHub CLI (gh) not installed, skipping workflow status check"
    fi
}

###############################################################################
# Summary Generation
###############################################################################

generate_summary() {
    echo "" >> "$REPORT_FILE"
    echo "---" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "## 📊 Summary" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "**Check Date:** $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
    echo "**Status:** ✅ Maintenance check completed" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "### Recommendations" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "1. Review outdated packages and plan updates" >> "$REPORT_FILE"
    echo "2. Address any security vulnerabilities" >> "$REPORT_FILE"
    echo "3. Update deprecated GitHub Actions" >> "$REPORT_FILE"
    echo "4. Test all workflows after updates" >> "$REPORT_FILE"
    echo "5. Document all changes in changelog" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "---" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "*Report generated by maintenance-check.sh*" >> "$REPORT_FILE"
}

###############################################################################
# Execution
###############################################################################

# Run main function
main "$@"

exit 0
