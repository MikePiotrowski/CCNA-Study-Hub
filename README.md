# 🎓 CCNA Study Hub

A comprehensive, interactive web-based study platform for preparing for the Cisco Certified Network Associate (CCNA) certification exam. Built with modern web technologies, this hub provides a centralized space for managing study materials, tracking progress, and mastering networking fundamentals.

[![GitHub](https://img.shields.io/badge/GitHub-MikePiotrowski-blue?logo=github)](https://github.com/MikePiotrowski/CCNA-Study-Hub)
[![License](https://img.shields.io/badge/License-MIT-green)]()
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

## ✨ Features

### 📚 Core Study Tools
- **Interactive Study Plan** - Organize CCNA topics with status tracking (Not Started, In Progress, Mastered)
- **Progress Tracker** - Real-time progress visualization with completion percentages and estimated hours
- **Study Notes** - Full-featured note editor with:
  - Markdown support with live preview
  - Auto-save functionality
  - Rich text formatting (bold, italic, code, links)
  - Note organization and search
- **Flashcard System** - Automatically extract flashcards from notes tagged with `#[Flashcard]`
- **Resource Management** - Attach and organize study materials for each topic

### 🔍 Search & Discovery
- **Dual-Source Search** - Search across:
  - Local notes and topics (instant results)
  - Wikipedia integration (online results)
- **Live Search Dropdown** - Real-time filtering with keyboard navigation
- **Smart Highlighting** - Query terms highlighted in results
- **External Link Safety** - All external links open safely in new tabs

### ⏱️ Productivity Features
- **Pomodoro Timer** - Built-in 25/5 study/break timer with notifications
- **Keyboard Shortcuts** - Quick access to common actions:
  - `/` - Focus search
  - `?` - Show keyboard help
  - `n` - Add new note
  - `t` - Toggle theme
  - `Ctrl+B/I/K/L` - Text formatting in notes
- **Backend Toggle** - Switch between client-side and backend search (Phase 2)

### 🎨 User Experience
- **Dark Mode** - Two professional themes:
  - Cisco Blue (primary)
  - Teal alternative
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Sticky Navigation** - Always-accessible header with current date and profile info
- **Animations & Transitions** - Smooth, accessible animations respecting user preferences
- **Empty States** - Helpful guidance when sections are empty

### ♿ Accessibility
- **ARIA Labels** - Semantic HTML with proper labels for screen readers
- **Keyboard Navigation** - Full keyboard support throughout
- **Focus Management** - Clear focus indicators and focus trapping in modals
- **Print Friendly** - Optimized styles for printing notes and study materials
- **High Contrast** - Readable colors meeting WCAG AA standards

### 🌐 Backend API (Phase 2)
- Express.js server with configurable search providers
- Rate limiting (default: 60 requests/minute)
- LRU caching (500 items, 10-minute TTL)
- CORS support
- Environment-based configuration

## 🚀 Getting Started

### Prerequisites
- **Frontend**: Modern web browser (Chrome, Firefox, Safari, Edge)
- **Backend** (optional): Node.js 14+ and npm

### Installation

#### Frontend Only
1. Clone the repository:
   ```bash
   git clone https://github.com/MikePiotrowski/CCNA-Study-Hub.git
   cd CCNA-Study-Hub
   ```

2. Serve the files locally:
   ```bash
   # Using Python (built-in)
   python -m http.server 5500
   
   # Or using Node.js http-server
   npx http-server -p 5500
   ```

3. Open in your browser:
   ```
   http://localhost:5500
   ```

#### With Backend Server
1. Follow the frontend setup above

2. In a new terminal, set up the backend:
   ```bash
   cd server
   npm install
   ```

3. Configure environment (optional):
   ```bash
   cp .env.example .env
   # Edit .env with your settings (search providers, API keys, etc.)
   ```

4. Start the backend server:
   ```bash
   npm start
   # Server will run on http://localhost:8080
   ```

5. Enable backend search in the app by toggling the "Backend" button in the sticky header

## 📖 Usage Guide

### Adding Study Topics
1. Navigate to **Study Plan**
2. Enter a topic name (e.g., "IPv4 Addressing & Subnetting")
3. Click **Add** or press Enter
4. Set the topic status and estimated hours
5. Attach resources directly to topics

### Creating Notes
1. Go to **Study Notes**
2. Click **Add Note**
3. Enter a title and content
4. Use formatting buttons or Ctrl+B/I/K/L
5. Notes auto-save as you type

### Using Flashcards
1. In your notes, add `#[Flashcard]` tags to mark important concepts
2. Click **Flashcards** in the sticky header
3. View all flashcard-tagged notes in the sidebar
4. Click any flashcard to jump to and highlight it in your notes

### Searching
1. Press `/` or click the search box
2. Type your query
3. View results split into:
   - **Local**: Your notes and topics (instant)
   - **Online**: Wikipedia results (if backend enabled)
4. Click any result to navigate or open

### Pomodoro Timer
1. Click the timer button in the sticky header
2. Start: Click to begin 25-minute study session
3. Break: Automatically switches to 5-minute break
4. Reset: Right-click the timer to reset
5. Notifications appear when sessions complete

### Exporting & Importing Data
1. Click **Export** in the notes header to download a JSON backup
2. Click **Import** to restore from a previous backup
3. Data is also stored in browser localStorage automatically

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `/` | Focus search |
| `?` | Show keyboard help |
| `n` | Add new note |
| `t` | Toggle theme |
| `Esc` | Close panels and modals |
| `Ctrl+B` | Bold text in notes |
| `Ctrl+I` | Italic text in notes |
| `Ctrl+K` | Code text in notes |
| `Ctrl+L` | Insert link in notes |

## 📁 Project Structure

```
CCNA-Study-Hub/
├── index.html              # Home page with stats dashboard
├── home.html               # Same as index.html
├── notes.html              # Note-taking and management
├── study-plan.html         # Topic tracking and progress
├── resources.html          # Curated CCNA resources
├── about.html              # About the study hub
├── wendell-odom.html       # Wendell Odom resource guide
│
├── styles.css              # All styling (4200+ lines)
├── script.js               # All JavaScript functionality
│
├── manifest.json           # PWA manifest
├── favicon.svg             # Site favicon
│
├── server/                 # Backend Express app
│   ├── index.js            # Express server with /api/search
│   ├── package.json        # Node dependencies
│   ├── .env.example        # Environment template
│   └── README.md           # Backend documentation
│
└── README.md              # This file
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup with ARIA accessibility
- **CSS3** - Modern features (Grid, Flexbox, Gradients, Animations)
- **JavaScript (ES6+)** - Vanilla JS with event delegation and modular organization
- **Marked.js** - Markdown parser for note preview
- **DOMPurify.js** - XSS protection for user-generated HTML
- **Font Awesome 6** - Icon library

### Backend (Optional)
- **Express.js** - Lightweight web framework
- **Node.js** - JavaScript runtime
- **LRU Cache** - Fast in-memory caching
- **express-rate-limit** - Rate limiting middleware
- **zod** - TypeScript-like schema validation
- **CORS** - Cross-origin resource sharing

### Development
- **Git** - Version control
- **npm** - Package management

## 🎯 Features Breakdown

### Study Plan Page
- Drag-and-drop topic reordering
- Status dropdown (Not Started → In Progress → Mastered)
- Time estimates with total remaining hours
- Progress visualization with percentage
- Topic-level resources management
- Search integration

### Notes Page
- Rich text editor with formatting toolbar
- Live Markdown preview
- Auto-save with debouncing
- Timestamp tracking (created/modified)
- Delete with confirmation
- Print optimization
- Flashcard extraction and display

### Flashcards Sidebar
- Auto-populated from `#[Flashcard]` tags
- Smooth slide-in animation
- Click to jump and highlight note
- Responsive on mobile (full-screen on small devices)

### Search System
- Two-pass rendering (local first, online async)
- Case-insensitive matching
- Keyboard navigation (arrow keys, Enter)
- External link safety
- Wikipedia integration (CORS-enabled)
- Backend support with feature flag

## ⚙️ Configuration

### Environment Variables (Backend)
Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=8080
ALLOW_ORIGIN=http://localhost:5500

# Search Configuration
SEARCH_PROVIDER=cse,bing          # Comma-separated providers
ALLOWED_DOMAINS=cisco.com,example.com  # Restrict search results

# Performance
CACHE_TTL_SECONDS=600              # Cache time-to-live
RATE_LIMIT_WINDOW_MS=60000         # Rate limit window (1 minute)
RATE_LIMIT_MAX=60                  # Max requests per window
```

### Frontend Feature Flags
In `script.js`, line ~4:
```javascript
window.__useBackendSearch = true;  // Set to false for Wikipedia-only
window.__searchApiBase = 'http://localhost:8081';  // Backend URL
```

## 📊 Data Storage

### Browser LocalStorage
All data is stored locally in your browser:
- `ccna:topics` - Study topics and progress
- `ccna:notes` - All notes
- `ccna:theme` - Theme preference
- `ccna:flashcardsOpen` - Sidebar state
- `ccna:streakCount` - Study streak

**Data is never sent to external servers** (except Wikipedia searches).

### Exporting Data
Click **Export** in the notes header to download a JSON file containing all your topics and notes for backup or migration.

## 🐛 Known Issues

1. **Layout Spacing** - Notes header may slightly overlap sticky header tools on certain viewport widths (being refined)
2. **Simple Browser Limitations** - Some interactive features (delete button) don't work in VS Code's Simple Browser (works in Chrome/Firefox/Safari)
3. **Backend Keys** - Phase 2 search providers (Google CSE, Bing) require API keys (not configured by default)

## 🚧 Planned Improvements (Phase 2)

- [ ] Backend search provider integration (Google Custom Search Engine, Bing API)
- [ ] Study session time tracking and analytics
- [ ] Spaced repetition for flashcards
- [ ] Collaborative study groups
- [ ] Mobile app (React Native)
- [ ] AI-powered study recommendations
- [ ] Quiz mode with practice questions

## 🔐 Security & Privacy

- ✅ No external API calls by default (Wikipedia is CORS-public)
- ✅ All data stays in your browser (LocalStorage)
- ✅ XSS protection via DOMPurify
- ✅ Safe URL handling with validation
- ✅ No cookies or tracking
- ✅ No user analytics

When using the backend search (Phase 2), your queries will be sent to the configured search provider's API.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact & Support

**Creator**: Michael Lee Piotrowski  
**Email**: mlp95747@gmail.com  
**GitHub**: [@MikePiotrowski](https://github.com/MikePiotrowski)  
**Website**: [DeliciousDessertsDelights.com](https://deliciousdessertsdelights.com/)

## 🙏 Acknowledgments

- **Cisco Learning Network** - Official CCNA resources
- **Wendell Odom** - "CCNA 200-301 Official Cert Guide" author
- **Font Awesome** - Icons library
- **Marked.js** & **DOMPurify** - Essential libraries
- Open-source community for inspiration and tools

---

**Happy studying! 📚 Good luck on your CCNA journey!**

*Last Updated: December 4, 2025*
