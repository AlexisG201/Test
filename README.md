# Indonesia 2013 simulation

An Emerging Markets Analysis teaching app calibrated to the supplied Indonesia 2013 data sheet. **Indonesia only.** Vietnam is deliberately not included.

## Start here

1. Read **[START_HERE_DEPLOYMENT.md](START_HERE_DEPLOYMENT.md)** for the browser-only GitHub deployment steps.
2. Upload the files from this folder into the root of a new GitHub repository.
3. In Settings → Pages, select **Deploy from a branch → main → /(root)**.

No installation, terminal, build process, API key, database, paid hosting, or GitHub Actions workflow file is required. The app uses ordinary HTML, CSS and JavaScript with relative file paths. It works on GitHub project Pages URLs as well as a domain root.

## Included

- `index.html` — app and accessible form structure
- `styles.css` — responsive and print layout
- `config.js` — version, historical anchors, editable teaching assumptions and source links
- `model.js` — deterministic calculations, role rotation and CSV export utility
- `app.js` — interaction, local storage, selected records, notes and exports
- `.nojekyll` — bypasses Jekyll processing; include it if possible
- `START_HERE_DEPLOYMENT.md` — complete deployment and acceptance checklist
- `docs/MODEL.md` — equations, units, assumptions and limitations
- `docs/DATA_REGISTER.md` — source provenance, conflict decisions and unresolved checks
- `docs/DATA_COLLECTION.md` — export schema and collection workflow
- `docs/TEACHER_GUIDE.md` — classroom setup and release choices
- `docs/TEST_REPORT.md` — completed verification and remaining deployment checks
- `tests/model.test.cjs` — optional automated calculation checks
- `package.json` — optional test/server commands; no dependency installation needed

## Evidence collection

“Submit selected round record” and “Submit final recommendation” **save on the student device**. They do not transmit to the instructor. Download JSON and the two CSV files and collect through your LMS or a private institutional submission folder. Do not put student exports in the public GitHub repository. Central Google Sheet / Apps Script collection is **not configured in this release**; no anonymous endpoint or secret is needed to deploy it.

This is a reviewable teaching model, not a validated forecast. Data-sheet items needing verification remain identified. Read the model specification before classroom use.
