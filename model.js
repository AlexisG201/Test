(function(root){
  'use strict';
  const VERSION='IDN-SYNTH-2.0';
  const DEFAULTS=Object.freeze({tax:50,subsidy:25,aid:60,borrow:400});
  // Synthetic teaching constants (all invented; see the assumptions panel).
  const BORROW_CEILING=400;          // fiscal-rule ceiling: 2% of a synthetic GDP of Rp20,000T
  const HOUSEHOLDS=70e6;             // synthetic number of households
  const RECIPIENTS=20e6;             // households receiving assistance
  const FIRMS=5e6;                   // synthetic number of firms
  const HOUSEHOLD_TAX_SHARE=0.6;     // share of extra tax that falls on households (rest on firms)
  const bounds={tax:[0,200,10],subsidy:[0,80,5],aid:[0,240,10],borrow:[0,BORROW_CEILING,10]};
  function normalize(values){const result={};for(const key of Object.keys(bounds)){const [min,max,step]=bounds[key];const value=Number(values&&values[key]);result[key]=Number.isFinite(value)?Math.round(Math.min(max,Math.max(min,value))/step)*step:DEFAULTS[key];}return result;}
  function calculate(input){
    const p=normalize(input);
    const savings=400*p.subsidy/100;
    const revenue=2500+p.tax;
    const spending=3000-savings+p.aid;
    const deficit=spending-revenue;
    const price=.4*p.subsidy;
    const familyTax=p.tax*1e12*HOUSEHOLD_TAX_SHARE/HOUSEHOLDS/12;
    const firmTax=p.tax*1e12*(1-HOUSEHOLD_TAX_SHARE)/FIRMS/12;
    const familyFuel=400000*price/100;
    const transfer=p.aid*1e12/RECIPIENTS/12;
    const familyChange=transfer-familyFuel-familyTax;
    const excludedChange=-familyFuel-familyTax;
    const firmChange=-10000000*price/100-firmTax;
    return {savings,revenue,spending,deficit,financingBalance:p.borrow-deficit,price,interest:p.borrow*.07,transfer,familyTax,firmTax,familyChange,excludedChange,firmChange,familyRemaining:600000+familyChange,excludedRemaining:600000+excludedChange,firmProfit:15000000+firmChange};
  }
  const api={VERSION,DEFAULTS,BORROW_CEILING,HOUSEHOLDS,RECIPIENTS,FIRMS,HOUSEHOLD_TAX_SHARE,normalize,calculate};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.PolicyModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
