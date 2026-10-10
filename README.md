# Smart Car Hub — GitHub Pages Edition

A responsive static website prototype for Smart Car Hub by Eonix Tech Studio. This edition includes an `index.html` at the repository root, so GitHub Pages can serve it without an Expo build step.

## Included interactions
- Responsive car discovery page with search, body-type filters, price filter and sorting
- Save favourites using browser local storage
- Compare up to four demo cars side-by-side
- Car detail modal
- Finance estimate calculator (illustrative flat-rate estimate)
- Create a local demo listing
- Demo profile saved only in this browser

## Important limitations
This is a **front-end demo**, not a production marketplace. The sample cars/prices are illustrative. Login, seller enquiries, listings, images and saved data are not connected to a real backend; local demo data is stored in the visitor's browser. The original Expo/Supabase application is a separate project and its database/authentication requires Supabase configuration. Do not add secret/service-role keys to a static site.

## Publish using GitHub Pages
1. Download and extract this ZIP.
2. Open your repository: `https://github.com/norizkandar/smart-car-hub`.
3. Upload the **contents** of the extracted `smart-car-hub-github` folder to the repository root. Make sure `index.html`, `styles.css`, `app.js`, `README.md` and `.nojekyll` are visible on the first repository page. Do not upload only the ZIP file.
4. If GitHub asks whether to replace existing files, check that you are replacing the intended files. Keep a backup of your current Expo project first if you want to preserve it.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select branch `main` and folder `/(root)`, then click **Save**.
8. Wait a few minutes, refresh the Pages screen and open the website link it shows.

## Test locally
Open `index.html` in a modern browser. Internet access is used for Google Fonts and sample car photography; core layout and interactions are local.
