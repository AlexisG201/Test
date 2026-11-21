# Model specification

Version IDN-2013-1.0.0. Units: fiscal amounts Rp trillion, pump prices Rp/litre, target households millions, remaining fuel volumes billion litres. Household examples use Rp and a four-month horizon.

## Scope and historical timing

The three role rounds reset to the same classroom starting scenario anchored in the **initial** 2013 budget. They are not sequential policy years. The information cutoff is 20 June 2013. Actual post-cutoff prices and October inflation are historical comparisons, not baseline observations available at that cutoff. The supplied data sheet has unresolved publication dates: this app does not claim the eventual pump-price decision was already public.

The initial-budget anchor deliberately differs from the revised-budget card. The app is not a full real-time reconstruction of information available to the Indonesian cabinet. A retrospective report supplies the historical anchors. Teacher review of chronology and primary budget documents remains necessary.

## Baseline reconciliation

The sheet reports revenue 1,530, expenditure 1,683 and deficit 153.3. Rounded revenue and spending imply 153.0. Rather than hiding the mismatch, the model uses **M expenditure adjustment +0.3**, producing model expenditure 1,683.3 and deficit 153.3. The interface discloses this difference. It is not a newly discovered expenditure item.

GDP proxy = 153.3 / 0.0165 = approximately Rp9,290.9091T. This is inferred from rounded reported deficit figures, not an independently sourced GDP estimate. It stays fixed. The 3% reference is a classroom comparison. No legal-compliance assessment or debt-stock estimate is made.

## Four policy sections

1. Fuel subsidy reform: petrol 4,500–7,500 and diesel 4,500–6,500, in Rp/litre. Two settings form this one policy lever.
2. Additional tax revenue: 0–60T; hypothetical, with no historical counterpart claimed.
3. Additional household cash assistance: 0–40T; incremental to baseline spending. This is not the entire historical compensation package.
4. New borrowing: 0–300T; financing rather than revenue.

The ranges are M teaching choices. They are not estimates of administrative feasibility or historical options announced at the cutoff.

## Budget equations

Let P and D be petrol and diesel prices, T extra tax, A extra assistance, B borrowing, Vp and Vd remaining billion-litre volumes, and S the stress increment (zero in role rounds).

```text
gross savings = ((P − 4500) × Vp + (D − 4500) × Vd) / 1000
savings = min(gross savings, 193.8 + S)
remaining subsidy = 193.8 + S − savings
revenue = 1530 + T
expenditure = 1683 + 0.3 + S − savings + A
deficit = expenditure − revenue
deficit percent = 100 × deficit / GDP proxy
financing need = max(deficit, 0)
unfunded gap = financing need − B
```

Positive financing gap means the package is not fully financed. Negative gap means extra borrowing, not a budget surplus. Borrowing never lowers the deficit. A budget surplus would be identified from a negative deficit independently of borrowing.

Default Vp = 12 and Vd = 8 billion litres. These are **new M assumptions**, not fuel quantities given by the data sheet. They create a transparent arithmetic sandbox: at P=6,500 and D=5,500, savings = 32T. This is **not a historical savings estimate**. A price rise is assumed to reduce government subsidy rupiah-for-rupiah for fixed remaining volumes. Demand, evasion, pass-through timing, different products, and behavior are not estimated. The budget baseline includes other fuel products, held fixed here.

## Inflation illustration

```text
fuel index = w × (P/4500 − 1) + (1−w) × (D/4500 − 1)
inflation increment in percentage points = k × fuel index
inflation illustration = 4.9 + increment
```

Default w = 0.5, k = 4.2. These reproduce 6.3% at the eventual 6,500 / 5,500 prices. The data sheet requested tuning to the 4.9 → 6.3 budget assumption. Matching that target calibrates a coefficient; it does not establish causal validity. The coefficient is not inferred from October inflation. The illustration is annual/budget-proxy inflation; it is not a monthly inflation path.

## Other stakeholder illustrations

```text
business cost increase percent = 100 × business fuel-cost share × fuel index
cash per target household = A × 1,000,000 / target households in millions
                            × (1 − transfer loss percent/100)
extra four-month spending = monthly household spending × 4 × inflation increment/100
illustrative net = cash per target household − extra spending
```

Defaults: business fuel-cost share 0.15; hypothetical monthly household spending Rp1,000,000; target households 15.5 million; transfer loss 0%. Targeting is held fixed, and perfect delivery is only an assumption. Cash uses the same total scale as planned BLSM when A=9.3T, but is not a replay of its implementation.

Applying the inflation increment immediately to four months of spending is a deliberately simplified M convention, not a measured price or welfare trajectory. Taxes are not allocated to household or business cost estimates; the app explicitly asks students to discuss that omitted incidence. No MPC, multiplier, employment change, fare forecast, poverty effect, or approval score is generated.

## Final complication

The source sheet allows reuse of official budget revisions. This version chooses the fuel-subsidy allocation change 199.9 − 193.8 = **6.1T** as an extra M spending pressure. The original versus revised oil-price and exchange-rate assumptions provide context, not an estimated causal model.

Other revenue/spending and GDP remain fixed. The revised budget’s total spending and deficit are not used as the new baseline. Therefore, final baseline deficit is 159.4T, **not 224.2T**. The revised allocation may already reflect reform, so the exercise is explicitly counterfactual; 6.1T cannot be described as the causal cost of the oil/FX revision. An instructor may alter this stress assumption publicly before class. Changing it changes the acceptance-test result.

If a selected round-3 record exists for the group, final submission also retests that earlier policy under the current final assumptions and stress, and records the comparison. This distinguishes a change in conditions from a policy response. If no round-3 selection exists, no earlier comparison is invented.

## Versions and evidence

Saved group records store the entire baseline and assumptions with policy and outputs. Individual notes store the policy at writing and assumptions. No continuous tracking occurs. Learner records remain local until downloaded. Numeric outputs are full precision in JSON/CSV and rounded for display. Instructor settings and reveal controls are public, not secure exam controls.
