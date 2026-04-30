#!/usr/bin/env python3

"""
Pro Wrestling Sim v3.0.0 - GitHub Release Automation (API)

Purpose: Automate GitHub release creation using GitHub API
Platform: Python 3.6+
Requirements: requests library, GitHub token
Usage: python3 github-release.py [options]

GitHub API Documentation:
https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Optional, Dict, Any
import requests
from urllib.parse import urljoin

# Color codes for terminal output
class Colors:
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'  # No Color

def print_status(message: str) -> None:
    """Print success message"""
    print(f"{Colors.GREEN}✓{Colors.NC} {message}")

def print_error(message: str) -> None:
    """Print error message"""
    print(f"{Colors.RED}✗{Colors.NC} {message}", file=sys.stderr)

def print_warning(message: str) -> None:
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠{Colors.NC} {message}")

def print_info(message: str) -> None:
    """Print info message"""
    print(f"{Colors.BLUE}ℹ{Colors.NC} {message}")

class GitHubReleaseManager:
    """Manage GitHub releases via API"""
    
    API_BASE = "https://api.github.com"
    
    def __init__(
        self,
        owner: str,
        repo: str,
        token: str,
        verbose: bool = False,
        dry_run: bool = False
    ):
        """Initialize GitHub Release Manager"""
        self.owner = owner
        self.repo = repo
        self.token = token
        self.verbose = verbose
        self.dry_run = dry_run
        
        # Setup headers
        self.headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Pro-Wrestling-Sim-Release-Bot/1.0"
        }
        
        # Verify token
        if not self._verify_token():
            raise ValueError("Invalid GitHub token")
    
    def _verify_token(self) -> bool:
        """Verify GitHub token is valid"""
        print_info("Verifying GitHub token...")
        
        try:
            response = requests.get(
                f"{self.API_BASE}/user",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                user = response.json()
                print_status(f"Token verified for user: {user.get('login')}")
                return True
            else:
                print_error(f"Token verification failed: {response.status_code}")
                return False
                
        except requests.RequestException as e:
            print_error(f"Failed to verify token: {e}")
            return False
    
    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        files: Optional[Dict] = None
    ) -> requests.Response:
        """Make API request"""
        url = urljoin(self.API_BASE, endpoint)
        
        if self.verbose:
            print_info(f"Request: {method} {url}")
            if data:
                print_info(f"Payload: {json.dumps(data, indent=2)}")
        
        try:
            if method == "POST":
                response = requests.post(
                    url,
                    headers=self.headers,
                    json=data,
                    files=files,
                    timeout=30
                )
            elif method == "GET":
                response = requests.get(
                    url,
                    headers=self.headers,
                    timeout=10
                )
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            if self.verbose:
                print_info(f"Response: {response.status_code}")
            
            return response
            
        except requests.RequestException as e:
            print_error(f"Request failed: {e}")
            raise
    
    def check_tag_exists(self, tag: str) -> bool:
        """Check if tag exists"""
        print_info(f"Checking if tag exists: {tag}")
        
        try:
            response = self._make_request(
                "GET",
                f"/repos/{self.owner}/{self.repo}/git/refs/tags/{tag}"
            )
            
            if response.status_code == 200:
                print_status(f"Tag exists: {tag}")
                return True
            else:
                print_warning(f"Tag does not exist: {tag}")
                return False
                
        except Exception as e:
            print_warning(f"Error checking tag: {e}")
            return False
    
    def create_release(
        self,
        tag_name: str,
        release_name: str,
        body: str = "",
        draft: bool = False,
        prerelease: bool = False
    ) -> Optional[Dict[str, Any]]:
        """Create GitHub release"""
        print_info("Creating release...")
        
        payload = {
            "tag_name": tag_name,
            "name": release_name,
            "body": body,
            "draft": draft,
            "prerelease": prerelease
        }
        
        if self.dry_run:
            print_info("[DRY RUN] Would create release with payload:")
            print(json.dumps(payload, indent=2))
            return {"id": 0, "tag_name": tag_name}
        
        try:
            response = self._make_request(
                "POST",
                f"/repos/{self.owner}/{self.repo}/releases",
                data=payload
            )
            
            if response.status_code == 201:
                release = response.json()
                print_status(f"Release created: {release.get('id')}")
                return release
            else:
                print_error(f"Failed to create release: {response.status_code}")
                print_error(response.text)
                return None
                
        except Exception as e:
            print_error(f"Error creating release: {e}")
            return None
    
    def upload_asset(
        self,
        release_id: int,
        asset_path: str
    ) -> bool:
        """Upload asset to release"""
        asset_path = Path(asset_path)
        
        if not asset_path.exists():
            print_error(f"Asset not found: {asset_path}")
            return False
        
        filename = asset_path.name
        print_info(f"Uploading asset: {filename}")
        
        # Determine MIME type
        mime_types = {
            ".exe": "application/x-msdownload",
            ".zip": "application/zip",
            ".txt": "text/plain",
            ".md": "text/markdown",
            ".pdf": "application/pdf",
            ".png": "image/png",
            ".jpg": "image/jpeg"
        }
        
        mime_type = mime_types.get(
            asset_path.suffix.lower(),
            "application/octet-stream"
        )
        
        if self.dry_run:
            print_info(f"[DRY RUN] Would upload: {filename}")
            return True
        
        try:
            # Upload asset
            upload_url = (
                f"{self.API_BASE}/repos/{self.owner}/{self.repo}/"
                f"releases/{release_id}/assets?name={filename}"
            )
            
            with open(asset_path, "rb") as f:
                headers = self.headers.copy()
                headers["Content-Type"] = mime_type
                
                response = requests.post(
                    upload_url,
                    headers=headers,
                    data=f,
                    timeout=60
                )
            
            if response.status_code in (200, 201):
                asset = response.json()
                print_status(f"Uploaded: {filename}")
                return True
            else:
                print_error(f"Failed to upload: {filename} ({response.status_code})")
                return False
                
        except Exception as e:
            print_error(f"Error uploading asset: {e}")
            return False
    
    def upload_assets(
        self,
        release_id: int,
        assets_dir: str
    ) -> int:
        """Upload multiple assets"""
        assets_path = Path(assets_dir)
        
        if not assets_path.is_dir():
            print_error(f"Assets directory not found: {assets_dir}")
            return 0
        
        print_info(f"Uploading assets from: {assets_dir}")
        
        count = 0
        for asset_file in assets_path.glob("*"):
            if asset_file.is_file():
                if self.upload_asset(release_id, str(asset_file)):
                    count += 1
        
        print_status(f"Uploaded {count} assets")
        return count
    
    def display_summary(
        self,
        tag_name: str,
        release_name: str,
        release_id: int,
        draft: bool,
        prerelease: bool
    ) -> None:
        """Display release summary"""
        print()
        print(f"{Colors.CYAN}{'='*60}{Colors.NC}")
        print(f"{Colors.GREEN}Release Summary{Colors.NC}")
        print(f"{Colors.CYAN}{'='*60}{Colors.NC}")
        print(f"Owner:          {self.owner}")
        print(f"Repository:     {self.repo}")
        print(f"Tag:            {tag_name}")
        print(f"Release Name:   {release_name}")
        print(f"Release ID:     {release_id}")
        print(f"Draft:          {draft}")
        print(f"Pre-release:    {prerelease}")
        
        if self.dry_run:
            print(f"Mode:           {Colors.YELLOW}DRY RUN (no changes made){Colors.NC}")
        else:
            print(f"Status:         {Colors.GREEN}Created Successfully{Colors.NC}")
            print()
            print("Release URL:")
            print(f"  https://github.com/{self.owner}/{self.repo}/releases/tag/{tag_name}")
        
        print(f"{Colors.CYAN}{'='*60}{Colors.NC}")
        print()

def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description="Pro Wrestling Sim v3.0.0 - GitHub Release Automation (API)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Create basic release
  python3 github-release.py -t YOUR_TOKEN

  # Create with description file
  python3 github-release.py -t YOUR_TOKEN -B CHANGELOG.md

  # Create draft release with assets
  python3 github-release.py -t YOUR_TOKEN -d -a ./dist

  # Preview release
  python3 github-release.py -t YOUR_TOKEN --dry-run

Environment Variables:
  GITHUB_TOKEN              GitHub personal access token
  GITHUB_OWNER             Repository owner (default: Kreator8607)
  GITHUB_REPO              Repository name (default: wrestling-sim-desktop)
        """
    )
    
    parser.add_argument(
        "-o", "--owner",
        default=os.getenv("GITHUB_OWNER", "Kreator8607"),
        help="GitHub repository owner (default: Kreator8607)"
    )
    
    parser.add_argument(
        "-r", "--repo",
        default=os.getenv("GITHUB_REPO", "wrestling-sim-desktop"),
        help="GitHub repository name (default: wrestling-sim-desktop)"
    )
    
    parser.add_argument(
        "-t", "--token",
        default=os.getenv("GITHUB_TOKEN"),
        help="GitHub personal access token (required)"
    )
    
    parser.add_argument(
        "-n", "--tag-name",
        default="v3.0.0",
        help="Release tag name (default: v3.0.0)"
    )
    
    parser.add_argument(
        "-N", "--release-name",
        default="Pro Wrestling Sim v3.0.0",
        help="Release display name (default: Pro Wrestling Sim v3.0.0)"
    )
    
    parser.add_argument(
        "-b", "--body",
        default="",
        help="Release description text"
    )
    
    parser.add_argument(
        "-B", "--body-file",
        help="Read release description from file"
    )
    
    parser.add_argument(
        "-d", "--draft",
        action="store_true",
        help="Create as draft release"
    )
    
    parser.add_argument(
        "-p", "--prerelease",
        action="store_true",
        help="Mark as pre-release"
    )
    
    parser.add_argument(
        "-a", "--upload-assets",
        help="Upload assets from directory"
    )
    
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview without creating"
    )
    
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Verbose output"
    )
    
    args = parser.parse_args()
    
    # Print header
    print()
    print(f"{Colors.CYAN}{'='*60}{Colors.NC}")
    print("Pro Wrestling Sim v3.0.0 - GitHub Release Automation (API)")
    print(f"{Colors.CYAN}{'='*60}{Colors.NC}")
    print()
    
    # Validate token
    if not args.token:
        print_error("GitHub token not provided")
        print("Use -t/--token or set GITHUB_TOKEN environment variable")
        sys.exit(1)
    
    # Read body from file if specified
    body = args.body
    if args.body_file:
        try:
            with open(args.body_file, "r") as f:
                body = f.read()
        except IOError as e:
            print_error(f"Failed to read body file: {e}")
            sys.exit(1)
    
    # Display configuration
    print_info("Configuration:")
    print(f"  Owner:     {args.owner}")
    print(f"  Repo:      {args.repo}")
    print(f"  Tag:       {args.tag_name}")
    print(f"  Name:      {args.release_name}")
    print(f"  Draft:     {args.draft}")
    print(f"  Pre-release: {args.prerelease}")
    print()
    
    try:
        # Create manager
        manager = GitHubReleaseManager(
            owner=args.owner,
            repo=args.repo,
            token=args.token,
            verbose=args.verbose,
            dry_run=args.dry_run
        )
        
        # Check tag
        manager.check_tag_exists(args.tag_name)
        
        # Ask for confirmation
        if not args.dry_run:
            response = input("Create release? (y/n) ")
            if response.lower() != "y":
                print_warning("Release creation cancelled")
                sys.exit(0)
        
        # Create release
        release = manager.create_release(
            tag_name=args.tag_name,
            release_name=args.release_name,
            body=body,
            draft=args.draft,
            prerelease=args.prerelease
        )
        
        if not release:
            sys.exit(1)
        
        # Upload assets
        if args.upload_assets:
            manager.upload_assets(release["id"], args.upload_assets)
        
        # Display summary
        manager.display_summary(
            tag_name=args.tag_name,
            release_name=args.release_name,
            release_id=release["id"],
            draft=args.draft,
            prerelease=args.prerelease
        )
        
    except ValueError as e:
        print_error(str(e))
        sys.exit(1)
    except KeyboardInterrupt:
        print_warning("Operation cancelled by user")
        sys.exit(0)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
