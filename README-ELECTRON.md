# Solar System 3D - Desktop App

Desktop application version of the Solar System 3D project built with Electron.

## Features

- **Cross-Platform**: Windows, macOS, Linux
- **Native Menus**: File, View, Window, Help
- **Window Management**: Minimize, maximize, resize
- **Auto-Updater**: Built-in update system
- **Security**: Context isolation and secure IPC

## Installation

### Windows
```bash
# Option 1: Interactive launcher
start.bat

# Option 2: Direct launch
launch.bat

# Option 3: Manual
npm install
npm run build
npm run electron
```

### macOS/Linux
```bash
# Make scripts executable
chmod +x *.sh

# Run application
./run-electron.sh

# Build for distribution
./build-electron.sh
```

## Development

```bash
# Install dependencies
npm install

# Start development mode
npm run electron-dev

# Build web assets
npm run build

# Run Electron app
npm run electron

# Build for distribution
npm run dist
```

## Building for Distribution

### Windows (NSIS)
```bash
npm run dist
# Output: dist-electron/Solar System 3D Setup 1.0.0.exe
```

### macOS (DMG)
```bash
npm run dist
# Output: dist-electron/Solar System 3D-1.0.0.dmg
```

### Linux (AppImage)
```bash
npm run dist
# Output: dist-electron/Solar System 3D-1.0.0.AppImage
```

## Architecture

- **Main Process** (`electron/main.cjs`): Window management, menus, IPC
- **Preload Script** (`electron/preload.cjs`): Secure API bridge
- **Renderer Process** (`src/main.js`): Three.js application

## Troubleshooting

### Common Issues

**App won't start**
```bash
npm install
npm run build
npm run electron
```

**Build fails**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

**Performance issues**
- Lower planet scale in GUI
- Disable shadows or star field
- Close other applications

### Debug Mode
```bash
# Enable debug logging
export DEBUG=electron:*
npm run electron-dev
```

## System Requirements

| Platform | Minimum | Recommended |
|----------|---------|-------------|
| **Windows** | Windows 10, 4GB RAM | Windows 11, 8GB RAM |
| **macOS** | macOS 10.14, 4GB RAM | macOS 12+, 8GB RAM |
| **Linux** | Ubuntu 18.04, 4GB RAM | Ubuntu 20.04+, 8GB RAM |

## Security

- Context isolation enabled
- Node.js integration disabled in renderer
- Preload scripts for secure IPC
- External links open in default browser

## License

MIT License - see [LICENSE](LICENSE) file.

---

**Built with Electron and Three.js**

*Native desktop performance for the solar system!*