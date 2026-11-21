(function (root) {
  'use strict';
  const limits = { petrol:[4500,7500], diesel:[4500,6500], tax:[0,60], assistance:[0,40], borrowing:[0,300] };
  function number(value, name, min=0, max=Infinity) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error('Invalid '+name);
    return value;
  }
  function calculate(policy, config, stress=false, assumptions=config.assumptions) {
    for (const [key, range] of Object.entries(limits)) number(policy[key], key, ...range);
    const a=assumptions, b=config.baseline;
    number(a.petrolBillionLitres,'petrol volume',0,50);number(a.dieselBillionLitres,'diesel volume',0,50);
    number(a.petrolWeight,'weight',0,1);number(a.inflationCoefficient,'inflation coefficient',0,20);
    number(a.businessFuelShare,'business share',0,1);number(a.householdMonthlySpending,'spending',1,100000000);
    number(a.transferHouseholdsMillion,'households',0.1,100);number(a.transferLossPercent,'transfer loss',0,100);
    number(a.stressSubsidyIncrement,'stress increment',0,100);
    const petrolRise=(policy.petrol-b.petrol)/b.petrol, dieselRise=(policy.diesel-b.diesel)/b.diesel;
    const fuelIndex=a.petrolWeight*petrolRise+(1-a.petrolWeight)*dieselRise;
    const stressCost=stress?a.stressSubsidyIncrement:0;
    const grossSavings=(policy.petrol-b.petrol)*a.petrolBillionLitres/1000+(policy.diesel-b.diesel)*a.dieselBillionLitres/1000;
    const savings=Math.min(b.fuelSubsidy+stressCost,grossSavings);
    const revenue=b.revenue+policy.tax;
    const expenditure=b.expenditureReported+b.reconciliation+stressCost-savings+policy.assistance;
    const deficit=expenditure-revenue, financingNeed=Math.max(0,deficit);
    const financingGap=financingNeed-policy.borrowing;
    const inflationIncrement=a.inflationCoefficient*fuelIndex;
    const transferPerHousehold=policy.assistance*1e6/a.transferHouseholdsMillion*(1-a.transferLossPercent/100);
    const householdExtraCost=a.householdMonthlySpending*4*inflationIncrement/100;
    return { revenue, expenditure, deficit, deficitPercent:deficit/b.gdpProxy*100,
      financingNeed, financingGap, fuelSubsidy:b.fuelSubsidy+stressCost-savings,
      savings, stressCost, petrolRise:petrolRise*100, dieselRise:dieselRise*100,
      inflation:b.inflation+inflationIncrement, inflationIncrement,
      businessCostPercent:a.businessFuelShare*fuelIndex*100,
      transferPerHousehold, householdExtraCost, householdNet:transferPerHousehold-householdExtraCost };
  }
  function defaultPolicy(config){return {petrol:4500,diesel:4500,tax:0,assistance:0,borrowing:config.baseline.deficitReported};}
  function roleFor(memberIndex, round){return ['Government','Businesses','Communities'][(memberIndex+round-1)%3];}
  function csv(rows, columns){
    const quote=v=>{let s=v==null?'':typeof v==='object'?JSON.stringify(v):String(v);if(typeof v==='string'&&/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
    return '\uFEFF'+[columns.map(quote).join(','),...rows.map(row=>columns.map(c=>quote(row[c])).join(','))].join('\r\n');
  }
  const api={calculate,defaultPolicy,roleFor,csv,limits};
  root.EMA_MODEL=api;
  if(typeof module!=='undefined')module.exports=api;
})(globalThis);
