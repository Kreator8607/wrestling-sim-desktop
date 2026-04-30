#!/bin/bash

################################################################################
# Pro Wrestling Sim v3.0.0 - Git Release Automation Script
# 
# Purpose: Automate git commit, push, and tag creation for releases
# Platform: Linux/Mac
# Usage: ./git-release.sh [options]
#
# Options:
#   -m, --message MESSAGE    Commit message (default: "Release: Pro Wrestling Sim v3.0.0")
#   -t, --tag TAG           Tag version (default: "v3.0.0")
#   -b, --branch BRANCH     Branch to push to (default: "main")
#   -d, --dry-run          Show what would be done without executing
#   -h, --help             Show this help message
#
# Examples:
#   ./git-release.sh
#   ./git-release.sh -m "Release v3.0.0 with build fixes" -t v3.0.0
#   ./git-release.sh --dry-run
#
################################################################################

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
COMMIT_MESSAGE="Release: Pro Wrestling Sim v3.0.0 - Build fixes and improvements"
TAG_VERSION="v3.0.0"
BRANCH="main"
DRY_RUN=false
VERBOSE=false

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Function to print help
show_help() {
    cat << EOF
Pro Wrestling Sim v3.0.0 - Git Release Automation

USAGE:
    ./git-release.sh [OPTIONS]

OPTIONS:
    -m, --message MESSAGE    Commit message
                            Default: "Release: Pro Wrestling Sim v3.0.0 - Build fixes and improvements"
    
    -t, --tag TAG           Tag version
                            Default: "v3.0.0"
    
    -b, --branch BRANCH     Branch to push to
                            Default: "main"
    
    -d, --dry-run          Show what would be done without executing
    
    -v, --verbose          Enable verbose output
    
    -h, --help             Show this help message

EXAMPLES:
    # Standard release
    ./git-release.sh
    
    # Custom message and tag
    ./git-release.sh -m "Release v3.0.0 with Windows build" -t v3.0.0
    
    # Dry run to preview changes
    ./git-release.sh --dry-run
    
    # Push to different branch
    ./git-release.sh -b develop

WORKFLOW:
    1. Check git status
    2. Stage all changes (git add .)
    3. Create commit with message
    4. Create annotated tag
    5. Push commits to remote
    6. Push tags to remote
    7. Display summary

REQUIREMENTS:
    - Git installed and configured
    - Repository initialized
    - Remote origin configured
    - User has push permissions

EOF
}

# Function to parse arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -m|--message)
                COMMIT_MESSAGE="$2"
                shift 2
                ;;
            -t|--tag)
                TAG_VERSION="$2"
                shift 2
                ;;
            -b|--branch)
                BRANCH="$2"
                shift 2
                ;;
            -d|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use -h or --help for usage information"
                exit 1
                ;;
        esac
    done
}

# Function to check git status
check_git_status() {
    print_info "Checking git status..."
    
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not a git repository"
        exit 1
    fi
    
    if ! git config user.name > /dev/null 2>&1; then
        print_error "Git user.name not configured"
        echo "Run: git config user.name 'Your Name'"
        exit 1
    fi
    
    if ! git config user.email > /dev/null 2>&1; then
        print_error "Git user.email not configured"
        echo "Run: git config user.email 'your.email@example.com'"
        exit 1
    fi
    
    # Check if there are changes to commit
    if git diff-index --quiet HEAD --; then
        print_warning "No changes to commit"
        return 1
    fi
    
    print_status "Git status OK"
    return 0
}

# Function to display changes
display_changes() {
    print_info "Changes to be committed:"
    echo ""
    git diff --cached --name-status | sed 's/^/  /'
    echo ""
}

# Function to stage changes
stage_changes() {
    print_info "Staging all changes..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would execute: git add ."
    else
        git add .
        print_status "Changes staged"
    fi
}

# Function to create commit
create_commit() {
    print_info "Creating commit..."
    print_info "Message: $COMMIT_MESSAGE"
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would execute: git commit -m '$COMMIT_MESSAGE'"
    else
        git commit -m "$COMMIT_MESSAGE"
        print_status "Commit created"
    fi
}

# Function to create tag
create_tag() {
    print_info "Creating tag: $TAG_VERSION"
    
    # Check if tag already exists
    if git rev-parse "$TAG_VERSION" > /dev/null 2>&1; then
        print_warning "Tag $TAG_VERSION already exists"
        read -p "Do you want to delete and recreate it? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if [ "$DRY_RUN" = true ]; then
                print_info "[DRY RUN] Would execute: git tag -d $TAG_VERSION"
            else
                git tag -d "$TAG_VERSION"
                print_status "Old tag deleted"
            fi
        else
            print_error "Tag creation cancelled"
            exit 1
        fi
    fi
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would execute: git tag -a $TAG_VERSION -m 'Release $TAG_VERSION'"
    else
        git tag -a "$TAG_VERSION" -m "Release $TAG_VERSION"
        print_status "Tag created: $TAG_VERSION"
    fi
}

# Function to push commits
push_commits() {
    print_info "Pushing commits to origin/$BRANCH..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would execute: git push origin $BRANCH"
    else
        if git push origin "$BRANCH"; then
            print_status "Commits pushed to origin/$BRANCH"
        else
            print_error "Failed to push commits"
            exit 1
        fi
    fi
}

# Function to push tags
push_tags() {
    print_info "Pushing tags to origin..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would execute: git push origin $TAG_VERSION"
    else
        if git push origin "$TAG_VERSION"; then
            print_status "Tag pushed to origin"
        else
            print_error "Failed to push tag"
            exit 1
        fi
    fi
}

# Function to display summary
display_summary() {
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo -e "${GREEN}Release Summary${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo "Branch:           $BRANCH"
    echo "Tag:              $TAG_VERSION"
    echo "Commit Message:   $COMMIT_MESSAGE"
    
    if [ "$DRY_RUN" = true ]; then
        echo -e "Mode:             ${YELLOW}DRY RUN (no changes made)${NC}"
    else
        echo -e "Status:           ${GREEN}Released Successfully${NC}"
    fi
    
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    if [ "$DRY_RUN" = false ]; then
        print_info "Next steps:"
        echo "  1. Verify release on GitHub: https://github.com/Kreator8607/wrestling-sim-desktop/releases"
        echo "  2. Monitor GitHub Actions workflow"
        echo "  3. Download executable when build completes"
        echo "  4. Verify checksums for integrity"
    fi
}

# Function to handle errors
handle_error() {
    print_error "An error occurred during the release process"
    echo "Current state:"
    git status
    exit 1
}

# Main execution
main() {
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "Pro Wrestling Sim v3.0.0 - Git Release Automation"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    # Parse arguments
    parse_arguments "$@"
    
    # Set error trap
    trap handle_error ERR
    
    # Display configuration
    print_info "Configuration:"
    echo "  Branch:  $BRANCH"
    echo "  Tag:     $TAG_VERSION"
    echo "  Message: $COMMIT_MESSAGE"
    echo ""
    
    # Check git status
    if ! check_git_status; then
        print_warning "No changes detected. Continuing anyway..."
    fi
    
    # Display changes
    display_changes
    
    # Ask for confirmation
    if [ "$DRY_RUN" = false ]; then
        read -p "Continue with release? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_warning "Release cancelled"
            exit 0
        fi
    fi
    
    # Execute workflow
    stage_changes
    create_commit
    create_tag
    push_commits
    push_tags
    
    # Display summary
    display_summary
}

# Run main function
main "$@"
