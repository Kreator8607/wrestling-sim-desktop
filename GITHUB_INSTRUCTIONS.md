# GitHub Push Instructions

## Prerequisites

1. Create a GitHub account at https://github.com
2. Create a new repository (e.g., `wrestling-sim-desktop`)
3. Install Git: https://git-scm.com/download/win

## Setup

1. Open Command Prompt or PowerShell
2. Navigate to the project directory:
   ```
   cd path\to\wrestling_sim_desktop
   ```

3. Add your GitHub repository as remote:
   ```
   git remote add origin https://github.com/yourusername/wrestling-sim-desktop.git
   ```

4. Rename branch to main (optional but recommended):
   ```
   git branch -M main
   ```

5. Push to GitHub:
   ```
   git push -u origin main
   ```

## Verify

1. Go to https://github.com/yourusername/wrestling-sim-desktop
2. Verify all files are uploaded
3. Check that README.md displays correctly

## Next Steps

- Add GitHub Actions for CI/CD
- Create releases with executables
- Add issue templates
- Set up GitHub Pages for documentation

## Troubleshooting

**Authentication failed**: Use personal access token instead of password
- Generate token at: https://github.com/settings/tokens
- Use token as password when prompted

**Permission denied**: Ensure SSH key is configured
- Generate SSH key: `ssh-keygen -t ed25519`
- Add to GitHub: https://github.com/settings/keys

**Large files**: Git LFS may be needed for executables
- Install: `git lfs install`
- Track files: `git lfs track "*.exe"`

## Support

For Git help: https://git-scm.com/doc
For GitHub help: https://docs.github.com
