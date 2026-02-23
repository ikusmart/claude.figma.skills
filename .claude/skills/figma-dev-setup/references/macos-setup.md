# macOS Setup Reference

## Package Manager: Homebrew (required)

### Install Homebrew (if not present)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Add Homebrew to PATH (Apple Silicon Macs)
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## Tool Installation

### Node.js v22+
```bash
# Option 1: Homebrew
brew install node@22
brew link node@22

# Option 2: fnm (Fast Node Manager)
brew install fnm
fnm install 22
fnm use 22
fnm default 22

# Option 3: nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
nvm use 22
nvm alias default 22
```

### pnpm
```bash
# Option 1: Homebrew
brew install pnpm

# Option 2: npm
npm install -g pnpm

# Option 3: Corepack
corepack enable
corepack prepare pnpm@latest --activate
```

### Git
```bash
# Usually pre-installed via Xcode Command Line Tools
xcode-select --install

# Or via Homebrew
brew install git
```

### TypeScript
```bash
pnpm add -g typescript
```

## Troubleshooting

### Homebrew not found after install (Apple Silicon)
Run:
```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Permission denied on /usr/local
```bash
sudo chown -R $(whoami) /usr/local/share /usr/local/bin /usr/local/lib
```

### Multiple Node.js versions conflicting
```bash
# Check all installations
which -a node
# Remove via: brew uninstall node / fnm uninstall <version>
```
