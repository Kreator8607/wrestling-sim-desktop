#Requires -Version 5.0
<#
.SYNOPSIS
    Pro Wrestling Sim v3.0.0 - GitHub Release Automation (API)

.DESCRIPTION
    Automate GitHub release creation using GitHub API via PowerShell.
    Supports creating releases, uploading assets, and managing pre-releases.

.PARAMETER Owner
    GitHub repository owner (default: Kreator8607)

.PARAMETER Repo
    GitHub repository name (default: wrestling-sim-desktop)

.PARAMETER Token
    GitHub personal access token (required)

.PARAMETER TagName
    Release tag name (default: v3.0.0)

.PARAMETER ReleaseName
    Release display name (default: Pro Wrestling Sim v3.0.0)

.PARAMETER Body
    Release description text

.PARAMETER BodyFile
    Read release description from file

.PARAMETER Draft
    Create as draft release

.PARAMETER PreRelease
    Mark as pre-release

.PARAMETER UploadAssets
    Upload assets from directory

.PARAMETER DryRun
    Preview without creating

.PARAMETER Verbose
    Verbose output

.EXAMPLE
    .\github-release.ps1 -Token YOUR_TOKEN
    Create basic release

.EXAMPLE
    .\github-release.ps1 -Token YOUR_TOKEN -BodyFile CHANGELOG.md
    Create with description from file

.EXAMPLE
    .\github-release.ps1 -Token YOUR_TOKEN -Draft -UploadAssets ./dist
    Create draft release with assets

.NOTES
    Author: Pro Wrestling Sim Team
    Version: 1.0
    Date: April 30, 2024
    Platform: Windows PowerShell 5.0+
    Requirements: GitHub personal access token with 'repo' scope
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Owner = "Kreator8607",
    
    [Parameter(Mandatory=$false)]
    [string]$Repo = "wrestling-sim-desktop",
    
    [Parameter(Mandatory=$false)]
    [string]$Token = $env:GITHUB_TOKEN,
    
    [Parameter(Mandatory=$false)]
    [string]$TagName = "v3.0.0",
    
    [Parameter(Mandatory=$false)]
    [string]$ReleaseName = "Pro Wrestling Sim v3.0.0",
    
    [Parameter(Mandatory=$false)]
    [string]$Body = "",
    
    [Parameter(Mandatory=$false)]
    [string]$BodyFile,
    
    [Parameter(Mandatory=$false)]
    [switch]$Draft,
    
    [Parameter(Mandatory=$false)]
    [switch]$PreRelease,
    
    [Parameter(Mandatory=$false)]
    [string]$UploadAssets,
    
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
    Cyan   = [System.ConsoleColor]::Cyan
    White  = [System.ConsoleColor]::White
}

# GitHub API endpoint
$GitHubAPI = "https://api.github.com"

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
Pro Wrestling Sim v3.0.0 - GitHub Release Automation (API)

USAGE:
    .\github-release.ps1 [OPTIONS]

OPTIONS:
    -Owner TEXT             GitHub repository owner
                           Default: Kreator8607
    
    -Repo TEXT             GitHub repository name
                           Default: wrestling-sim-desktop
    
    -Token TEXT            GitHub personal access token (required)
    
    -TagName TEXT          Release tag name
                           Default: v3.0.0
    
    -ReleaseName TEXT      Release display name
                           Default: Pro Wrestling Sim v3.0.0
    
    -Body TEXT             Release description text
    
    -BodyFile PATH         Read release description from file
    
    -Draft                 Create as draft release
    
    -PreRelease            Mark as pre-release
    
    -UploadAssets PATH     Upload assets from directory
    
    -DryRun               Preview without creating
    
    -Verbose              Verbose output
    
    -Help                 Show this help message

EXAMPLES:
    # Create basic release
    .\github-release.ps1 -Token YOUR_TOKEN
    
    # Create with description file
    .\github-release.ps1 -Token YOUR_TOKEN -BodyFile CHANGELOG.md
    
    # Create draft release with assets
    .\github-release.ps1 -Token YOUR_TOKEN -Draft -UploadAssets ./dist
    
    # Preview release
    .\github-release.ps1 -Token YOUR_TOKEN -DryRun

ENVIRONMENT VARIABLES:
    GITHUB_TOKEN          GitHub personal access token
    GITHUB_OWNER         Repository owner (default: Kreator8607)
    GITHUB_REPO          Repository name (default: wrestling-sim-desktop)

GETTING A GITHUB TOKEN:
    1. Go to https://github.com/settings/tokens
    2. Click "Generate new token"
    3. Select scopes: repo (full control of private repositories)
    4. Generate and copy token
    5. Use: .\github-release.ps1 -Token YOUR_TOKEN

"@
}

# Function to verify token
function Test-GitHubToken {
    Write-Status "Verifying GitHub token..." "Info"
    
    $headers = @{
        "Authorization" = "token $Token"
        "Accept" = "application/vnd.github.v3+json"
        "User-Agent" = "Pro-Wrestling-Sim-Release-Bot/1.0"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$GitHubAPI/user" -Headers $headers -ErrorAction Stop
        Write-Status "Token verified for user: $($response.login)" "Success"
        return $true
    }
    catch {
        Write-Status "Token verification failed: $_" "Error"
        return $false
    }
}

# Function to check if tag exists
function Test-GitHubTag {
    param([string]$TagName)
    
    Write-Status "Checking if tag exists: $TagName" "Info"
    
    $headers = @{
        "Authorization" = "token $Token"
        "Accept" = "application/vnd.github.v3+json"
        "User-Agent" = "Pro-Wrestling-Sim-Release-Bot/1.0"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$GitHubAPI/repos/$Owner/$Repo/git/refs/tags/$TagName" `
            -Headers $headers -ErrorAction SilentlyContinue
        
        if ($response) {
            Write-Status "Tag exists: $TagName" "Success"
            return $true
        }
        else {
            Write-Status "Tag does not exist: $TagName" "Warning"
            return $false
        }
    }
    catch {
        Write-Status "Tag does not exist: $TagName" "Warning"
        return $false
    }
}

# Function to create release
function New-GitHubRelease {
    Write-Status "Creating release..." "Info"
    
    $headers = @{
        "Authorization" = "token $Token"
        "Accept" = "application/vnd.github.v3+json"
        "User-Agent" = "Pro-Wrestling-Sim-Release-Bot/1.0"
    }
    
    $payload = @{
        tag_name    = $TagName
        name        = $ReleaseName
        body        = $Body
        draft       = $Draft
        prerelease  = $PreRelease
    } | ConvertTo-Json
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Would create release with payload:" "Info"
        $payload | ConvertFrom-Json | ConvertTo-Json -Depth 10
        return @{ id = 0; tag_name = $TagName }
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$GitHubAPI/repos/$Owner/$Repo/releases" `
            -Method Post `
            -Headers $headers `
            -Body $payload `
            -ContentType "application/json" `
            -ErrorAction Stop
        
        Write-Status "Release created: $($response.id)" "Success"
        return $response
    }
    catch {
        Write-Status "Failed to create release: $_" "Error"
        return $null
    }
}

# Function to upload asset
function Publish-GitHubAsset {
    param(
        [int]$ReleaseId,
        [string]$AssetPath
    )
    
    if (-not (Test-Path $AssetPath)) {
        Write-Status "Asset not found: $AssetPath" "Error"
        return $false
    }
    
    $filename = Split-Path $AssetPath -Leaf
    Write-Status "Uploading asset: $filename" "Info"
    
    # Determine MIME type
    $mimeTypes = @{
        ".exe" = "application/x-msdownload"
        ".zip" = "application/zip"
        ".txt" = "text/plain"
        ".md"  = "text/markdown"
        ".pdf" = "application/pdf"
        ".png" = "image/png"
        ".jpg" = "image/jpeg"
    }
    
    $ext = [System.IO.Path]::GetExtension($AssetPath).ToLower()
    $mimeType = $mimeTypes[$ext] ?? "application/octet-stream"
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Would upload: $filename" "Info"
        return $true
    }
    
    try {
        $headers = @{
            "Authorization" = "token $Token"
            "Content-Type" = $mimeType
            "User-Agent" = "Pro-Wrestling-Sim-Release-Bot/1.0"
        }
        
        $uploadUrl = "$GitHubAPI/repos/$Owner/$Repo/releases/$ReleaseId/assets?name=$filename"
        
        $response = Invoke-RestMethod -Uri $uploadUrl `
            -Method Post `
            -Headers $headers `
            -InFile $AssetPath `
            -ErrorAction Stop
        
        Write-Status "Uploaded: $filename" "Success"
        return $true
    }
    catch {
        Write-Status "Failed to upload: $filename - $_" "Error"
        return $false
    }
}

# Function to upload assets
function Publish-GitHubAssets {
    param(
        [int]$ReleaseId,
        [string]$AssetsDir
    )
    
    if (-not (Test-Path $AssetsDir -PathType Container)) {
        Write-Status "Assets directory not found: $AssetsDir" "Error"
        return 0
    }
    
    Write-Status "Uploading assets from: $AssetsDir" "Info"
    
    $count = 0
    $files = Get-ChildItem -Path $AssetsDir -File
    
    foreach ($file in $files) {
        if (Publish-GitHubAsset -ReleaseId $ReleaseId -AssetPath $file.FullName) {
            $count++
        }
    }
    
    Write-Status "Uploaded $count assets" "Success"
    return $count
}

# Function to display summary
function Show-ReleaseSummary {
    param(
        [int]$ReleaseId,
        [string]$TagName,
        [string]$ReleaseName
    )
    
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Release Summary" -ForegroundColor Green
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Owner:          $Owner"
    Write-Host "Repository:     $Repo"
    Write-Host "Tag:            $TagName"
    Write-Host "Release Name:   $ReleaseName"
    Write-Host "Release ID:     $ReleaseId"
    Write-Host "Draft:          $Draft"
    Write-Host "Pre-release:    $PreRelease"
    
    if ($DryRun) {
        Write-Host "Mode:           " -NoNewline
        Write-Host "DRY RUN (no changes made)" -ForegroundColor Yellow
    }
    else {
        Write-Host "Status:         " -NoNewline
        Write-Host "Created Successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "Release URL:"
        Write-Host "  https://github.com/$Owner/$Repo/releases/tag/$TagName"
    }
    
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

# Main execution
function Main {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Pro Wrestling Sim v3.0.0 - GitHub Release Automation (API)" -ForegroundColor Green
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    if ($Help) {
        Show-Help
        exit 0
    }
    
    # Validate token
    if (-not $Token) {
        Write-Status "GitHub token not provided" "Error"
        Write-Host "Use -Token parameter or set GITHUB_TOKEN environment variable"
        exit 1
    }
    
    # Read body from file if specified
    if ($BodyFile) {
        if (Test-Path $BodyFile) {
            $Body = Get-Content -Path $BodyFile -Raw
        }
        else {
            Write-Status "Body file not found: $BodyFile" "Error"
            exit 1
        }
    }
    
    # Display configuration
    Write-Status "Configuration:" "Info"
    Write-Host "  Owner:     $Owner"
    Write-Host "  Repo:      $Repo"
    Write-Host "  Tag:       $TagName"
    Write-Host "  Name:      $ReleaseName"
    Write-Host "  Draft:     $Draft"
    Write-Host "  Pre-release: $PreRelease"
    Write-Host ""
    
    # Verify token
    if (-not (Test-GitHubToken)) {
        exit 1
    }
    
    # Check tag
    Test-GitHubTag -TagName $TagName
    
    # Ask for confirmation
    if (-not $DryRun) {
        $response = Read-Host "Create release? (y/n)"
        if ($response -ne 'y' -and $response -ne 'Y') {
            Write-Status "Release creation cancelled" "Warning"
            exit 0
        }
    }
    
    # Create release
    $release = New-GitHubRelease
    
    if (-not $release) {
        exit 1
    }
    
    # Upload assets
    if ($UploadAssets) {
        Publish-GitHubAssets -ReleaseId $release.id -AssetsDir $UploadAssets
    }
    
    # Display summary
    Show-ReleaseSummary -ReleaseId $release.id -TagName $TagName -ReleaseName $ReleaseName
}

# Run main function
try {
    Main
}
catch {
    Write-Status "An error occurred: $_" "Error"
    exit 1
}
