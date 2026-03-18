<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3500d521-89af-48aa-a7aa-d9bdcd15bf0b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This repo is a Vite app, so GitHub Pages must publish the built `dist/` output, not the raw source files in the repository root.

1. Push this repo to GitHub.
2. In GitHub, open `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` or run the `Deploy GitHub Pages` workflow manually.

The workflow in [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) installs dependencies, runs `npm run build`, and deploys `dist/`.
