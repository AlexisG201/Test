const assert=require('node:assert/strict');
require('../config.js');
const C=globalThis.EMA_CONFIG,M=require('../model.js');
let checks=0;
function near(a,b){assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);checks++;}
const p=M.defaultPolicy(C),base=M.calculate(p,C);
near(base.deficit,153.3);near(base.deficitPercent,1.65);near(base.financingGap,0);near(base.inflation,4.9);
const actualPriceOption={...p,petrol:6500,diesel:5500,assistance:9.3};
const ref=M.calculate(actualPriceOption,C);
near(ref.savings,32);near(ref.inflation,6.3);near(ref.transferPerHousehold,600000);near(ref.deficit,130.6);
const borrowed=M.calculate({...p,borrowing:200},C);
near(borrowed.deficit,base.deficit);near(borrowed.financingGap,153.3-200);
near(M.calculate({...p,tax:10},C).deficit,143.3);
near(M.calculate({...p,assistance:10},C).deficit,163.3);
near(M.calculate(p,C,true).deficit,159.4);
near(M.calculate(p,C,true).fuelSubsidy,199.9);
near(M.calculate(actualPriceOption,C,false,{...C.assumptions,transferLossPercent:50}).transferPerHousehold,300000);
near(M.calculate(actualPriceOption,C,false,{...C.assumptions,petrolBillionLitres:0,dieselBillionLitres:0}).savings,0);
for(let i=0;i<300;i++){
 const q={petrol:4500+(i%31)*100,diesel:4500+(i%21)*100,tax:i%61,assistance:(i%401)/10,borrowing:(i%301)};
 const o=M.calculate(q,C,i%2===0);
 near(o.expenditure-o.revenue,o.deficit);near(o.financingNeed-q.borrowing,o.financingGap);
 assert.ok(o.fuelSubsidy>=0);assert.ok(Object.values(o).every(Number.isFinite));
}
for(let i=0;i<3;i++)assert.equal(new Set([1,2,3].map(r=>M.roleFor(i,r))).size,3);
assert.throws(()=>M.calculate({...p,tax:NaN},C));assert.throws(()=>M.calculate({...p,petrol:4400},C));
assert.throws(()=>M.calculate(p,C,false,{...C.assumptions,transferHouseholdsMillion:0}));
const csv=M.csv([{text:'=HYPERLINK("x")',unicode:'新興市場',quote:'a,"b"\nnext'}],['text','unicode','quote']);
assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes("'=HYPERLINK"));assert.ok(csv.includes('新興市場'));assert.ok(csv.includes('""b""'));
assert.ok(M.csv([{n:-25.4}],['n']).includes('"-25.4"'));
console.log(`Passed ${checks} numeric assertions plus bounds, rotation, finite outputs, and CSV safety checks.`);
