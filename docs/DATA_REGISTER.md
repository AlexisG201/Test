# Data register and verification decisions

The starting source is the user-supplied `EMA_Data_Sheet_Indonesia_2013.docx`, labelled draft for instructor review. Its instructions and unresolved checks are treated as evidence about the intended teaching design, not as automatic verification. Original private source documents are not bundled for public hosting.

| Item | Source type and value | Implementation |
|---|---|---|
| Original pump prices | D petrol and diesel Rp4,500/litre | Baseline. Selected diesel value follows the supplied conflict resolution. |
| Initial budget | O revenue 1,530T; expenditure 1,683T; deficit 153.3T, 1.65%; subsidy 193.8T; inflation assumption 4.9% | Historical anchors reproduced from the sheet; +0.3T M accounting reconciliation is visible. |
| Revised budget | O revenue 1,502T; expenditure 1,726T; deficit 224.2T, 2.38%; subsidy 199.9T; inflation assumption 6.3% | Comparison values, not initial policy baseline. Only the 6.1T subsidy difference is reused as a declared M final-stage stress. |
| Oil / exchange-rate assumptions | O original 100 per barrel and Rp9,300 per foreign-currency unit; revised 108 and Rp9,600 | Context for the stress; no foreign-currency budget columns or conversions. |
| Eventual prices | O/D historical reform prices 6,500 / 5,500 | Reveal. Not asserted to be known before cutoff. |
| Planned BLSM | O 9.3T; 15.5 million households; 600,000 Rp per household | Historical scale; publication chronology is unresolved, so decision-time use is labelled a classroom candidate design rather than a confirmed pre-cutoff fact. |
| Full compensation package | O about 29.1T | Reveal explanation distinguishes it from the cash-only control. |
| October 2013 inflation | D 8.32% year-on-year | Confirmed against the BPS release dated 1 November 2013; reveal only. |
| Subsidy savings, inflation response, business costs, household example | M | Equations and editable parameters in MODEL.md. No observed effect claimed. |

## What was checked during this build

- The IISD March 2014 report was opened. Table 1 supports the initial/revised budget anchors as summarized in the supplied sheet. It is itself a retrospective secondary source; primary APBN/APBN-P checks remain open.
- The BPS 1 November 2013 release directly confirms October year-on-year inflation of 8.32% and distinguishes it from the 0.09% monthly change. Only the year-on-year comparison is used.
- GitHub’s official documentation was checked for branch-based publishing from the root folder and availability of public-repository Pages.

## Items deliberately withheld or qualified

- Rp4,000 diesel alternative: not used; source sheet chooses Rp4,500.
- Exact public availability of proposed pump prices before 20 June: not verified. Prices are selectable M options, not pre-cutoff announced O choices.
- Revised budget date 13 June and BLSM approval date 17 June: not presented as verified chronology in the student scenario.
- Historical BLSM actual three-payment claim: flagged as needing primary verification; not used in the model.
- 9.2% inflation figure, 48.2% Raskin leakage, public-opinion result, poverty estimates and transport-fare headline: not used as model inputs or confirmed empirical outputs.
- The 2005–2006 cash-transfer spending response is not transferred to this episode.
- The 3% deficit figure is only a classroom reference; no legal claim about Law 17/2003 or debt-stock compliance is made. Legal article verification remains outside this model.
- Unverified headlines are not presented as newspaper reproductions.

Sources:

- [IISD Indonesia Energy Subsidy Review, March 2014](https://www.iisd.org/gsi/sites/default/files/ffs_indonesia_review_i1v1.pdf)
- [BPS October 2013 inflation release](https://www.bps.go.id/id/pressrelease/2013/11/01/94/pada-oktober-2013-terjadi-inflasi-sebesar--0-09-persen.html)

Verification status: ready for deployment testing and instructor model review. Not a fully primary-source-verified reconstruction.
