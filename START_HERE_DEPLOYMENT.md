# Deploy the Indonesia simulation to GitHub Pages

These steps use the GitHub website. You do not need to install software or use commands. They reflect GitHub’s Pages instructions checked on 19 November 2026.

## 1  Extract the ZIP

Download `Indonesia_2013_GitHub_Pages_Package.zip` and choose **Extract All** on Windows. Open the extracted folder.

You must see `index.html`, `config.js`, `model.js`, `app.js`, and `styles.css` together. Upload these files at the repository’s top level. **Do not upload the ZIP itself as the website, and do not place the whole package inside another folder in the repository.**

## 2  Create a repository

1. Sign in to GitHub.
2. Use **New repository** from your repositories page or the top-right create menu.
3. Name it `ema-indonesia-2013` (or another name you prefer).
4. Choose **Public** for the simplest GitHub Free Pages setup. Public repositories and Pages sites can be viewed by other people. Keep student work out of them. Private-repository Pages availability depends on your GitHub plan and organization settings.
5. Create the repository. Initializing it with a README is fine; replace the starter README with the supplied one later.

## 3  Upload the app

1. In the repository’s **Code** tab, use **Add file → Upload files**. In a completely empty repository, use its **uploading an existing file** link.
2. Drag the **contents** of the extracted folder into the upload area. Include `docs` and `tests` as folders, and the other files at the root. On Windows, use File Explorer’s **View → Show → Hidden items** if `.nojekyll` is not visible.
3. Commit the upload to the default branch, normally **main**. Use a message such as `Add Indonesia simulation`.
4. Check the Code tab: you should see `index.html` directly in the file list, not only a containing folder.

Expected structure:

```text
ema-indonesia-2013/
  index.html
  styles.css
  config.js
  model.js
  app.js
  .nojekyll
  README.md
  START_HERE_DEPLOYMENT.md
  package.json
  docs/
  tests/
```

If `.nojekyll` was skipped, use **Add file → Create new file**, name it `.nojekyll`, and commit an empty file (or one blank line). The app also uses no Jekyll-sensitive asset paths, so this omission alone should not cause a blank app.

## 4  Enable Pages

1. Open the repository’s **Settings** tab.
2. Select **Pages** in the sidebar.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Select **main** (or your actual default branch) and **/(root)**.
5. Click **Save**.
6. Wait for GitHub’s deployment to finish. Check **Actions** for the `pages build and deployment` run if necessary. The name and exact placement of controls can change; Pages settings show the actual status.
7. Return to **Settings → Pages** and use **Visit site** when GitHub displays it.

For a repository called `ema-indonesia-2013`, the normal project-site address is:

```text
https://YOUR-GITHUB-USERNAME.github.io/ema-indonesia-2013/
```

Use the actual address GitHub gives you, including the repository name. The `github.com/...` repository page is not the running app.

## 5  Run this acceptance test before sending the link to students

Use made-up test codes, not real student identifiers.

1. Confirm the title is **Indonesia 2013** and the model version appears in the footer.
2. Enter group `TEST-G01` and student codes `TEST-A`, `TEST-B`, `TEST-C`.
3. At the untouched original baseline, expect revenue **Rp1,530.0T**, expenditure **Rp1,683.3T**, deficit **Rp153.3T**, deficit/GDP proxy **1.65%**, and inflation illustration **4.90%**. The Rp0.3T adjustment is explained under Data & model.
4. Set petrol **6500**, diesel **5500**, assistance **9.3**, tax **0**, and borrowing **153.3**. With packaged assumptions, expect savings **Rp32.0T**, deficit **Rp130.6T**, inflation illustration **6.30%**, and extra borrowing **Rp22.7T**. These are model results, not actual 2013 fiscal outcomes.
5. Enter the required group explanations. Save an attempt and submit the selected record. Open Saved records and confirm both appear.
6. Save an individual role note. Verify it appears with the student code and linked group-record ID.
7. Download **all JSON**, **group records CSV**, **individual notes CSV**, and a **policy snapshot**. Confirm each file opens and contains the test codes and figures. A snapshot is an HTML document you can open, print, or screenshot.
8. Refresh the page. Records should remain in the same browser profile unless browser storage is blocked. Download first if the app warns about storage.
9. Change to round 2 and accept the reset. Check A is Businesses, B is Communities, and C is Government. Policy returns to the original baseline; saved records remain.
10. In Final, the untouched policy has a **Rp159.4T deficit** because the teaching stress adds **Rp6.1T**. Complete the final-specific explanations before submitting.
11. Open on a phone or narrow window and verify labels, sliders, number fields, and save controls are usable.
12. Clear only your made-up test work after downloading it if needed.

Successful hosting does not mean that the historical model has been validated. The app is deployed successfully when the site loads and these interaction/export checks work on your published URL.

## 6  Collect student work

Tell students your private LMS/upload destination and deadlines. Each group downloads its selected records; individual students keep their own role notes. Nothing is emailed or added to a spreadsheet automatically. See `docs/DATA_COLLECTION.md` for record counts and analysis files.

## Common deployment problems

| Problem | Check and fix |
|---|---|
| 404 immediately after enabling Pages | Wait for the Pages deployment run; confirm it succeeded and use the Visit site URL. |
| Persistent 404 | Confirm `index.html` is lowercase, in the repository root, and Pages publishes the right branch with `/(root)`. Include the repository name in the site URL. |
| Page text appears but controls do nothing | Confirm all three JavaScript files and the stylesheet were uploaded with their exact lowercase names, beside `index.html`. Check browser console errors if comfortable doing so. |
| Old version after an update | Wait for a new successful deployment, then reload with Ctrl+F5. If needed, open in a private window to distinguish cache from code. |
| Pages setting missing or disabled | Check repository permissions, account/organization Pages policy, repository visibility and plan. Use an account where you can administer Pages. |
| Default branch is not main | Select the branch that actually contains the uploaded files. |
| CSV looks garbled | Import as UTF-8; files include a UTF-8 BOM. In Excel, use Data → From Text/CSV if needed. |
| Downloaded JSON will not restore | Use **Download all JSON** for a restorable backup. Individual-record JSON files are evidence, not complete session backups. |
| Records missing on another device | Storage is per browser and site address. Restore an all-JSON backup to move a session. A different repository URL has separate browser storage. |
| Browser blocks saving | Keep the page open and download the files immediately. Storage can be restricted in private mode, on managed devices, or when full. |
| Instructor has received no submissions | The app saves locally. Students must download files and upload them to the course submission location. |

## Updating the app

Edit or upload changed files in the same repository and commit them. Pages redeploys from the selected branch. Keep the five runtime files together and upload matching versions. Download existing student work before changing model assumptions or versions mid-course. Increase `version` in `config.js` when changing the model. Saved group records preserve their baseline and assumption values.

## Optional local preview and tests

If Python is already installed, run `python -m http.server 8000` from this folder, then open `http://localhost:8000`. You can also double-click `index.html` for a quick look; browser storage behavior for file URLs varies, so use GitHub Pages for classroom delivery.

If Node.js is already installed, run `node --test tests/model.test.cjs` (or `npm test`). No package installation is needed.

Official GitHub references:

- [Configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages documentation](https://docs.github.com/en/pages)

After this Indonesia deployment works, give the go-ahead before the Vietnam app is created.
