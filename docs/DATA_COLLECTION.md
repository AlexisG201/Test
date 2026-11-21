# Student evidence and collection

## Default collection route

The app is static and saves locally. There is **no automatic instructor receipt, server, Google Sheet, or Apps Script connection**. Students download and upload through the instructor’s LMS or approved private submission folder. This makes initial GitHub deployment independent of a second service.

Do not upload student exports to GitHub: the website and repository may be public. Use only class/research codes in the app. Local browser storage is not encrypted by the application and is shared with others using that browser profile. Students should download and clear their work on a shared device.

## Files

| Download | Purpose |
|---|---|
| All JSON | Full restorable session, drafts, notes, attempts, selected records and model settings. |
| Group records CSV | One row per explicit Save attempt / selected round / final submission. Filter `kind` to distinguish them. |
| Individual notes CSV | One row per saved individual note, including role and linked selected record where available. |
| Individual JSON | A full single record for audit, not a restorable session. |
| Policy snapshot HTML | Human-readable package, outputs, explanations and model settings. Open in a browser, print to PDF, or screenshot. |

CSV numeric fields retain full numeric precision. Potential spreadsheet-formula text is prefixed with an apostrophe. Each CSV starts with a UTF-8 BOM for Traditional Chinese text compatibility. JSON is the authoritative audit copy if spreadsheet software changes display formatting.

## Recommended submission practice

For each of the three role rounds, save one selected group record and one individual note per student. Notes may be saved before the group selection: previously unlinked notes for that group/stage are linked when a selected record is saved. A later note links to the latest selection. Editing group settings afterwards does not rewrite earlier evidence.

Every Save creates a new timestamped record. There is no silent overwriting or deletion of older submissions. If a group revises a selected record, instruct it to identify the intended final record ID. Filter by group, stage, kind and timestamp; do not count attempts or duplicate revisions as extra participants.

Across ten groups in Indonesia, expect 30 selected role-round group records, 10 final recommendations, and 90 individual role notes, plus optional attempts. These are evidence records from approximately 30 students, not 130 independent participants.

Group records contain ID, kind, time, group and member codes, stage, role mapping, policy settings, full outputs, reasons, stakeholder effects, revision, limitations, model version, baseline and assumptions. Final records also contain a round-3 policy comparison if such a selection exists.

Individual notes contain ID, time, student and group code, stage, role, five responses, linked selected record ID, policy at writing, model version and assumptions. `linkedGroupRecordId` can be null if no selected record has yet been saved; check completion before collection.

## Constraints and trust

Students can edit exports and public model settings. Codes identify records but do not authenticate users. This is formative classroom collection, not secure assessment software. A local record marked “selected” or “final” has not been received by the instructor until uploaded to the specified course destination. Check uploads against the submission checklist.

Research consent, retention, access and use of coursework must follow the project’s approved procedures. The app does not obtain consent or decide which records may be used for research.
