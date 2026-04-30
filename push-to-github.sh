#!/bin/bash

################################################################################
# Pro Wrestling Sim v3.0.0 - Automated GitHub Push
#
# Purpose: Automatically push all documentation and artifacts to GitHub
# Platform: Linux/Mac/Windows (Git Bash)
# Usage: ./push-to-github.sh [options]
#
################################################################################

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Default values
BRANCH="master"
COMMIT_MESSAGE="docs: Add Pro Wrestling Sim v3.0.0 documentation and build artifacts"
DRY_RUN=false
VERBOSE=false
CREATE_TAG=false
TAG_NAME="v3.0.0"
PUSH_TAGS=false

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

# Function to show help
show_help() {
    cat << 'EOF'
Pro Wrestling Sim v3.0.0 - Automated GitHub Push

USAGE:
    ./push-to-github.sh [OPTIONS]

OPTIONS:
    -b, --branch BRANCH         Git branch to push to
                               Default: master
    
    -m, --message MESSAGE      Commit message
                               Default: docs: Add Pro Wrestling Sim v3.0.0...
    
    -t, --tag TAG              Create tag (e.g., v3.0.0)
    
    --push-tags               Push tags to remote
    
    --dry-run                 Preview without pushing
    
    -v, --verbose             Verbose output
    
    -h, --help                Show this help message

EXAMPLES:
    # Push all changes
    ./push-to-github.sh

    # Push with custom message
    ./push-to-github.sh -m "Release v3.0.0"

    # Create tag and push
    ./push-to-github.sh -t v3.0.0 --push-tags

    # Preview changes
    ./push-to-github.sh --dry-run

EOF
}

# Function to parse arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -b|--branch)
                BRANCH="$2"
                shift 2
                ;;
            -m|--message)
                COMMIT_MESSAGE="$2"
                shift 2
                ;;
            -t|--tag)
                CREATE_TAG=true
                TAG_NAME="$2"
                shift 2
                ;;
            --push-tags)
                PUSH_TAGS=true
                shift
                ;;
            --dry-run)
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
                exit 1
                ;;
        esac
    done
}

# Function to check git status
check_git_status() {
    print_info "Checking Git status..."
    
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not a Git repository"
        exit 1
    fi
    
    # Check for uncommitted changes
    if git diff-index --quiet HEAD --; then
        print_status "Working directory clean"
    else
        print_warning "Uncommitted changes detected"
    fi
}

# Function to list files to be committed
list_files() {
    print_info "Files to be committed:"
    
    local untracked=$(git ls-files --others --exclude-standard)
    local modified=$(git diff --name-only)
    
    if [ -n "$untracked" ]; then
        echo "  Untracked files:"
        echo "$untracked" | sed 's/^/    /'
    fi
    
    if [ -n "$modified" ]; then
        echo "  Modified files:"
        echo "$modified" | sed 's/^/    /'
    fi
}

# Function to add all files
add_files() {
    print_info "Adding files to staging area..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would run: git add ."
        return
    fi
    
    git add .
    print_status "Files added"
}

# Function to create commit
create_commit() {
    print_info "Creating commit..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would create commit with message:"
        echo "  $COMMIT_MESSAGE"
        return
    fi
    
    git commit -m "$COMMIT_MESSAGE" || print_warning "Nothing to commit"
    print_status "Commit created"
}

# Function to create tag
create_tag() {
    if [ "$CREATE_TAG" = false ]; then
        return
    fi
    
    print_info "Creating tag: $TAG_NAME"
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would create tag: $TAG_NAME"
        return
    fi
    
    if git rev-parse "$TAG_NAME" > /dev/null 2>&1; then
        print_warning "Tag already exists: $TAG_NAME"
        return
    fi
    
    git tag -a "$TAG_NAME" -m "Release $TAG_NAME"
    print_status "Tag created: $TAG_NAME"
}

# Function to push changes
push_changes() {
    print_info "Pushing to remote: $BRANCH"
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would push to: origin $BRANCH"
        return
    fi
    
    git push origin "$BRANCH"
    print_status "Pushed to origin/$BRANCH"
}

# Function to push tags
push_tags_to_remote() {
    if [ "$PUSH_TAGS" = false ]; then
        return
    fi
    
    print_info "Pushing tags to remote..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would push tags"
        return
    fi
    
    git push origin --tags
    print_status "Tags pushed"
}

# Function to display summary
display_summary() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}Push Summary${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo "Branch:         $BRANCH"
    echo "Message:        $COMMIT_MESSAGE"
    echo "Tag:            $TAG_NAME"
    echo "Push Tags:      $PUSH_TAGS"
    
    if [ "$DRY_RUN" = true ]; then
        echo -e "Mode:           ${YELLOW}DRY RUN (no changes made)${NC}"
    else
        echo -e "Status:         ${GREEN}Pushed Successfully${NC}"
        echo ""
        echo "Repository URL:"
        echo "  https://github.com/Kreator8607/wrestling-sim-desktop"
        echo ""
        echo "View changes:"
        echo "  git log --oneline -5"
    fi
    
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Main execution
main() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo "Pro Wrestling Sim v3.0.0 - Automated GitHub Push"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Parse arguments
    parse_arguments "$@"
    
    # Check git status
    check_git_status
    
    # List files
    list_files
    echo ""
    
    # Display configuration
    print_info "Configuration:"
    echo "  Branch:  $BRANCH"
    echo "  Message: $COMMIT_MESSAGE"
    echo "  Tag:     $TAG_NAME"
    echo "  Dry Run: $DRY_RUN"
    echo ""
    
    # Ask for confirmation
    if [ "$DRY_RUN" = false ]; then
        read -p "Continue? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_warning "Push cancelled"
            exit 0
        fi
    fi
    
    # Execute push workflow
    add_files
    create_commit
    create_tag
    push_changes
    push_tags_to_remote
    
    # Display summary
    display_summary
}

# Run main function
main "$@"
