#!/bin/bash

################################################################################
# Pro Wrestling Sim v3.0.0 - GitHub Release Automation (API)
# 
# Purpose: Automate GitHub release creation using GitHub API
# Platform: Linux/Mac/Windows (Git Bash)
# Requirements: curl, jq, GitHub token
# Usage: ./github-release.sh [options]
#
# GitHub API Documentation:
# https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28
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
GITHUB_OWNER="Kreator8607"
GITHUB_REPO="wrestling-sim-desktop"
GITHUB_TOKEN=""
TAG_NAME="v3.0.0"
RELEASE_NAME="Pro Wrestling Sim v3.0.0"
RELEASE_BODY=""
RELEASE_BODY_FILE=""
DRAFT=false
PRERELEASE=false
UPLOAD_ASSETS=false
ASSETS_DIR=""
DRY_RUN=false
VERBOSE=false

# GitHub API endpoint
GITHUB_API="https://api.github.com"

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
Pro Wrestling Sim v3.0.0 - GitHub Release Automation (API)

USAGE:
    ./github-release.sh [OPTIONS]

OPTIONS:
    -o, --owner OWNER           GitHub repository owner
                               Default: Kreator8607
    
    -r, --repo REPO            GitHub repository name
                               Default: wrestling-sim-desktop
    
    -t, --token TOKEN          GitHub personal access token
                               Required! Can also use GITHUB_TOKEN env var
    
    -n, --tag-name TAG         Release tag name
                               Default: v3.0.0
    
    -N, --release-name NAME    Release display name
                               Default: Pro Wrestling Sim v3.0.0
    
    -b, --body TEXT            Release description text
    
    -B, --body-file FILE       Read release description from file
    
    -d, --draft               Create as draft release
    
    -p, --prerelease          Mark as pre-release
    
    -a, --upload-assets DIR   Upload assets from directory
    
    --dry-run                 Preview without creating
    
    -v, --verbose             Verbose output
    
    -h, --help                Show this help message

EXAMPLES:
    # Create basic release
    ./github-release.sh -t YOUR_TOKEN

    # Create with description file
    ./github-release.sh -t YOUR_TOKEN -B CHANGELOG.md

    # Create draft release with assets
    ./github-release.sh -t YOUR_TOKEN -d -a ./dist

    # Preview release
    ./github-release.sh -t YOUR_TOKEN --dry-run

ENVIRONMENT VARIABLES:
    GITHUB_TOKEN              GitHub personal access token
    GITHUB_OWNER             Repository owner (default: Kreator8607)
    GITHUB_REPO              Repository name (default: wrestling-sim-desktop)

REQUIREMENTS:
    - curl (for HTTP requests)
    - jq (for JSON parsing)
    - GitHub personal access token with 'repo' scope

GETTING A GITHUB TOKEN:
    1. Go to https://github.com/settings/tokens
    2. Click "Generate new token"
    3. Select scopes: repo (full control of private repositories)
    4. Generate and copy token
    5. Use: ./github-release.sh -t YOUR_TOKEN

EOF
}

# Function to parse arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -o|--owner)
                GITHUB_OWNER="$2"
                shift 2
                ;;
            -r|--repo)
                GITHUB_REPO="$2"
                shift 2
                ;;
            -t|--token)
                GITHUB_TOKEN="$2"
                shift 2
                ;;
            -n|--tag-name)
                TAG_NAME="$2"
                shift 2
                ;;
            -N|--release-name)
                RELEASE_NAME="$2"
                shift 2
                ;;
            -b|--body)
                RELEASE_BODY="$2"
                shift 2
                ;;
            -B|--body-file)
                RELEASE_BODY_FILE="$2"
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
            -a|--upload-assets)
                UPLOAD_ASSETS=true
                ASSETS_DIR="$2"
                shift 2
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

# Function to check dependencies
check_dependencies() {
    print_info "Checking dependencies..."
    
    local missing=false
    
    if ! command -v curl &> /dev/null; then
        print_error "curl not found. Please install curl."
        missing=true
    fi
    
    if ! command -v jq &> /dev/null; then
        print_error "jq not found. Please install jq."
        missing=true
    fi
    
    if [ "$missing" = true ]; then
        exit 1
    fi
    
    print_status "Dependencies OK"
}

# Function to validate configuration
validate_config() {
    print_info "Validating configuration..."
    
    # Check token
    if [ -z "$GITHUB_TOKEN" ]; then
        if [ -z "$GITHUB_TOKEN" ]; then
            print_error "GitHub token not provided"
            echo "Use -t/--token or set GITHUB_TOKEN environment variable"
            exit 1
        fi
    fi
    
    # Check owner and repo
    if [ -z "$GITHUB_OWNER" ] || [ -z "$GITHUB_REPO" ]; then
        print_error "GitHub owner and repo must be specified"
        exit 1
    fi
    
    # Check tag name
    if [ -z "$TAG_NAME" ]; then
        print_error "Tag name must be specified"
        exit 1
    fi
    
    # Check body file if specified
    if [ -n "$RELEASE_BODY_FILE" ]; then
        if [ ! -f "$RELEASE_BODY_FILE" ]; then
            print_error "Body file not found: $RELEASE_BODY_FILE"
            exit 1
        fi
        RELEASE_BODY=$(cat "$RELEASE_BODY_FILE")
    fi
    
    # Check assets directory if specified
    if [ "$UPLOAD_ASSETS" = true ]; then
        if [ ! -d "$ASSETS_DIR" ]; then
            print_error "Assets directory not found: $ASSETS_DIR"
            exit 1
        fi
    fi
    
    print_status "Configuration valid"
}

# Function to check if tag exists
check_tag_exists() {
    print_info "Checking if tag exists..."
    
    local response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        "$GITHUB_API/repos/$GITHUB_OWNER/$GITHUB_REPO/git/refs/tags/$TAG_NAME")
    
    if echo "$response" | jq -e '.ref' > /dev/null 2>&1; then
        print_status "Tag exists: $TAG_NAME"
        return 0
    else
        print_warning "Tag does not exist: $TAG_NAME"
        return 1
    fi
}

# Function to create release
create_release() {
    print_info "Creating release..."
    
    # Prepare JSON payload
    local payload=$(cat <<EOF
{
  "tag_name": "$TAG_NAME",
  "name": "$RELEASE_NAME",
  "body": $(echo -n "$RELEASE_BODY" | jq -Rs .),
  "draft": $DRAFT,
  "prerelease": $PRERELEASE
}
EOF
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
    
    # Create release
    local response=$(curl -s -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -d "$payload" \
        "$GITHUB_API/repos/$GITHUB_OWNER/$GITHUB_REPO/releases")
    
    # Check for errors
    if echo "$response" | jq -e '.errors' > /dev/null 2>&1; then
        print_error "Failed to create release"
        echo "$response" | jq .
        exit 1
    fi
    
    # Extract release ID
    local release_id=$(echo "$response" | jq -r '.id')
    if [ -z "$release_id" ] || [ "$release_id" = "null" ]; then
        print_error "Failed to get release ID"
        echo "$response" | jq .
        exit 1
    fi
    
    print_status "Release created: $release_id"
    echo "$release_id"
}

# Function to upload assets
upload_assets() {
    local release_id=$1
    
    if [ "$UPLOAD_ASSETS" = false ]; then
        return
    fi
    
    print_info "Uploading assets from: $ASSETS_DIR"
    
    local assets=$(find "$ASSETS_DIR" -type f -maxdepth 1)
    local count=0
    
    for asset in $assets; do
        if [ "$DRY_RUN" = true ]; then
            print_info "[DRY RUN] Would upload: $(basename "$asset")"
            ((count++))
            continue
        fi
        
        local filename=$(basename "$asset")
        local mime_type="application/octet-stream"
        
        # Determine MIME type
        case "${filename##*.}" in
            exe) mime_type="application/x-msdownload" ;;
            zip) mime_type="application/zip" ;;
            txt) mime_type="text/plain" ;;
            md) mime_type="text/markdown" ;;
            pdf) mime_type="application/pdf" ;;
        esac
        
        print_info "Uploading: $filename"
        
        local upload_response=$(curl -s -X POST \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Content-Type: $mime_type" \
            --data-binary @"$asset" \
            "$GITHUB_API/repos/$GITHUB_OWNER/$GITHUB_REPO/releases/$release_id/assets?name=$filename")
        
        if echo "$upload_response" | jq -e '.id' > /dev/null 2>&1; then
            print_status "Uploaded: $filename"
            ((count++))
        else
            print_error "Failed to upload: $filename"
        fi
    done
    
    print_status "Uploaded $count assets"
}

# Function to display summary
display_summary() {
    local release_id=$1
    
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}Release Summary${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo "Owner:          $GITHUB_OWNER"
    echo "Repository:     $GITHUB_REPO"
    echo "Tag:            $TAG_NAME"
    echo "Release Name:   $RELEASE_NAME"
    echo "Release ID:     $release_id"
    echo "Draft:          $DRAFT"
    echo "Pre-release:    $PRERELEASE"
    
    if [ "$DRY_RUN" = true ]; then
        echo -e "Mode:           ${YELLOW}DRY RUN (no changes made)${NC}"
    else
        echo -e "Status:         ${GREEN}Created Successfully${NC}"
        echo ""
        echo "Release URL:"
        echo "  https://github.com/$GITHUB_OWNER/$GITHUB_REPO/releases/tag/$TAG_NAME"
    fi
    
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Function to handle errors
handle_error() {
    print_error "An error occurred during release creation"
    exit 1
}

# Main execution
main() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo "Pro Wrestling Sim v3.0.0 - GitHub Release Automation (API)"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Parse arguments
    parse_arguments "$@"
    
    # Set error trap
    trap handle_error ERR
    
    # Check dependencies
    check_dependencies
    
    # Validate configuration
    validate_config
    
    # Display configuration
    print_info "Configuration:"
    echo "  Owner:     $GITHUB_OWNER"
    echo "  Repo:      $GITHUB_REPO"
    echo "  Tag:       $TAG_NAME"
    echo "  Name:      $RELEASE_NAME"
    echo "  Draft:     $DRAFT"
    echo "  Pre-release: $PRERELEASE"
    echo ""
    
    # Check if tag exists
    check_tag_exists || print_warning "Creating release for non-existent tag"
    
    # Ask for confirmation
    if [ "$DRY_RUN" = false ]; then
        read -p "Create release? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_warning "Release creation cancelled"
            exit 0
        fi
    fi
    
    # Create release
    local release_id=$(create_release)
    
    # Upload assets
    if [ -n "$release_id" ] && [ "$release_id" != "null" ]; then
        upload_assets "$release_id"
    fi
    
    # Display summary
    display_summary "$release_id"
}

# Run main function
main "$@"
