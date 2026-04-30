#Requires -Version 5.0
<#
.SYNOPSIS
    Pro Wrestling Sim v3.0.0 - Git Release Automation Script (Windows PowerShell)

.DESCRIPTION
    Automates git commit, push, and tag creation for releases on Windows.
    Provides interactive prompts and colored output for better UX.

.PARAMETER Message
    Commit message (default: "Release: Pro Wrestling Sim v3.0.0 - Build fixes and improvements")

.PARAMETER Tag
    Tag version (default: "v3.0.0")

.PARAMETER Branch
    Branch to push to (default: "main")

.PARAMETER DryRun
    Show what would be done without executing

.PARAMETER Help
    Show help information

.EXAMPLE
    .\git-release.ps1
    Standard release with default settings

.EXAMPLE
    .\git-release.ps1 -Message "Release v3.0.0 with Windows build" -Tag v3.0.0
    Custom message and tag

.EXAMPLE
    .\git-release.ps1 -DryRun
    Preview changes without executing

.NOTES
    Author: Pro Wrestling Sim Team
    Version: 1.0
    Date: April 30, 2024
    Platform: Windows PowerShell 5.0+
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "Release: Pro Wrestling Sim v3.0.0 - Build fixes and improvements",
    
    [Parameter(Mandatory=$false)]
    [string]$Tag = "v3.0.0",
    
    [Parameter(Mandatory=$false)]
    [string]$Branch = "main",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$Help
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Color codes
$Colors = @{
    Green  = [System.ConsoleColor]::Green
    Red    = [System.ConsoleColor]::Red
    Yellow = [System.ConsoleColor]::Yellow
    Blue   = [System.ConsoleColor]::Blue
    White  = [System.ConsoleColor]::White
}

# Function to print colored output
function Write-Status {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    
    $symbol = switch ($Type) {
        "Success" { "✓"; $Colors.Green }
        "Error"   { "✗"; $Colors.Red }
        "Warning" { "⚠"; $Colors.Yellow }
        "Info"    { "ℹ"; $Colors.Blue }
        default   { "•"; $Colors.White }
    }
    
    $color = $Colors[$Type] ?? $Colors.White
    
    Write-Host $symbol -ForegroundColor $color -NoNewline
    Write-Host " $Message"
}

# Function to show help
function Show-Help {
    @"
Pro Wrestling Sim v3.0.0 - Git Release Automation (Windows PowerShell)

USAGE:
    .\git-release.ps1 [OPTIONS]

OPTIONS:
    -Message TEXT       Commit message
                       Default: "Release: Pro Wrestling Sim v3.0.0 - Build fixes and improvements"
    
    -Tag VERSION        Tag version
                       Default: "v3.0.0"
    
    -Branch NAME        Branch to push to
                       Default: "main"
    
    -DryRun            Show what would be done without executing
    
    -Help              Show this help message

EXAMPLES:
    # Standard release
    .\git-release.ps1
    
    # Custom message and tag
    .\git-release.ps1 -Message "Release v3.0.0" -Tag v3.0.0
    
    # Dry run to preview
    .\git-release.ps1 -DryRun
    
    # Push to different branch
    .\git-release.ps1 -Branch develop

WORKFLOW:
    1. Check git status
    2. Stage all changes (git add .)
    3. Create commit with message
    4. Create annotated tag
    5. Push commits to remote
    6. Push tags to remote
    7. Display summary

REQUIREMENTS:
    - Git installed and in PATH
    - Repository initialized
    - Remote origin configured
    - User has push permissions

"@
}

# Function to check git status
function Test-GitStatus {
    Write-Status "Checking git status..." "Info"
    
    try {
        $gitDir = git rev-parse --git-dir 2>$null
        if (-not $gitDir) {
            Write-Status "Not a git repository" "Error"
            exit 1
        }
    }
    catch {
        Write-Status "Git not found or not in PATH" "Error"
        exit 1
    }
    
    # Check git configuration
    try {
        $userName = git config user.name
        if (-not $userName) {
            Write-Status "Git user.name not configured" "Error"
            Write-Host "Run: git config user.name 'Your Name'"
            exit 1
        }
        
        $userEmail = git config user.email
        if (-not $userEmail) {
            Write-Status "Git user.email not configured" "Error"
            Write-Host "Run: git config user.email 'your.email@example.com'"
            exit 1
        }
    }
    catch {
        Write-Status "Error checking git configuration" "Error"
        exit 1
    }
    
    Write-Status "Git status OK" "Success"
}

# Function to display changes
function Show-Changes {
    Write-Status "Changes to be committed:" "Info"
    Write-Host ""
    
    $changes = git diff --cached --name-status 2>$null
    if ($changes) {
        $changes | ForEach-Object { Write-Host "  $_" }
    }
    else {
        Write-Host "  (no changes)"
    }
    
    Write-Host ""
}

# Function to stage changes
function Stage-Changes {
    Write-Status "Staging all changes..." "Info"
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Would execute: git add ." "Info"
    }
    else {
        git add . 2>$null
        Write-Status "Changes staged" "Success"
    }
}

# Function to create commit
function New-Commit {
    Write-Status "Creating commit..." "Info"
    Write-Status "Message: $Message" "Info"
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Would execute: git commit -m '$Message'" "Info"
    }
    else {
        git commit -m $Message 2>$null
        Write-Status "Commit created" "Success"
    }
}

# Function to create tag
function New-Tag {
    Write-Status "Creating tag: $Tag" "Info"
    
    # Check if tag already exists
    $existingTag = git rev-parse $Tag 2>$null
    if ($existingTag) {
        Write-Status "Tag $Tag already exists" "Warning"
        
        $response = Read-Host "Do you want to delete and recreate it? (y/n)"
        if ($response -eq 'y' -or $response -eq 'Y') {
            if ($DryRun) {
                Write-Status "[DRY RUN] Would execute: git tag -d $Tag" "Info"
            }
            else {
                git tag -d $Tag 2>$null
                Write-Status "Old tag deleted" "Success"
            }
        }
        else {
            Write-Status "Tag creation cancelled" "Error"
            exit 1
        }
    }
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Would execute: git tag -a $Tag -m 'Release $Tag'" "Info"
    }
    else {
        git tag -a $Tag -m "Release $Tag" 2>$null
        Write-Status "Tag created: $Tag" "Success"
    }
}

# Function to push commits
function Push-Commits {
    Write-Status "Pushing commits to origin/$Branch..." "Info"
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Would execute: git push origin $Branch" "Info"
    }
    else {
        try {
            git push origin $Branch 2>$null
            Write-Status "Commits pushed to origin/$Branch" "Success"
        }
        catch {
            Write-Status "Failed to push commits" "Error"
            exit 1
        }
    }
}

# Function to push tags
function Push-Tags {
    Write-Status "Pushing tags to origin..." "Info"
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Would execute: git push origin $Tag" "Info"
    }
    else {
        try {
            git push origin $Tag 2>$null
            Write-Status "Tag pushed to origin" "Success"
        }
        catch {
            Write-Status "Failed to push tag" "Error"
            exit 1
        }
    }
}

# Function to display summary
function Show-Summary {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Release Summary" -ForegroundColor Green
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Branch:           $Branch"
    Write-Host "Tag:              $Tag"
    Write-Host "Commit Message:   $Message"
    
    if ($DryRun) {
        Write-Host "Mode:             " -NoNewline
        Write-Host "DRY RUN (no changes made)" -ForegroundColor Yellow
    }
    else {
        Write-Host "Status:           " -NoNewline
        Write-Host "Released Successfully" -ForegroundColor Green
    }
    
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not $DryRun) {
        Write-Status "Next steps:" "Info"
        Write-Host "  1. Verify release on GitHub: https://github.com/Kreator8607/wrestling-sim-desktop/releases"
        Write-Host "  2. Monitor GitHub Actions workflow"
        Write-Host "  3. Download executable when build completes"
        Write-Host "  4. Verify checksums for integrity"
    }
}

# Main execution
function Main {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Pro Wrestling Sim v3.0.0 - Git Release Automation" -ForegroundColor Green
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    if ($Help) {
        Show-Help
        exit 0
    }
    
    # Display configuration
    Write-Status "Configuration:" "Info"
    Write-Host "  Branch:  $Branch"
    Write-Host "  Tag:     $Tag"
    Write-Host "  Message: $Message"
    Write-Host ""
    
    # Check git status
    Test-GitStatus
    
    # Display changes
    Show-Changes
    
    # Ask for confirmation
    if (-not $DryRun) {
        $response = Read-Host "Continue with release? (y/n)"
        if ($response -ne 'y' -and $response -ne 'Y') {
            Write-Status "Release cancelled" "Warning"
            exit 0
        }
    }
    
    # Execute workflow
    Stage-Changes
    New-Commit
    New-Tag
    Push-Commits
    Push-Tags
    
    # Display summary
    Show-Summary
}

# Run main function
try {
    Main
}
catch {
    Write-Status "An error occurred: $_" "Error"
    Write-Host ""
    Write-Host "Current git status:"
    git status
    exit 1
}
