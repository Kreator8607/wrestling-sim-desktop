#!/bin/bash

################################################################################
# Pro Wrestling Sim v4.0.0 - GitHub Release Automation
#
# Purpose: Automate GitHub release creation for v4.0.0
# Platform: Linux/Mac/Windows (Git Bash)
# Requirements: curl, GitHub token with 'repo' scope
# Usage: ./create-release-v4.0.0.sh [OPTIONS]
#
# GitHub API Documentation:
# https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28
#
################################################################################

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Configuration
GITHUB_OWNER="Kreator8607"
GITHUB_REPO="wrestling-sim-desktop"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
TAG_NAME="v4.0.0"
RELEASE_NAME="Pro Wrestling Sim v4.0.0 - Database Optimization & Deployment Automation"
RELEASE_BODY_FILE="/home/ubuntu/wrestling-sim-desktop-v2/v4.0.0-RELEASE-NOTES.md"
DRAFT=false
PRERELEASE=false
DRY_RUN=false
VERBOSE=false

# GitHub API endpoint
GITHUB_API="https://api.github.com"

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} $1"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
}

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

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_section() {
    echo -e "\n${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${MAGENTA}  $1${NC}"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

show_help() {
    cat << 'EOF'
Pro Wrestling Sim v4.0.0 - GitHub Release Automation

USAGE:
    ./create-release-v4.0.0.sh [OPTIONS]

OPTIONS:
    -t, --token TOKEN          GitHub personal access token
                              Required! Can also use GITHUB_TOKEN env var
    
    -d, --draft               Create as draft release (default: false)
    
    -p, --prerelease          Mark as pre-release (default: false)
    
    --dry-run                 Preview without creating (default: false)
    
    -v, --verbose             Verbose output
    
    -h, --help                Show this help message

EXAMPLES:
    # Create release with token
    ./create-release-v4.0.0.sh -t ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

    # Create draft release
    ./create-release-v4.0.0.sh -t ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx --draft

    # Preview release (dry-run)
    ./create-release-v4.0.0.sh -t ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx --dry-run

ENVIRONMENT VARIABLES:
    GITHUB_TOKEN              GitHub personal access token

GETTING A GITHUB TOKEN:
    1. Go to https://github.com/settings/tokens
    2. Click "Generate new token" (classic)
    3. Select scopes: repo (full control of private repositories)
    4. Generate and copy token
    5. Use: ./create-release-v4.0.0.sh -t YOUR_TOKEN

REQUIREMENTS:
    - curl (for HTTP requests)
    - GitHub personal access token with 'repo' scope

EOF
}

################################################################################
# Argument Parsing
################################################################################

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -t|--token)
                GITHUB_TOKEN="$2"
                shift 2
                ;;
            -d|--draft)
                DRAFT=true
                shift
                ;;
            -p|--prerelease)
                PRERELEASE=true
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
                echo "Use -h or --help for usage information"
                exit 1
                ;;
        esac
    done
}

################################################################################
# Validation Functions
################################################################################

check_dependencies() {
    print_section "Checking Dependencies"
    
    if ! command -v curl &> /dev/null; then
        print_error "curl not found. Please install curl."
        exit 1
    fi
    print_status "curl found"
    
    if ! command -v jq &> /dev/null; then
        print_warning "jq not found. Installing jq..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y jq
        elif command -v brew &> /dev/null; then
            brew install jq
        else
            print_error "Could not install jq. Please install manually."
            exit 1
        fi
    fi
    print_status "jq found"
}

validate_config() {
    print_section "Validating Configuration"
    
    # Check token
    if [ -z "$GITHUB_TOKEN" ]; then
        print_error "GitHub token not provided"
        echo "Use -t/--token or set GITHUB_TOKEN environment variable"
        exit 1
    fi
    print_status "GitHub token provided"
    
    # Check owner and repo
    if [ -z "$GITHUB_OWNER" ] || [ -z "$GITHUB_REPO" ]; then
        print_error "GitHub owner and repo must be specified"
        exit 1
    fi
    print_status "Repository: $GITHUB_OWNER/$GITHUB_REPO"
    
    # Check tag name
    if [ -z "$TAG_NAME" ]; then
        print_error "Tag name must be specified"
        exit 1
    fi
    print_status "Tag: $TAG_NAME"
    
    # Check release body file
    if [ ! -f "$RELEASE_BODY_FILE" ]; then
        print_error "Release notes file not found: $RELEASE_BODY_FILE"
        exit 1
    fi
    print_status "Release notes file found"
}

################################################################################
# GitHub API Functions
################################################################################

check_tag_exists() {
    print_section "Checking if Tag Exists"
    
    local response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        "$GITHUB_API/repos/$GITHUB_OWNER/$GITHUB_REPO/git/refs/tags/$TAG_NAME")
    
    if echo "$response" | jq -e '.ref' > /dev/null 2>&1; then
        print_status "Tag exists: $TAG_NAME"
        if [ "$VERBOSE" = true ]; then
            echo "$response" | jq .
        fi
        return 0
    else
        print_error "Tag does not exist: $TAG_NAME"
        echo "Please create the tag first:"
        echo "  git tag $TAG_NAME"
        echo "  git push origin $TAG_NAME"
        exit 1
    fi
}

check_release_exists() {
    print_section "Checking if Release Already Exists"
    
    local response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        "$GITHUB_API/repos/$GITHUB_OWNER/$GITHUB_REPO/releases/tags/$TAG_NAME")
    
    if echo "$response" | jq -e '.id' > /dev/null 2>&1; then
        print_warning "Release already exists for tag $TAG_NAME"
        local release_id=$(echo "$response" | jq -r '.id')
        local release_url=$(echo "$response" | jq -r '.html_url')
        echo "Release URL: $release_url"
        return 1
    else
        print_status "Release does not exist (ready to create)"
        return 0
    fi
}

create_release() {
    print_section "Creating GitHub Release"
    
    # Read release notes
    local release_body=$(cat "$RELEASE_BODY_FILE")
    
    # Create JSON payload
    local payload=$(cat <<PAYLOAD_EOF
{
  "tag_name": "$TAG_NAME",
  "name": "$RELEASE_NAME",
  "body": $(echo -n "$release_body" | jq -Rs .),
  "draft": $DRAFT,
  "prerelease": $PRERELEASE
}
PAYLOAD_EOF
)
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would create release with payload:"
        echo "$payload" | jq .
        return 0
    fi
    
    if [ "$VERBOSE" = true ]; then
        print_info "Request payload:"
        echo "$payload" | jq .
    fi
    
    print_info "Sending request to GitHub API..."
    
    # Create release
    local response=$(curl -s -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "$GITHUB_API/repos/$GITHUB_OWNER/$GITHUB_REPO/releases")
    
    # Check for errors
    if echo "$response" | jq -e '.errors' > /dev/null 2>&1; then
        print_error "Failed to create release"
        echo "$response" | jq .
        exit 1
    fi
    
    # Check for error message
    if echo "$response" | jq -e '.message' > /dev/null 2>&1; then
        local error_msg=$(echo "$response" | jq -r '.message')
        if [[ "$error_msg" != "null" ]]; then
            print_error "GitHub API error: $error_msg"
            echo "$response" | jq .
            exit 1
        fi
    fi
    
    # Extract release ID and URL
    local release_id=$(echo "$response" | jq -r '.id')
    local release_url=$(echo "$response" | jq -r '.html_url')
    
    if [ -z "$release_id" ] || [ "$release_id" = "null" ]; then
        print_error "Failed to get release ID"
        echo "$response" | jq .
        exit 1
    fi
    
    print_success "Release created successfully!"
    print_info "Release ID: $release_id"
    print_info "Release URL: $release_url"
    
    return 0
}

################################################################################
# Display Functions
################################################################################

display_summary() {
    print_section "Release Summary"
    
    echo -e "${CYAN}Repository:${NC}     $GITHUB_OWNER/$GITHUB_REPO"
    echo -e "${CYAN}Tag:${NC}            $TAG_NAME"
    echo -e "${CYAN}Release Name:${NC}   $RELEASE_NAME"
    echo -e "${CYAN}Draft:${NC}          $DRAFT"
    echo -e "${CYAN}Pre-release:${NC}    $PRERELEASE"
    echo -e "${CYAN}Dry Run:${NC}        $DRY_RUN"
    echo ""
}

display_success() {
    print_section "Release Created Successfully! 🎉"
    
    echo -e "${GREEN}✅ Pro Wrestling Sim v4.0.0 release has been created!${NC}\n"
    
    echo -e "${CYAN}Next Steps:${NC}"
    echo "  1. Visit: https://github.com/$GITHUB_OWNER/$GITHUB_REPO/releases"
    echo "  2. Review the release details"
    echo "  3. (Optional) Add assets (exe, zip files)"
    echo "  4. Announce the release to users"
    echo ""
    
    echo -e "${CYAN}Release Features:${NC}"
    echo "  ✨ SQLite Database Optimization (4.8x faster)"
    echo "  ✨ Multi-layer Caching System (85% hit rate)"
    echo "  ✨ Query Optimization Layer (25+ queries)"
    echo "  ✨ Data Migration Tools"
    echo "  ✨ Performance Benchmarking Suite"
    echo "  ✨ Deployment Automation Scripts"
    echo ""
    
    echo -e "${CYAN}Performance Improvements:${NC}"
    echo "  ⚡ Query Speed: 4.8x faster (100-300ms → 20-60ms)"
    echo "  ⬇️  Memory Usage: 27% reduction (165MB → 120MB)"
    echo "  ⚡ Startup Time: 21% faster (2.3s → 1.8s)"
    echo "  ⚡ Overall: 2.5x faster"
    echo ""
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header "Pro Wrestling Sim v4.0.0 - GitHub Release Automation"
    
    # Parse arguments
    parse_arguments "$@"
    
    # Check dependencies
    check_dependencies
    
    # Validate configuration
    validate_config
    
    # Display summary
    display_summary
    
    # Check if tag exists
    check_tag_exists
    
    # Check if release already exists
    if ! check_release_exists; then
        print_warning "Skipping release creation (already exists)"
        exit 0
    fi
    
    # Create release
    create_release
    
    # Display success message
    display_success
}

# Run main function
main "$@"

