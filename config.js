/* Edit before teaching; all M values are teaching assumptions, not estimates. */
globalThis.EMA_CONFIG = {
  version: 'IDN-2013-1.0.0',
  title: 'Indonesia 2013',
  cutoff: '20 June 2013',
  baseline: {
    revenue: 1530, expenditureReported: 1683, reconciliation: 0.3,
    deficitReported: 153.3, fuelSubsidy: 193.8, inflation: 4.9,
    petrol: 4500, diesel: 4500,
    gdpProxy: 153.3 / 0.0165, deficitReference: 3
  },
  assumptions: {
    petrolBillionLitres: 12, dieselBillionLitres: 8,
    petrolWeight: 0.5, inflationCoefficient: 4.2,
    businessFuelShare: 0.15, householdMonthlySpending: 1000000,
    transferHouseholdsMillion: 15.5, transferLossPercent: 0,
    stressSubsidyIncrement: 6.1
  },
  sources: [
    { title: 'Supplied Indonesia data sheet', url: '', note: 'EMA_Data_Sheet_Indonesia_2013.docx; draft for instructor review. Primary source checks remain incomplete.' },
    { title: 'IISD Indonesia Energy Subsidy Review', url: 'https://www.iisd.org/gsi/sites/default/files/ffs_indonesia_review_i1v1.pdf', note: 'March 2014, especially Table 1. Retrospective source, not a document available to students on 20 June.' },
    { title: 'BPS October 2013 inflation release', url: 'https://www.bps.go.id/id/pressrelease/2013/11/01/94/pada-oktober-2013-terjadi-inflasi-sebesar--0-09-persen.html', note: 'Released 1 November 2013; reveal only. Confirms October year-on-year inflation of 8.32%.' }
  ]
};
