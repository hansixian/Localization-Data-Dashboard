# Localization Data Dashboard

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This repo is a Vite app, so GitHub Pages must publish the built `dist/` output, not the raw source files in the repository root.

1. Push this repo to GitHub.
2. In GitHub, open `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` or run the `Deploy GitHub Pages` workflow manually.

The workflow in [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) installs dependencies, runs `npm run build`, and deploys `dist/`.
