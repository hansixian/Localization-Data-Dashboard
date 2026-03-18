# Localization Data Dashboard

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This repo is configured to support GitHub Pages deployment from the branch root.

1. Build the root deployment assets:
   `npm run build:pages-root`
2. Commit the updated files in `assets/` together with your code changes.
3. Push to `main`.
4. In GitHub, open `Settings > Pages`.
5. Set `Source` to `Deploy from a branch`.
6. Set the branch to `main` and the folder to `/(root)`.

GitHub Pages will then serve the production bundle from the repository root instead of trying to load raw source files.
