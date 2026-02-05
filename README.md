# Pro Wrestling Sim - Desktop Edition

A professional wrestling simulation game for Windows built with Electron, React, and SQLite.

## Features

- 🎭 **Event Booking** - Create wrestling events with multiple matches
- ⚡ **Match Simulation** - AI-powered wrestling match simulation based on wrestler attributes
- 📊 **Rankings** - Dynamic wrestler rankings based on wins/losses
- 👑 **Championship Titles** - Manage and track championship titles
- 📅 **Event History** - Complete history of all simulated events
- 🤖 **Auto Simulation** - Simulate multiple events automatically
- 🏥 **Injury Management** - Track and manage wrestler injuries
- 💾 **Persistent Data** - SQLite database with 3,000+ wrestlers included

## System Requirements

- **Windows**: 7, 8, 10, 11 (x64)
- **RAM**: 2GB minimum, 4GB recommended
- **Disk Space**: 600MB for application and data
- **Internet**: Not required (fully offline)

## Installation

1. Download the latest release from the [Releases](https://github.com/yourusername/wrestling-sim-desktop/releases) page
2. Extract `ProWrestlingSim-Portable.zip`
3. Double-click `Pro Wrestling Sim.exe`
4. Application starts immediately - no installation needed!

## Quick Start

1. **Create an Event**
   - Go to Booking
   - Select a promotion (WWE, AEW, NJPW, etc)
   - Add matches with your favorite wrestlers
   - Click "Simulate"

2. **View Results**
   - Check History for all events
   - View Rankings for current standings
   - See Titles for championship holders

3. **Auto Simulate**
   - Go to Auto Simulation
   - Set number of events and matches
   - Watch the system simulate automatically

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm
- Python 3.8+

### Setup

```bash
# Install dependencies
npm install

# Create application icons
python create-assets.py

# Start development server
npm run dev
```

### Build for Windows

```bash
# Build React
npm run react-build

# Create Windows executable
npm run build:win
```

Output files:
- `dist/ProWrestlingSim-Setup.exe` - Installer
- `dist/ProWrestlingSim.exe` - Portable executable

## Project Structure

```
wrestling_sim_desktop/
├── electron/              # Main process (Electron)
│   ├── main.js           # Application entry point
│   ├── preload.js        # IPC security bridge
│   ├── database.js       # SQLite initialization
│   ├── ipc-handlers.js   # Event handlers
│   ├── seed.js           # Initial data
│   └── simulation.js     # Match simulation logic
├── src/                  # React application
│   ├── pages/           # Feature pages
│   ├── components/      # UI components
│   ├── hooks/          # Custom hooks
│   ├── App.jsx         # Main component
│   └── main.jsx        # Entry point
├── assets/             # Application icons
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS config
└── electron-builder.yml # Build configuration
```

## Data

The application includes:
- **3,054 Wrestlers** with realistic attributes
- **58 Promotions** (WWE, AEW, NJPW, TNA, ROH, etc)
- **59 Championship Titles**
- **200 Initial Events**

All data is stored locally in SQLite and never leaves your computer.

## Technologies

- **Frontend**: React 19 + Tailwind CSS 4
- **Backend**: Electron 27 + Node.js
- **Database**: SQLite 3 with better-sqlite3
- **Build**: Vite + electron-builder
- **UI Components**: shadcn/ui

## Performance

- **Startup Time**: ~2 seconds
- **Event Simulation**: ~1 second per match
- **Auto Simulation**: 10 events in ~2 minutes
- **Memory Usage**: 150-300MB typical

## Troubleshooting

### Application won't start
- Ensure Windows 7 or newer
- Try running as Administrator
- Check antivirus isn't blocking the app

### Database errors
- Delete `wrestling_sim.db` to reset
- Application will recreate with default data

### Performance issues
- Close other applications
- Reduce number of events in auto simulation
- Restart the application

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues first

## Changelog

### v2.0.0 (Current)
- Initial release
- 10 core features implemented
- 3,000+ wrestlers included
- Windows executable ready

## Credits

Built with ❤️ for wrestling fans

---

**Status**: Production Ready ✅  
**Version**: 2.0.0  
**Last Updated**: February 2026
