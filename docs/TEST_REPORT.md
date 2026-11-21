# Verification report

Checked 19 November 2026. Scope: the local Indonesia package, before the user creates a GitHub repository and deploys it.

## Completed

- JavaScript syntax checks for the runtime files.
- Automated model checks: 616 numeric assertions, plus input bounds, finite outputs, all three stakeholder roles for each member, Unicode/quoted CSV content, spreadsheet-formula text handling, and preservation of negative numeric CSV values.
- Baseline identity: 1,683.3 − 1,530 = 153.3T; fixed GDP proxy reproduces 1.65%.
- At 6,500 / 5,500 and 9.3T assistance: model savings 32T, inflation illustration 6.3%, cash 600,000 Rp per target household, deficit 130.6T.
- Changing borrowing does not change the budget deficit.
- Final baseline stress deficit: 159.4T.
- A local HTTP preview returned 200 and the app loaded in the in-app browser.
- Browser interaction checks: group and student codes; live policy inputs and output updates; required group explanations; selected group record; individual role note; visible saved-record list; refresh persistence; rotation and reset for round 2; round 3 selection; reveal after selection; final-stage extra requirements and submission.
- A downloaded all-JSON backup was opened from disk and contained the expected group record and individual note.
- Browser console check after those flows returned no errors or warnings.
- A narrow browser view was visually inspected. Layout stacks the forms and controls; no desktop-only input requirement was introduced.
- Final packaging checks: 16 files, 68 unique HTML IDs, all four referenced runtime assets present, literal control references matched to static or generated IDs, and ZIP integrity verified. The archive places `index.html` at its root and includes `.nojekyll`.

## Verification limits

- The browser testing tool stalled while attempting a later CSV-download check. The CSV serializer passed automated tests, but later browser download dialogs and CSV files were not independently verified through that tool. The deployment checklist explicitly includes opening all exported file types on the user’s published site.
- Backup restore and shared-device restricted-storage modes were not exercised end-to-end in the browser. Import validation and storage-failure messages are implemented, but the user should run the acceptance checklist on the actual teaching devices.
- No GitHub account, repository or live Pages deployment has been changed. The app is packaged for the user to deploy. Deployment success must be confirmed on the GitHub Pages URL.
- No central Google Sheet, live Apps Script deployment, or automatic instructor receipt has been tested or configured because this release collects downloaded files through the course submission platform.
- Historical data and teaching assumptions have the verification boundaries listed in DATA_REGISTER.md. Passing software checks does not validate the economics.
