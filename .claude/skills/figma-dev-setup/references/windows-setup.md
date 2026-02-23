# Windows Setup Reference

## Package Manager: Scoop (preferred)

### Install Scoop (if not present)
```powershell
# Run in PowerShell (not Git Bash):
pwsh.exe -NoProfile -Command "iex \"& {$(Invoke-RestMethod get.scoop.sh)} -RunAsAdmin\""
```

### PATH fix for Git Bash
```bash
export PATH="$HOME/scoop/shims:$PATH"
```

## Tool Installation

### Node.js v22+
```bash
# Option 1: Scoop
scoop install nodejs-lts

# Option 2: fnm (Fast Node Manager)
scoop install fnm
fnm install 22
fnm use 22
fnm default 22

# Option 3: winget
winget install OpenJS.NodeJS.LTS
```

### pnpm
```bash
# Option 1: Scoop
scoop install pnpm

# Option 2: npm (if Node.js already installed)
npm install -g pnpm

# Option 3: Corepack (built into Node.js)
corepack enable
corepack prepare pnpm@latest --activate
```

### Git
```bash
# Option 1: Scoop
scoop install git

# Option 2: winget
winget install Git.Git
```
Note: Git is likely already installed if the user is running Claude Code in Git Bash.

### TypeScript
```bash
pnpm add -g typescript
```

## Troubleshooting

### Scoop not found in Git Bash
Add to `~/.bashrc`:
```bash
export PATH="$HOME/scoop/shims:$PATH"
```

### Node.js version mismatch
```bash
# Check all Node.js installations
where node
# Remove old versions via Scoop or Windows Add/Remove Programs
```

### Permission errors with npm global installs
Use pnpm instead, or configure npm prefix:
```bash
npm config set prefix "$HOME/.npm-global"
export PATH="$HOME/.npm-global/bin:$PATH"
```
