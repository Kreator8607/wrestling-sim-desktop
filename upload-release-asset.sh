#!/bin/bash

################################################################################
# Pro Wrestling Sim v4.0.0 - Upload Release Asset to GitHub
#
# Purpose: Upload executable and other assets to GitHub release
# Platform: Linux/Mac/Windows (Git Bash)
# Requirements: curl, jq
# Usage: ./upload-release-asset.sh -t TOKEN -f FILE -r RELEASE_ID
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

# Configuration
GITHUB_OWNER="Kreator8607"
GITHUB_REPO="wrestling-sim-desktop"
GITHUB_API="https://api.github.com"
RELEASE_ID=""
TOKEN=""
FILE=""
VERBOSE=false
DRY_RUN=false

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} Pro Wrestling Sim v4.0.0 - Upload Release Asset"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
}

print_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -t, --token TOKEN          GitHub personal access token (required)"
    echo "  -r, --release-id ID        Release ID (required)"
    echo "  -f, --file FILE            File to upload (required)"
    echo "  --dry-run                  Preview without uploading"
    echo "  -v, --verbose              Verbose output"
    echo "  -h, --help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -t ghp_xxx -r 316310400 -f Pro-Wrestling-Sim-4.0.0.exe"
    echo "  $0 -t ghp_xxx -r 316310400 -f Pro-Wrestling-Sim-4.0.0.exe --dry-run"
}

print_error() {
    echo -e "${RED}✗ Error: $1${NC}" >&2
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${CYAN}→ $1${NC}"
    fi
}

################################################################################
# Validation Functions
################################################################################

validate_dependencies() {
    print_verbose "Validating dependencies..."
    
    if ! command -v curl &> /dev/null; then
        print_error "curl is not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_error "jq is not installed"
        exit 1
    fi
    
    print_success "Dependencies validated"
}

validate_token() {
    if [ -z "$TOKEN" ]; then
        print_error "GitHub token not provided"
        echo "Use -t or --token to provide token"
        exit 1
    fi
    
    print_verbose "Validating GitHub token..."
    
    local response=$(curl -s -H "Authorization: token $TOKEN" "$GITHUB_API/user")
    local login=$(echo "$response" | jq -r '.login // empty')
    
    if [ -z "$login" ]; then
        print_error "Invalid GitHub token"
        exit 1
    fi
    
    print_success "GitHub token validated (user: $login)"
}

validate_file() {
    if [ -z "$FILE" ]; then
        print_error "File not provided"
        echo "Use -f or --file to provide file path"
        exit 1
    fi
    
    if [ ! -f "$FILE" ]; then
        print_error "File not found: $FILE"
        exit 1
    fi
    
    local file_size=$(stat -f%z "$FILE" 2>/dev/null || stat -c%s "$FILE" 2>/dev/null)
    local file_size_mb=$((file_size / 1024 / 1024))
    
    print_verbose "File: $FILE"
    print_verbose "Size: ${file_size_mb}MB"
    print_success "File validated"
}

validate_release() {
    if [ -z "$RELEASE_ID" ]; then
        print_error "Release ID not provided"
        echo "Use -r or --release-id to provide release ID"
        exit 1
    fi
    
    print_verbose "Validating release..."
    
    local response=$(curl -s -H "Authorization: token $TOKEN" \
        "$GITHUB_API/repos/$GITHUB_OWNER/$GITHUB_REPO/releases/$RELEASE_ID")
    
    local release_id=$(echo "$response" | jq -r '.id // empty')
    
    if [ -z "$release_id" ]; then
        print_error "Release not found: $RELEASE_ID"
        exit 1
    fi
    
    local tag_name=$(echo "$response" | jq -r '.tag_name')
    print_verbose "Release tag: $tag_name"
    print_success "Release validated"
}

################################################################################
# Upload Functions
################################################################################

upload_asset() {
    local filename=$(basename "$FILE")
    local file_size=$(stat -f%z "$FILE" 2>/dev/null || stat -c%s "$FILE" 2>/dev/null)
    
    print_info "Uploading asset..."
    print_verbose "Filename: $filename"
    print_verbose "Size: $((file_size / 1024 / 1024))MB"
    
    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN: Would upload $filename ($((file_size / 1024 / 1024))MB)"
        return 0
    fi
    
    local upload_url="$GITHUB_API/repos/$GITHUB_OWNER/$GITHUB_REPO/releases/$RELEASE_ID/assets"
    
    print_verbose "Upload URL: $upload_url"
    
    local response=$(curl -s -X POST \
        -H "Authorization: token $TOKEN" \
        -H "Content-Type: application/octet-stream" \
        --data-binary @"$FILE" \
        "$upload_url?name=$filename")
    
    local asset_id=$(echo "$response" | jq -r '.id // empty')
    local error=$(echo "$response" | jq -r '.message // empty')
    
    if [ -z "$asset_id" ]; then
        if [ ! -z "$error" ]; then
            print_error "Upload failed: $error"
        else
            print_error "Upload failed: Unknown error"
        fi
        echo "$response" | jq '.'
        exit 1
    fi
    
    local asset_url=$(echo "$response" | jq -r '.browser_download_url')
    
    print_success "Asset uploaded successfully"
    print_verbose "Asset ID: $asset_id"
    print_verbose "Download URL: $asset_url"
    
    echo ""
    echo -e "${GREEN}✓ Upload Complete${NC}"
    echo ""
    echo "Asset Details:"
    echo "  Name: $filename"
    echo "  Size: $((file_size / 1024 / 1024))MB"
    echo "  ID: $asset_id"
    echo "  Download: $asset_url"
}

################################################################################
# Argument Parsing
################################################################################

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -t|--token)
                TOKEN="$2"
                shift 2
                ;;
            -r|--release-id)
                RELEASE_ID="$2"
                shift 2
                ;;
            -f|--file)
                FILE="$2"
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
                print_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                print_usage
                exit 1
                ;;
        esac
    done
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header
    echo ""
    
    parse_arguments "$@"
    
    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN MODE - No changes will be made"
        echo ""
    fi
    
    validate_dependencies
    validate_token
    validate_file
    validate_release
    
    echo ""
    upload_asset
    
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} Upload Complete"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
}

# Run main function
main "$@"
