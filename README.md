# Flashcard Quiz App

> A beautiful, editorial-styled flashcard app with spaced repetition, custom decks, and 420+ predefined cards across 10 knowledge domains.

![Built with React](https://img.shields.io/badge/Built%20with-React-61dafb?style=flat-square)
![Vite](https://img.shields.io/badge/Bundler-Vite-646cff?style=flat-square)
![License MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

- 📇 **10 predefined decks, 420 cards total** — World Capitals, Chemistry Elements, Historical Events, Programming Concepts, Human Anatomy, Famous Scientists, Literature, Mathematics, Spanish Vocabulary, and General Knowledge
- ✍️ **Create custom decks** with a simple `front | back` syntax
- 🔄 **3D card flip animation** — click or press `Space`
- 🧠 **Spaced repetition (SM-2 algorithm)** — cards you struggle with reappear sooner
- 📊 **Session score tracking** — correct / wrong / accuracy per session
- 📈 **Mastery % per deck** — persistent across sessions via localStorage
- ⌨️ **Full keyboard support** — `Space` to flip, `1–4` to grade
- 🎨 **Editorial paper aesthetic** — Fraunces + Instrument Serif + JetBrains Mono
- 📱 **Responsive** — works beautifully on mobile, tablet, and desktop
- 💾 **All data stored locally** — no backend, no tracking

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

The dev server runs at `http://localhost:5173`.

## 📦 Deploy to GitHub Pages

This project comes with a pre-configured GitHub Actions workflow that auto-deploys to GitHub Pages on every push to `main`.

### Step 1 — Create the repo

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flashcard-quiz-app.git
git push -u origin main
```

### Step 2 — Update `vite.config.js` if your repo name differs

If you name your repo something other than `flashcard-quiz-app`, open `vite.config.js` and change the `base` path:

```js
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

### Step 3 — Enable GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push any commit (or re-run the workflow manually from the **Actions** tab)
4. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR-REPO-NAME/`

The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles everything — it installs dependencies, runs `npm run build`, and publishes the `dist/` folder.

## ⌨️ Keyboard Shortcuts

| Key     | Action                    |
|---------|---------------------------|
| `Space` | Flip the current card     |
| `1`     | Grade as **Wrong**        |
| `2`     | Grade as **Hard**         |
| `3`     | Grade as **Good**         |
| `4`     | Grade as **Easy**         |

## 🧠 How spaced repetition works

The app uses a simplified **SM-2 algorithm** (the core of Anki and SuperMemo):

- **Wrong** → repetitions reset, card comes back in the same session
- **Hard** → small interval growth, ease factor decreases
- **Good** → standard interval growth (1 day → 3 days → 3×ease...)
- **Easy** → faster interval growth, ease factor increases

A card is considered **mastered** after 3 successful reviews.

## 📁 Project Structure

```
flashcard-quiz-app/
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages auto-deploy
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── DeckLibrary.jsx     # Home screen with all decks
│   │   ├── StudySession.jsx    # Main study view
│   │   ├── Flashcard.jsx       # Flipping card component
│   │   └── CreateDeckModal.jsx # Custom deck creator
│   ├── data/
│   │   └── predefinedDecks.js  # 10 built-in decks (420 cards)
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   └── spacedRepetition.js # SM-2 algorithm
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎨 Design Notes

The app uses an **editorial magazine aesthetic** — warm cream paper (`#f4ead5`), deep ink text, ochre and forest-green accents. Typography pairs:

- **Fraunces** — display headings, card content
- **Instrument Serif** — italic accents, summary headers
- **JetBrains Mono** — category labels, keyboard hints, meta text

Cards sit on textured paper with subtle grain overlays and pressed-ink shadows. The flip is a 3D CSS transform on a `preserve-3d` container.

## ✍️ Creating Custom Decks

Click the **"+ Create a custom deck"** tile on the home screen. Use this format in the cards field:

```
What is the capital of France? | Paris
Largest planet in our solar system | Jupiter
Author of "1984" | George Orwell
```

One card per line. Use the pipe (`|`) to separate front from back.

## 📜 License

MIT — use it, fork it, modify it. Have fun learning!

## 🙏 Credits

Built with React + Vite. Fonts via Google Fonts. Icons are native emoji.
