#!/bin/bash

################################################################################
# Pro Wrestling Sim v3.0.0 - Interactive Git Release Menu
# 
# Purpose: Interactive menu for git release workflow
# Platform: Linux/Mac/Windows (Git Bash)
# Usage: ./git-release-interactive.sh
#
################################################################################

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Default values
COMMIT_MESSAGE="Release: Pro Wrestling Sim v3.0.0 - Build fixes and improvements"
TAG_VERSION="v3.0.0"
BRANCH="main"
DRY_RUN=false

# Function to clear screen
clear_screen() {
    clear || cls
}

# Function to print header
print_header() {
    clear_screen
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║  Pro Wrestling Sim v3.0.0 - Git Release Automation       ║"
    echo "║  Interactive Menu                                         ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Function to print menu
print_menu() {
    echo ""
    echo -e "${BLUE}Current Configuration:${NC}"
    echo "  Branch:  $BRANCH"
    echo "  Tag:     $TAG_VERSION"
    echo "  Message: ${COMMIT_MESSAGE:0:50}..."
    echo ""
    echo -e "${BLUE}Main Menu:${NC}"
    echo "  1) Quick Release (with current settings)"
    echo "  2) Configure Settings"
    echo "  3) Preview Changes (Dry Run)"
    echo "  4) View Git Status"
    echo "  5) Exit"
    echo ""
    echo -n "Select option (1-5): "
}

# Function to show configuration menu
show_config_menu() {
    while true; do
        print_header
        echo -e "${BLUE}Configuration Menu:${NC}"
        echo ""
        echo "  1) Change Commit Message"
        echo "  2) Change Tag Version"
        echo "  3) Change Branch"
        echo "  4) Reset to Defaults"
        echo "  5) Back to Main Menu"
        echo ""
        echo -n "Select option (1-5): "
        read -r option
        
        case $option in
            1)
                echo ""
                echo -e "${YELLOW}Current message:${NC}"
                echo "  $COMMIT_MESSAGE"
                echo ""
                echo -n "Enter new commit message: "
                read -r new_message
                if [ -n "$new_message" ]; then
                    COMMIT_MESSAGE="$new_message"
                    echo -e "${GREEN}✓${NC} Message updated"
                fi
                sleep 1
                ;;
            2)
                echo ""
                echo -e "${YELLOW}Current tag:${NC}"
                echo "  $TAG_VERSION"
                echo ""
                echo -n "Enter new tag version (e.g., v3.0.0): "
                read -r new_tag
                if [ -n "$new_tag" ]; then
                    TAG_VERSION="$new_tag"
                    echo -e "${GREEN}✓${NC} Tag updated"
                fi
                sleep 1
                ;;
            3)
                echo ""
                echo -e "${YELLOW}Current branch:${NC}"
                echo "  $BRANCH"
                echo ""
                echo "Available branches:"
                git branch -a | sed 's/^/  /'
                echo ""
                echo -n "Enter branch name: "
                read -r new_branch
                if [ -n "$new_branch" ]; then
                    BRANCH="$new_branch"
                    echo -e "${GREEN}✓${NC} Branch updated"
                fi
                sleep 1
                ;;
            4)
                COMMIT_MESSAGE="Release: Pro Wrestling Sim v3.0.0 - Build fixes and improvements"
                TAG_VERSION="v3.0.0"
                BRANCH="main"
                echo -e "${GREEN}✓${NC} Configuration reset to defaults"
                sleep 1
                ;;
            5)
                return
                ;;
            *)
                echo -e "${RED}✗${NC} Invalid option"
                sleep 1
                ;;
        esac
    done
}

# Function to perform dry run
perform_dry_run() {
    print_header
    echo -e "${YELLOW}DRY RUN - Preview of changes:${NC}"
    echo ""
    echo "Changes to be committed:"
    git diff --cached --name-status | sed 's/^/  /'
    echo ""
    echo "Git commands that would be executed:"
    echo "  1. git add ."
    echo "  2. git commit -m '$COMMIT_MESSAGE'"
    echo "  3. git tag -a $TAG_VERSION -m 'Release $TAG_VERSION'"
    echo "  4. git push origin $BRANCH"
    echo "  5. git push origin $TAG_VERSION"
    echo ""
    echo -n "Press Enter to continue..."
    read -r
}

# Function to show git status
show_git_status() {
    print_header
    echo -e "${BLUE}Git Status:${NC}"
    echo ""
    git status
    echo ""
    echo -n "Press Enter to continue..."
    read -r
}

# Function to perform quick release
perform_quick_release() {
    print_header
    echo -e "${BLUE}Quick Release:${NC}"
    echo ""
    echo "Configuration:"
    echo "  Branch:  $BRANCH"
    echo "  Tag:     $TAG_VERSION"
    echo "  Message: $COMMIT_MESSAGE"
    echo ""
    echo "Changes to be committed:"
    git diff --cached --name-status | sed 's/^/  /'
    echo ""
    echo -n "Continue with release? (y/n): "
    read -r confirm
    
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo -e "${YELLOW}✓${NC} Release cancelled"
        sleep 1
        return
    fi
    
    echo ""
    echo -e "${CYAN}Executing release workflow...${NC}"
    echo ""
    
    # Stage changes
    echo -n "Staging changes... "
    git add .
    echo -e "${GREEN}Done${NC}"
    
    # Create commit
    echo -n "Creating commit... "
    git commit -m "$COMMIT_MESSAGE" > /dev/null 2>&1
    echo -e "${GREEN}Done${NC}"
    
    # Create tag
    echo -n "Creating tag... "
    git tag -a "$TAG_VERSION" -m "Release $TAG_VERSION" > /dev/null 2>&1
    echo -e "${GREEN}Done${NC}"
    
    # Push commits
    echo -n "Pushing commits... "
    git push origin "$BRANCH" > /dev/null 2>&1
    echo -e "${GREEN}Done${NC}"
    
    # Push tags
    echo -n "Pushing tags... "
    git push origin "$TAG_VERSION" > /dev/null 2>&1
    echo -e "${GREEN}Done${NC}"
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}Release Completed Successfully!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Verify release on GitHub"
    echo "  2. Monitor GitHub Actions workflow"
    echo "  3. Download executable when build completes"
    echo ""
    echo -n "Press Enter to continue..."
    read -r
}

# Main loop
main() {
    while true; do
        print_header
        print_menu
        read -r option
        
        case $option in
            1)
                perform_quick_release
                ;;
            2)
                show_config_menu
                ;;
            3)
                perform_dry_run
                ;;
            4)
                show_git_status
                ;;
            5)
                print_header
                echo -e "${GREEN}Thank you for using Git Release Automation!${NC}"
                echo ""
                exit 0
                ;;
            *)
                echo -e "${RED}✗${NC} Invalid option"
                sleep 1
                ;;
        esac
    done
}

# Run main function
main
