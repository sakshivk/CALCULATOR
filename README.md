# CalcSuite - Multi Calculator Web App

A browser-based calculator suite with multiple tools in one project:
- Simple Calculator
- Scientific Calculator
- Graphing Calculator
- Financial Calculator
- Programmable Calculator

## Project Structure

- index.html (Landing page / calculator selector)
- simple.html
- scientific.html
- graphing.html
- financial.html
- programmable.html
- shared.css, theme.js (common header, footer, and theme toggle)
- landing.css, tool.css, style.css (page styling)
- simple.js, script.js, graphing.js, financial.js, programmable.js (calculator logic)

## Prerequisites

Install at least one of the following:
- Node.js (recommended)
- VS Code + Live Server extension
- Python (optional alternative)

## Run On Localhost

### Option 1: Node.js (Recommended)

1. Open terminal in the project folder.
2. Run:
   npx serve . -l 5500
3. Open in browser:
   http://localhost:5500/index.html

### Option 2: VS Code Live Server

1. Open the project in VS Code.
2. Open index.html.
3. Right-click and select Open with Live Server.
4. Browser opens a localhost URL automatically.

### Option 3: Python HTTP Server

1. Open terminal in the project folder.
2. Run:
   py -m http.server 5500
3. Open in browser:
   http://localhost:5500/index.html

The landing page index.html will load first.

## Theme Toggle

- Every page includes a common header with a Light/Dark toggle.
- Theme preference is saved in browser local storage.

## Troubleshooting

### Styles or changes not updating

- Do a hard refresh: Ctrl + F5
- Restart localhost server

### Port already in use

- Change port, for example:
  npx serve . -l 5501

### npx not found

- Install Node.js from https://nodejs.org
- Reopen terminal and try again

## License

Use freely for learning and personal projects.
