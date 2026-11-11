(()=>{'use strict';
const model=window.PolicyModel,$=id=>document.getElementById(id),key='indonesia-policy-pilot-v2';
const roles={
  government:{title:'Ministry of Finance',brief:'Fund essential spending, explain the financing plan, and consider future borrowing costs.',question:'Which adjustment would you defend publicly, and who carries its cost?'},
  business:{title:'Business coalition',brief:'Maintain viable firms and employment. This model shows one example firm; consider how other firms might differ.',question:'What change or transition arrangement would you request, and how would it be paid for?'},
  households:{title:'Households & workers',brief:'Consider living standards, livelihoods, recipients and people excluded from assistance.',question:'Who remains exposed? What would you change without assuming unlimited public resources?'}
};
let attempts=[],sequence=0,working={...model.DEFAULTS},storageAvailable=true,lastSaveAt=0;
try{
  const stored=JSON.parse(localStorage.getItem(key)||'null');
  if(stored&&stored.version===model.VERSION){
    attempts=Array.isArray(stored.attempts)?stored.attempts:[];
    sequence=Number(stored.sequence)||attempts.length;
    working=model.normalize(stored.working);
    $('participant').value=String(stored.participant||'').slice(0,32);
    $('round').value=['1','2','3'].includes(stored.round)?stored.round:'1';
    $('role').value=roles[stored.role]?stored.role:'government';
    $('reason').value=String(stored.reason||'').slice(0,2500);
  }
}catch(e){storageAvailable=false;}
const n=x=>Math.round(x).toLocaleString('en-US'),signed=x=>(x>0?'+':x<0?'−':'')+n(Math.abs(x));
const say=t=>{$('status').textContent=t;};
function persist(){try{localStorage.setItem(key,JSON.stringify({version:model.VERSION,attempts,sequence,working,participant:$('participant').value,round:$('round').value,role:$('role').value,reason:$('reason').value}));storageAvailable=true;return true;}catch(e){storageAvailable=false;return false;}}
function history(){
  const box=$('history');box.replaceChildren();if(!attempts.length)return;
  const title=document.createElement('h3');title.textContent=attempts.length+' saved record'+(attempts.length===1?'':'s');box.append(title);
  const ol=document.createElement('ol');
  attempts.forEach(a=>{const li=document.createElement('li');li.textContent=`${a.id} · ${a.type} · ${a.participant} · round ${a.round} · ${a.role} · tax ${a.decisions.tax}T / subsidy −${a.decisions.subsidy}% / aid ${a.decisions.aid}T / borrowing ${a.decisions.borrow}T`;ol.append(li);});
  box.append(ol);
}
function render(){
  for(const k of Object.keys(model.DEFAULTS)){
    $(k).value=working[k];
    let label=k==='subsidy'?working[k]+'% reduction':'Rp '+n(working[k])+'T / year';
    if(k==='borrow'&&working[k]>=model.BORROW_CEILING)label+=' · at the ceiling';
    $(k+'-value').textContent=label;
  }
  const r=model.calculate(working),role=roles[$('role').value];
  $('role-title').textContent=role.title;$('role-brief').textContent=role.brief;$('role-question').textContent=role.question;
  $('balance-title').textContent=r.deficit<0?'Annual surplus':'Annual deficit';
  $('deficit').textContent=n(Math.abs(r.deficit));
  $('funding').textContent=n(Math.abs(r.financingBalance));
  $('funding-title').textContent=r.deficit<0?'Unallocated financing':r.financingBalance<0?'Financing shortfall':r.financingBalance>0?'Excess borrowing':'Gap closed';
  let note;
  if(r.deficit<0)note=`Surplus Rp${n(-r.deficit)}T; borrowing Rp${n(working.borrow)}T. This budget does not require new borrowing.`;
  else if(r.financingBalance<0){
    note=`Rp${n(-r.financingBalance)}T still needs financing or further budget changes.`;
    if(working.borrow>=model.BORROW_CEILING)note+=` Borrowing is already at the Rp${n(model.BORROW_CEILING)}T fiscal ceiling, so the gap must be closed with tax, subsidy or assistance changes.`;
  }
  else if(r.financingBalance>0)note=`Borrowing exceeds the deficit by Rp${n(r.financingBalance)}T. It is not extra tax revenue.`;
  else note='Chosen borrowing exactly covers this round’s deficit.';
  $('funding-note').textContent=note;
  for(const k of ['revenue','spending','savings'])$(k).textContent=n(r[k]);
  $('interest').textContent=r.interest.toLocaleString('en-US',{maximumFractionDigits:1});
  for(const [id,value,change] of [['family',r.familyRemaining,r.familyChange],['excluded',r.excludedRemaining,r.excludedChange],['firm',r.firmProfit,r.firmChange]]){
    $(id).textContent='Rp '+n(value);
    $(id+'-change').textContent=signed(change)+' rupiah vs. unchanged taxes and fuel support, before new assistance';
  }
  $('price').textContent=`Assumed fuel-price rise: ${r.price.toFixed(0)}%. Recipient transfer: Rp${n(r.transfer)} per month.`;
}
function save(type){
  const participant=$('participant').value.trim(),reason=$('reason').value.trim();
  if(!participant||!reason){say('Enter a participant code and a short explanation before saving.');return;}
  if(Date.now()-lastSaveAt<1200)return;
  lastSaveAt=Date.now();
  const a={id:'IDN-'+Date.now()+'-'+(++sequence),version:model.VERSION,country:'Indonesia-inspired synthetic scenario',type,participant,round:$('round').value,role:$('role').value,deviceTimestamp:new Date().toISOString(),decisions:{...working},results:model.calculate(working),reason};
  attempts.push(a);
  const ok=persist();history();
  say(ok?(type==='final'?'Final package marked locally. ':'Attempt saved on this device. ')+'Copy or download your record and submit it through the course platform.':'Kept in this open page only: browser storage is unavailable. Copy or download now before closing.');
}
function recordText(){
  return [
    'INDONESIA POLICY LAB | '+model.VERSION,
    'Illustrative teaching scenario: all numeric inputs and response coefficients synthetic.',
    'LOCAL RECORD ONLY. Copying or downloading does not submit to the instructor.',
    'T = trillion rupiah; household and firm outcomes are monthly rupiah.',
    'Fiscal rule: new borrowing is capped at '+model.BORROW_CEILING+'T.',
    'Device timestamps are not verified submission receipts.',
    '',
    ...attempts.map(a=>[
      a.id+' | '+a.type,
      'Participant: '+a.participant+' | Round: '+a.round+' | Role: '+a.role,
      'Device timestamp: '+a.deviceTimestamp,
      `Choices: tax +${a.decisions.tax}T; subsidy reduction ${a.decisions.subsidy}%; assistance +${a.decisions.aid}T; borrowing ${a.decisions.borrow}T.`,
      `Budget balance: ${a.results.deficit>=0?'deficit':'surplus'} ${n(Math.abs(a.results.deficit))}T. Financing balance (borrowing minus deficit): ${n(a.results.financingBalance)}T.`,
      `Recipient family remaining: Rp${n(a.results.familyRemaining)}; non-recipient: Rp${n(a.results.excludedRemaining)}; firm profit: Rp${n(a.results.firmProfit)}.`,
      `Future annual interest: ${a.results.interest.toFixed(1)}T. Assumed fuel-price rise: ${a.results.price}%.`,
      'Explanation: '+a.reason,
      ''
    ].join('\n'))
  ].join('\n');
}
async function copyRecord(){
  if(!attempts.length){say('Save at least one attempt before copying.');return;}
  const text=recordText();let ok=false;
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);ok=true;}}catch(e){ok=false;}
  if(!ok){
    try{const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.append(ta);ta.select();ta.setSelectionRange(0,text.length);ok=document.execCommand('copy');ta.remove();}catch(e){ok=false;}
  }
  if(ok){$('manual').hidden=true;say('Record copied. Paste it into the course platform and check that all of the text arrived. Copying alone is not submission.');}
  else{$('record-view').value=text;$('manual').hidden=false;say('Copying was blocked on this device. Select all of the text in the box below and copy it manually.');}
}
function downloadName(){
  const last=attempts.length?attempts[attempts.length-1].participant:$('participant').value;
  const code=String(last||'').trim().replace(/[^A-Za-z0-9_-]/g,'').slice(0,20)||'record';
  return 'indonesia-decision-record-'+code+'.txt';
}
for(const k of Object.keys(model.DEFAULTS))$(k).addEventListener('input',()=>{working[k]=Number($(k).value);render();persist();});
for(const k of ['participant','round','role','reason'])$(k).addEventListener(k==='reason'||k==='participant'?'input':'change',()=>{render();persist();});
$('save').addEventListener('click',()=>save('attempt'));
$('final').addEventListener('click',()=>save('final'));
$('copy').addEventListener('click',copyRecord);
$('reset').addEventListener('click',()=>{
  if(!window.confirm('Return the four controls to the common starting package? Saved records will remain.'))return;
  working={...model.DEFAULTS};$('reason').value='';
  const next=Math.min(3,Number($('round').value)+1);$('round').value=String(next);
  render();persist();
  say(`Starting package restored. Round set to ${next}. Now choose your new role. Saved records preserved.`);
});
$('download').addEventListener('click',()=>{
  if(!attempts.length){say('Save at least one attempt before downloading.');return;}
  const blob=new Blob([recordText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=downloadName();document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  say('Record download requested. If nothing downloads on your phone, use Copy record instead. Downloading alone is not submission.');
});
$('clear').addEventListener('click',()=>{
  if(!confirm('Remove all pilot codes, explanations and attempts stored in this browser? Copy or download first.'))return;
  attempts=[];sequence=0;working={...model.DEFAULTS};
  $('participant').value='';$('reason').value='';$('round').value='1';$('role').value='government';
  $('record-view').value='';$('manual').hidden=true;
  try{localStorage.removeItem(key);}catch(e){}
  render();history();say('Local pilot records cleared.');
});
if(/Line\/|FBAN|FBAV|FB_IAB|Instagram|MicroMessenger|Messenger/i.test(navigator.userAgent))$('inapp').hidden=false;
render();history();
if(!storageAvailable)say('Browser storage unavailable. Copy or download saved work before closing this page.');
})();
