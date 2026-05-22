# Resume Builder

A free, professional resume builder with AI-powered cover letter generation and ATS scoring. No backend, no database — runs entirely in the browser.

## Features
- **3 resume templates** — Classic, Modern, Minimal — with live preview
- **PDF download** — one click, A4, print-ready
- **Cover letter generator** — AI writes a tailored 3-paragraph letter from your resume + job posting
- **ATS score checker** — paste any job posting, get a score, see matched/missing keywords and how to fix them
- **Photo upload** — optional, with initials fallback

## AI features
The cover letter and ATS checker use the Anthropic Claude API. Users need their own API key from [console.anthropic.com](https://console.anthropic.com). The key is entered in the top-right of the app — it never leaves the browser.

## Deploy to GitHub Pages (free)

1. Create a free account at [github.com](https://github.com)
2. Click **New repository** → name it `resume-builder` → set to **Public** → click **Create**
3. Click **uploading an existing file** → drag all these files (keeping the folder structure):
   ```
   index.html
   css/style.css
   js/resume.js
   js/ai.js
   js/nav.js
   ```
4. Click **Commit changes**
5. Go to **Settings** → **Pages** → Source: **Deploy from branch** → Branch: `main` → `/root` → **Save**
6. Wait ~60 seconds → your site is live at `https://yourusername.github.io/resume-builder`

## Embed in Google Sites
1. Copy your GitHub Pages URL
2. In Google Sites editor: **Insert** → **Embed** → paste the URL
3. Set the embed height to **800px minimum**
4. Publish your site

## File structure
```
resume-builder/
├── index.html          # Main app shell + all page HTML
├── css/
│   └── style.css       # All styles
└── js/
    ├── resume.js       # Resume state, rendering, PDF download
    ├── ai.js           # Claude API calls, cover letter, ATS
    └── nav.js          # Page navigation
```

## Customisation
- Change the site name: edit `nav-logo` in `index.html`
- Change accent color: edit `--accent` in `css/style.css`
- Change gold color: edit `--gold` in `css/style.css`
- Add a new template: add render function in `js/resume.js` + CSS class in `style.css`

- To use the AI features (Cover Letter + ATS Score checker) you need a free Anthropic API key.
Here's how to get one:

Go to console.anthropic.com and create a free account
Click API Keys → Create Key → copy it (starts with sk-ant-)
Paste it in the top-right corner of the app

Your key stays in your browser only — it is never stored or shared. Anthropic gives you free credits to start. After that, one cover letter costs roughly $0.01–0.03.
