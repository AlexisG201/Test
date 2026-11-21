/* No accounts, network calls, analytics, external libraries, or secrets. */
(() => {
 'use strict';
 const C=EMA_CONFIG, M=EMA_MODEL, $=id=>document.getElementById(id), KEY='ema-idn-2013-v1';
 const formKeys=['reason1','reason2','government','businesses','communities','revision','limitation','agreement','implementation','changed'];
 const noteKeys=['priority','effect','other','change','uncertainty'];
 const fresh=()=>({schemaVersion:1,group:'',members:['','',''],stage:1,policy:M.defaultPolicy(C),assumptions:{...C.assumptions},form:{},noteDrafts:{},records:[],notes:[],reveal:false});
 let state=fresh(), storageOK=true, timer;
 const fmt=(n,d=1)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:d,minimumFractionDigits:d}).format(n);
 const rp=n=>'Rp '+fmt(n,0), t=n=>'Rp '+fmt(n)+'T';
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clone=x=>JSON.parse(JSON.stringify(x));
 const id=prefix=>prefix+'-'+(globalThis.crypto?.randomUUID?.()||Date.now()+'-'+Math.random().toString(16).slice(2));
 function say(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error);clearTimeout(timer);timer=setTimeout(()=>{$('status').textContent='';},12000);}
 function confirmAction(message){
  return new Promise(resolve=>{const dialog=$('confirm-dialog');$('confirm-message').textContent=message;dialog.returnValue='cancel';dialog.onclose=()=>resolve(dialog.returnValue==='yes');dialog.showModal();});
 }
 $('confirm-cancel').onclick=()=>$('confirm-dialog').close('cancel');
 $('confirm-yes').onclick=()=>$('confirm-dialog').close('yes');
 function validateBackup(v){
  if(!v||v.schemaVersion!==1||!Array.isArray(v.members)||v.members.length!==3||!v.members.every(x=>typeof x==='string'&&x.length<=40)||typeof v.group!=='string'||v.group.length>40||![1,2,3,4].includes(v.stage))throw Error('This is not a compatible Indonesia backup.');
  if(!Array.isArray(v.records)||!Array.isArray(v.notes)||v.records.length>3000||v.notes.length>10000)throw Error('Invalid record collections.');
  M.calculate(v.policy,C,v.stage===4,v.assumptions);
  for(const r of v.records){
   if(!r||typeof r.id!=='string'||!['attempt','selected','final'].includes(r.kind)||![1,2,3,4].includes(r.stage)||typeof r.group!=='string'||!Array.isArray(r.members)||r.members.length!==3||!r.model?.baseline||typeof r.timestamp!=='string')throw Error('Invalid saved group record.');
   if(!r.form||Object.values(r.form).some(x=>typeof x!=='string'||x.length>5000))throw Error('Invalid group explanation.');
   if(typeof r.model.version!=='string'||!Number.isFinite(Date.parse(r.timestamp)))throw Error('Invalid model version or timestamp.');
   for(const value of Object.values(r.model.baseline))if(typeof value!=='number'||!Number.isFinite(value))throw Error('Invalid saved baseline.');
   if(r.model.baseline.gdpProxy<=0)throw Error('Invalid GDP proxy.');
   const checked=M.calculate(r.policy,{baseline:r.model.baseline,assumptions:r.model.assumptions},r.stage===4);
   if(!r.outputs||Object.keys(checked).some(k=>typeof r.outputs[k]!=='number'||!Number.isFinite(r.outputs[k])||Math.abs(r.outputs[k]-checked[k])>1e-7))throw Error('Saved outputs do not match their model settings.');
  }
  for(const n of v.notes){if(!n||typeof n.id!=='string'||typeof n.timestamp!=='string'||!Number.isFinite(Date.parse(n.timestamp))||typeof n.student!=='string'||typeof n.group!=='string'||![1,2,3,4].includes(n.stage)||!n.responses||noteKeys.some(k=>typeof n.responses[k]!=='string'||n.responses[k].length>3000))throw Error('Invalid individual note.');}
  if(!v.form||Object.values(v.form).some(x=>typeof x!=='string'||x.length>5000))throw Error('Invalid current explanations.');
  if(!v.noteDrafts||typeof v.noteDrafts!=='object'||Object.values(v.noteDrafts).some(x=>!x||typeof x!=='object'||Object.values(x).some(y=>typeof y!=='string'||y.length>3000)))throw Error('Invalid note drafts.');
  return v;
 }
 try {const raw=localStorage.getItem(KEY);if(raw)state=validateBackup(JSON.parse(raw));}catch(e){storageOK=false;setTimeout(()=>say('Saved work could not be restored. Download all evidence before closing this tab. Existing browser storage has not been overwritten.',true),500);}
 function persist(){
  if(!storageOK)return;
  try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(e){storageOK=false;say('Browser saving is unavailable or full. Keep this tab open and download all JSON now.',true);return false;}
 }
 function getPolicy(){return Object.fromEntries(Object.keys(M.limits).map(k=>[k,Number($(k+'-number').value)]));}
 function collect(){
  state.group=$('group').value.trim();state.members=[0,1,2].map(i=>$('member'+i).value.trim());
  for(const k of formKeys)state.form[k]=$(k).value;
  saveNoteDraft();persist();
 }
 function draftKey(){return state.stage+'-'+$('note-member').value;}
 function saveNoteDraft(){state.noteDrafts[draftKey()]=Object.fromEntries(noteKeys.map(k=>[k,$('note-'+k).value]));}
 function loadNoteDraft(){const draft=state.noteDrafts[draftKey()]||{};for(const k of noteKeys)$('note-'+k).value=draft[k]||'';renderRoles();}
 function renderRoles(){
  const r=Math.min(state.stage,3);
  $('roles').innerHTML=state.members.map((m,i)=>`<div class="role">${escape(m||'Student '+['A','B','C'][i])}<strong>${M.roleFor(i,r)}</strong></div>`).join('');
  const i=Number($('note-member').value);
  $('note-role').textContent=(state.members[i]||'Student '+['A','B','C'][i])+' · '+M.roleFor(i,r)+(state.stage===4?' (final-stage role kept from round 3)':'');
  for(let j=0;j<3;j++)$('note-member').options[j].textContent=(state.members[j]||'Student '+['A','B','C'][j]);
 }
 const controls=[
  ['petrol','Petrol pump price','Rp / litre',100,'fuel-controls'],
  ['diesel','Diesel pump price','Rp / litre',100,'fuel-controls'],
  ['tax','Extra tax revenue','Rp trillion',1,'tax-control'],
  ['assistance','Extra cash assistance','Rp trillion',.1,'assistance-control'],
  ['borrowing','New borrowing','Rp trillion',.1,'borrowing-control']
 ];
 for(const [key,label,unit,step,parent] of controls){
  const [min,max]=M.limits[key];
  const wrap=document.createElement('div');wrap.className='control-row';
  wrap.innerHTML=`<div class="control-numbers"><label for="${key}-number">${label}<br><span>${unit}</span></label><input id="${key}-number" type="number" min="${min}" max="${max}" step="${step}" value="${state.policy[key]}"></div><input id="${key}-range" type="range" aria-label="${label}" min="${min}" max="${max}" step="${step}" value="${state.policy[key]}">`;
  $(parent).append(wrap);
  for(const suffix of ['number','range'])$(key+'-'+suffix).addEventListener('input',()=>{
   const el=$(key+'-'+suffix), value=Number(el.value);
   if(el.value===''||!Number.isFinite(value)||value<min||value>max){el.setCustomValidity('Enter a value from '+min+' to '+max);return;}
   el.setCustomValidity('');$(key+'-'+(suffix==='number'?'range':'number')).value=value;
   state.policy={...state.policy,[key]:value};persist();renderResults();
  });
 }
 function syncPolicy(){for(const k of Object.keys(M.limits))for(const suffix of ['number','range']){$(k+'-'+suffix).value=state.policy[k];$(k+'-'+suffix).setCustomValidity('');}}
 function metric(label,value,unit,warn=false){return `<div class="metric ${warn?'warn':''}"><span class="label">${label}</span><strong>${value}</strong><span class="unit">${unit}</span></div>`;}
 function result(){return M.calculate(state.policy,C,state.stage===4,state.assumptions);}
 function renderResults(){
  const o=result(), b=C.baseline;
  $('metrics').innerHTML=metric(o.deficit>=0?'Budget deficit':'Budget surplus',fmt(Math.abs(o.deficit)),'Rp trillion · before financing')+metric('Deficit / GDP proxy',fmt(o.deficitPercent,2)+'%','M fixed GDP proxy',o.deficitPercent>b.deficitReference)+metric(Math.abs(o.financingGap)<.01?'Financing balanced':o.financingGap>0.01?'Unfunded gap':'Extra borrowing',fmt(Math.abs(o.financingGap)),'Rp trillion · after borrowing',o.financingGap>0.01)+metric('Inflation illustration',fmt(o.inflation,2)+'%','M budget-proxy illustration');
  const rows=[['Revenue',t(o.revenue)],['Expenditure',t(o.expenditure)],['New borrowing',t(state.policy.borrowing)],['Modelled fuel subsidy',t(o.fuelSubsidy)],['Modelled gross subsidy savings',t(o.savings)]];
  $('budget-flow').innerHTML='<div class="budget-lines">'+rows.map(([k,v])=>`<div class="budget-line"><span>${k}</span><strong>${v}</strong></div>`).join('')+'</div>';
  const messages=[];
  if(o.financingGap>0.01)messages.push('The package is not fully financed. Raising borrowing can cover a gap, but it does not lower the deficit.');
  if(o.financingGap<-.01)messages.push('Borrowing exceeds the financing need. This extra borrowing is not budget revenue or a budget surplus.');
  if(o.deficitPercent>b.deficitReference)messages.push('The deficit exceeds the 3% classroom reference. This is not a legal-compliance assessment; the GDP denominator is an inferred, fixed proxy.');
  if(state.stage===4)messages.push('Stress adds Rp '+fmt(state.assumptions.stressSubsidyIncrement)+'T to spending. It does not reproduce the full revised budget.');
  $('warnings').innerHTML=messages.map(v=>`<p class="notice">${escape(v)}</p>`).join('');
  $('stakeholder-results').innerHTML=`<div class="effect"><strong>Businesses: +${fmt(o.businessCostPercent,2)}% cost illustration</strong><p>M fuel-cost share × weighted fuel-price increase. Tax incidence, wages, fares and employment are not estimated.</p></div><div class="effect"><strong>Households: ${rp(o.transferPerHousehold)} cash support</strong><p>M per target household over four months, assuming equal distribution and ${fmt(state.assumptions.transferLossPercent,0)}% transfer loss. This does not mean all households receive support.</p></div><div class="effect"><strong>Illustrative net household position: ${o.householdNet>=0?'+':''}${rp(o.householdNet)}</strong><p>M transfer minus ${rp(o.householdExtraCost)} extra four-month spending in a hypothetical household. The example uses monthly spending of ${rp(state.assumptions.householdMonthlySpending)}. It is not an observed welfare or poverty result.</p></div>`;
 }
 function renderStage(){
  const final=state.stage===4;
  $('stage').value=state.stage;$('stage-banner').classList.toggle('final',final);
  $('stage-banner').innerHTML=final?'<strong>Final complication · budget-revision stress</strong><br>Context: the revised budget assumed an 8% higher oil price and an approximately 3.23% higher Rupiah cost per unit of foreign currency than the initial budget. The reported fuel-subsidy allocation rose from Rp193.8T to Rp199.9T. We reuse only this Rp6.1T increment as a fixed M spending stress. No currency conversion is performed.':`<strong>Round ${state.stage} · same starting conditions</strong><br>Cutoff: ${C.cutoff}. Negotiate from the roles shown above. Role rotation changes your perspective, not the original scenario.`;
  $('revision-label').firstChild.textContent=state.stage===1?'Main disadvantage in round 1':final?'Why we changed or kept the package after the complication':'What we changed or kept from the previous round, and why';
  $('implementation-wrap').hidden=!final;$('changed-wrap').hidden=!final;
  $('submit').textContent=final?'Submit final recommendation':'Submit selected round record';
  renderRoles();renderResults();
 }
 $('baseline-cards').innerHTML=[['D','Petrol / diesel before reform','Rp4,500 / litre','Both use the data sheet’s selected Rp4,500 baseline.'],['O','Initial budget fuel subsidy','Rp193.8T','Initial budget, not actual expenditure.'],['O','Initial revenue / expenditure','Rp1,530T / Rp1,683T','Rounded figures from the sheet.'],['O','Reported initial deficit','Rp153.3T · 1.65%','The model adds a visible M Rp0.3T reconciliation to expenditure.'],['O','Initial inflation assumption','4.9%','A budget assumption, not observed inflation.'],['M','Candidate cash-transfer design','Rp9.3T','Classroom option using the historical planned BLSM scale: 15.5 million households × Rp600,000. Publication before the cutoff is not verified.']].map(([type,label,value,note])=>`<article><span class="tag">${type}</span> ${label}<strong>${value}</strong><p class="small">${note}</p></article>`).join('');
 const aFields=[['petrolBillionLitres','Remaining petrol volume · billion litres',0,50,.1],['dieselBillionLitres','Remaining diesel volume · billion litres',0,50,.1],['petrolWeight','Petrol weight in fuel-price index',0,1,.05],['inflationCoefficient','Inflation coefficient · pp per unit index',0,20,.1],['businessFuelShare','Business fuel-cost share',0,1,.01],['householdMonthlySpending','Hypothetical household spending · Rp / month',1,1e8,10000],['transferHouseholdsMillion','Target households · million',.1,100,.1],['transferLossPercent','Assumed cash-transfer loss · percent',0,100,1],['stressSubsidyIncrement','Stress spending increment · Rp trillion',0,100,.1]];
 function renderAssumptions(){
  $('assumption-fields').innerHTML=aFields.map(([k,label,min,max,step])=>`<label>${label}<input id="a-${k}" type="number" min="${min}" max="${max}" step="${step}" value="${state.assumptions[k]}"></label>`).join('');
 }
 $('apply-assumptions').onclick=()=>{try{const a=Object.fromEntries(aFields.map(([k])=>[k,Number($('a-'+k).value)]));for(const [k]of aFields)if($('a-'+k).value==='')throw Error('Complete all settings.');M.calculate(state.policy,C,state.stage===4,a);state.assumptions=a;persist();renderResults();renderStage();say('Model settings applied. Saved records retain their own settings.');}catch(e){say(e.message,true);}};
 $('restore-assumptions').onclick=()=>{state.assumptions={...C.assumptions};persist();renderAssumptions();renderStage();say('Packaged assumptions restored.');};
 $('method-content').innerHTML=`<div class="table-scroll"><table class="method-table"><thead><tr><th>Component</th><th>How this version handles it</th></tr></thead><tbody><tr><td>Fiscal baseline</td><td>O Rp1,530T revenue; O Rp1,683T expenditure. M +Rp0.3T expenditure reconciliation reproduces the sheet’s O Rp153.3T reported deficit. GDP proxy = 153.3 / 0.0165. No observed GDP or debt stock is supplied.</td></tr><tr><td>Four policy levers</td><td>Fuel reform uses two price settings as one policy section. Tax, additional assistance and borrowing are the other three levers.</td></tr><tr><td>Fuel savings</td><td>M fixed remaining volumes: 12 billion litres petrol and 8 billion litres diesel. Savings = sum of price increases × volumes / 1,000, in Rp trillion. Demand, smuggling, distribution and non-petrol/diesel subsidies are held fixed. Volumes are classroom assumptions, not sourced consumption data.</td></tr><tr><td>Inflation calibration</td><td>M equal-weight relative price index × 4.2 percentage points, added to O 4.9%. At the eventual Rp6,500 / Rp5,500 prices this gives 6.3%, matching the revised budget assumption. This is a proxy calibration, not validation or a causal estimate.</td></tr><tr><td>Households and business</td><td>M business fuel-cost share 15%; hypothetical household spending Rp1,000,000 per month; transfer spread equally across 15.5 million target households. Default loss 0% is an assumption, not a claim of perfect targeting. No 2005–2006 spending parameter or Raskin leakage is applied to cash transfers.</td></tr><tr><td>Complication</td><td>O fuel-subsidy allocation increment 199.9 − 193.8 = Rp6.1T reused as an M stress. Revenue and other spending remain fixed. Revised budgets may already reflect policy changes; subtracting modelled savings here is an explicitly counterfactual exercise, not a reconstruction.</td></tr><tr><td>Deferred evidence</td><td>Unverified headlines, survey opposition, poverty effects, the 9.2% figure, and the 48.2% Raskin figure are excluded. No legal debt test is made. Instructor verification of the chronology and draft-sheet values remains necessary.</td></tr></tbody></table></div>`;
 $('source-list').innerHTML=C.sources.map(s=>`<p><strong>${s.url?`<a href="${escape(s.url)}" target="_blank" rel="noopener">${escape(s.title)}</a>`:escape(s.title)}</strong><br><span class="small">${escape(s.note)}</span></p>`).join('');
 function ensureInputs(selected=false){
  collect();
  for(const k of Object.keys(M.limits))if(!$(k+'-number').checkValidity()||$(k+'-number').value==='')throw Error('Check the policy number fields before saving.');
  state.policy=getPolicy();M.calculate(state.policy,C,state.stage===4,state.assumptions);
  if(!state.group)throw Error('Enter a group code first.');
  if(selected){
   if(state.members.some(m=>!m)||new Set(state.members).size!==3)throw Error('Enter three different student codes.');
   const required=['reason1','reason2','government','businesses','communities','revision','limitation'];
   if(state.stage===4)required.push('implementation','changed');
   const missing=required.find(k=>!state.form[k]?.trim());
   if(missing){$(missing).focus();throw Error('Complete the group reasons, stakeholder effects, revision and limitation'+(state.stage===4?', changed conditions and implementation steps':'')+'.');}
  }
 }
 function snapshot(kind){return {id:id(state.group+'_IDN_'+(state.stage===4?'FINAL':'R'+state.stage)),kind,timestamp:new Date().toISOString(),country:'Indonesia',cutoff:C.cutoff,group:state.group,members:[...state.members],stage:state.stage,roles:state.members.map((student,i)=>({student,role:M.roleFor(i,Math.min(3,state.stage))})),policy:clone(state.policy),outputs:result(),form:clone(state.form),model:{version:C.version,baseline:clone(C.baseline),assumptions:clone(state.assumptions)},storageMode:'local-export'};}
 function saveRecord(kind){try{
  ensureInputs(kind!=='attempt');const r=snapshot(kind);
  if(state.stage===4){const earlier=[...state.records].reverse().find(x=>x.kind==='selected'&&x.stage===3&&x.group===state.group);if(earlier)r.comparison={earlierRecordId:earlier.id,policy:clone(earlier.policy),outputsUnderCurrentStress:M.calculate(earlier.policy,C,true,state.assumptions),assumptions:clone(state.assumptions),note:'Earlier package retested with final-stage assumptions and fixed stress.'};}
  state.records.push(r);
  if(kind!=='attempt')for(const n of state.notes)if(n.group===r.group&&n.stage===r.stage&&!n.linkedGroupRecordId)n.linkedGroupRecordId=r.id;
  persist();renderRecords();say((kind==='attempt'?'Attempt saved.':'Selected record saved locally.')+' Download your evidence and upload it to your instructor.');
 }catch(e){say(e.message,true);}}
 $('save-attempt').onclick=()=>saveRecord('attempt');$('submit').onclick=()=>saveRecord(state.stage===4?'final':'selected');
 $('save-note').onclick=()=>{try{
  collect();const i=Number($('note-member').value), student=state.members[i];
  if(!state.group||!student)throw Error('Enter the group code and your student code first.');
  const responses=Object.fromEntries(noteKeys.map(k=>[k,$('note-'+k).value.trim()]));
  if(noteKeys.some(k=>!responses[k]))throw Error('Answer all five note prompts. You may state a specific uncertainty.');
  const latest=[...state.records].reverse().find(x=>x.group===state.group&&x.stage===state.stage&&x.kind!=='attempt');
  state.notes.push({id:id(student+'_IDN_R'+state.stage),timestamp:new Date().toISOString(),country:'Indonesia',group:state.group,student,stage:state.stage,role:M.roleFor(i,Math.min(state.stage,3)),responses,linkedGroupRecordId:latest?.id||null,policyAtWriting:clone(state.policy),modelVersion:C.version,assumptions:clone(state.assumptions)});
  persist();renderRecords();say('Individual role note saved locally. Download it before leaving this device.');
 }catch(e){say(e.message,true);}};
 function showTab(name){for(const el of document.querySelectorAll('.tab'))el.hidden=el.id!==name;for(const el of document.querySelectorAll('[data-tab]')){if(el.dataset.tab===name)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');}if(name==='records')renderRecords();}
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
 for(let i=0;i<3;i++){$('member'+i).value=state.members[i];$('member'+i).oninput=()=>{collect();renderRoles();};}
 $('group').value=state.group;$('group').oninput=collect;
 for(const k of formKeys){$(k).value=state.form[k]||'';$(k).oninput=collect;}
 for(const k of noteKeys)$('note-'+k).oninput=()=>{saveNoteDraft();persist();};
 $('note-member').addEventListener('change',loadNoteDraft);
 function resetWorking(){state.policy=M.defaultPolicy(C);state.form={};for(const k of formKeys)$(k).value='';state.reveal=false;$('reveal').hidden=true;syncPolicy();loadNoteDraft();persist();renderStage();}
 $('stage').onchange=async()=>{const next=Number($('stage').value);if(next===state.stage)return;if(!await confirmAction('Change stage and reset policy settings and group explanations? Downloaded and saved records remain. Save an attempt first if needed.')){$('stage').value=state.stage;return;}collect();state.stage=next;resetWorking();say('New stage started from the original policy baseline. Saved evidence is unchanged.');};
 $('reset').onclick=async()=>{if(await confirmAction('Reset current policy settings and group explanations? Saved records and individual notes remain.')){collect();resetWorking();say('Current policy reset.');}};
 function download(filename,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
 const fileBase=()=>((state.group||'group').replace(/[^a-z0-9_-]/gi,'_'))+'_IDN_2013';
 function exportJSON(){collect();download(fileBase()+'_backup.json',JSON.stringify({...state,exportedAt:new Date().toISOString(),appVersion:C.version},null,2),'application/json');}
 $('export-json').onclick=exportJSON;
 const groupColumns=['id','kind','timestamp','country','group','stage','members','roles','modelVersion','cutoff','petrol_RpPerLitre','diesel_RpPerLitre','tax_RpTrillion','assistance_RpTrillion','borrowing_RpTrillion','revenue_RpTrillion','expenditure_RpTrillion','deficit_RpTrillion','deficitPercentGDPProxy','financingGap_RpTrillion','subsidySavings_RpTrillion','inflationPercent','businessCostPercent','transferPerTargetHousehold_Rp','householdNet_Rp','reason1','reason2','government','businesses','communities','revision','limitation','agreement','implementation','changed','assumptions','baseline','comparison'];
 function groupRow(r){return {id:r.id,kind:r.kind,timestamp:r.timestamp,country:r.country,group:r.group,stage:r.stage,members:r.members,roles:r.roles,modelVersion:r.model.version,cutoff:r.cutoff,petrol_RpPerLitre:r.policy.petrol,diesel_RpPerLitre:r.policy.diesel,tax_RpTrillion:r.policy.tax,assistance_RpTrillion:r.policy.assistance,borrowing_RpTrillion:r.policy.borrowing,revenue_RpTrillion:r.outputs.revenue,expenditure_RpTrillion:r.outputs.expenditure,deficit_RpTrillion:r.outputs.deficit,deficitPercentGDPProxy:r.outputs.deficitPercent,financingGap_RpTrillion:r.outputs.financingGap,subsidySavings_RpTrillion:r.outputs.savings,inflationPercent:r.outputs.inflation,businessCostPercent:r.outputs.businessCostPercent,transferPerTargetHousehold_Rp:r.outputs.transferPerHousehold,householdNet_Rp:r.outputs.householdNet,...r.form,assumptions:r.model.assumptions,baseline:r.model.baseline,comparison:r.comparison};}
 $('export-groups').onclick=()=>download(fileBase()+'_group_records.csv',M.csv(state.records.map(groupRow),groupColumns),'text/csv;charset=utf-8');
 const noteColumns=['id','timestamp','country','group','student','stage','role','linkedGroupRecordId','modelVersion',...noteKeys,'policyAtWriting','assumptions'];
 $('export-notes').onclick=()=>download(fileBase()+'_individual_notes.csv',M.csv(state.notes.map(n=>({...n,...n.responses})),noteColumns),'text/csv;charset=utf-8');
 $('import').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>12*1024*1024)throw Error('Backup exceeds the 12 MB limit.');const imported=validateBackup(JSON.parse(await f.text()));if(!await confirmAction('Replace the work in this browser with the imported backup? Download current work first.'))return;state=imported;storageOK=true;if(!persist())throw Error('Browser could not save the imported backup. The original download is unchanged.');location.reload();}catch(err){say('Import failed: '+err.message,true);}finally{e.target.value='';}};
 $('clear').onclick=async()=>{if(await confirmAction('Permanently clear local records, notes and drafts for this app? Download a backup first.')){try{localStorage.removeItem(KEY);state=fresh();location.reload();}catch(e){say('Browser storage could not be cleared.',true);}}};
 function renderRecords(){
  $('record-count').textContent=state.records.length+state.notes.length;
  const list=$('record-list');list.replaceChildren();
  if(!state.records.length&&!state.notes.length){const p=document.createElement('p');p.textContent='No saved records yet. Save attempts, selected decisions and individual notes from the simulation.';list.append(p);}
  for(const r of [...state.records,...state.notes].sort((a,b)=>b.timestamp.localeCompare(a.timestamp))){
   const card=document.createElement('article');card.className='record-card';
   const title=document.createElement('h3');title.textContent=(r.kind||'individual note')+' · '+r.group+' · '+(r.stage===4?'Final':'Round '+r.stage);card.append(title);
   const p=document.createElement('p');p.className='small';p.textContent=r.id+' · '+new Date(r.timestamp).toLocaleString();card.append(p);
   const detail=document.createElement('details'),sum=document.createElement('summary'),pre=document.createElement('pre');sum.textContent='View full record';pre.textContent=JSON.stringify(r,null,2);detail.append(sum,pre);card.append(detail);
   const button=document.createElement('button');button.className='secondary';button.textContent='Download this JSON';button.onclick=()=>download(r.id.replace(/[^a-z0-9_-]/gi,'_')+'.json',JSON.stringify(r,null,2),'application/json');card.append(button);list.append(card);
  }
 }
 function snapshotHTML(r){
  const row=(k,v)=>`<tr><th>${escape(k)}</th><td>${escape(typeof v==='object'?JSON.stringify(v):v)}</td></tr>`;
  return '<!doctype html><html lang="en"><meta charset="utf-8"><title>Indonesia policy snapshot</title><style>body{font:16px/1.5 system-ui;max-width:900px;margin:36px auto;padding:20px;color:#142c3e}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;text-align:left;padding:8px;vertical-align:top;overflow-wrap:anywhere}th{width:35%}h1{font-size:28px}p{white-space:pre-wrap}@media print{body{margin:0}}</style><h1>Indonesia 2013 policy snapshot</h1><p>Calibrated to 2013 · M simulated outputs · '+escape(r.id)+'</p><table>'+row('Date',r.timestamp)+row('Group',r.group)+row('Stage',r.stage)+row('Model version',r.model.version)+Object.entries(r.policy).map(([k,v])=>row(k,k==='petrol'||k==='diesel'?rp(v)+' / litre':t(v))).join('')+Object.entries(r.outputs).map(([k,v])=>row(k,typeof v==='number'?Number(v.toFixed(6)):v)).join('')+'</table><p>Budget outputs and financing: Rp trillion. DeficitPercent, price increases, inflation and business cost: percent; inflationIncrement: percentage points; transfers and household amounts: Rp over four months.</p>'+Object.entries(r.form).map(([k,v])=>'<h2>'+escape(k)+'</h2><p>'+escape(v)+'</p>').join('')+'<h2>Assumptions and baseline</h2><table>'+row('Assumptions',r.model.assumptions)+row('Baseline',r.model.baseline)+'</table><p>Model results are teaching illustrations, not observed national outcomes. This file has not been sent to the instructor.</p></html>';
 }
 $('snapshot').onclick=()=>{try{collect();ensureInputs(false);download(fileBase()+'_snapshot.html',snapshotHTML(snapshot('snapshot')),'text/html;charset=utf-8');}catch(e){say(e.message,true);}};
 $('print').onclick=()=>window.print();
 function renderReveal(){
  $('reveal').innerHTML='<div class="reveal-item"><h3>21 June 2013 decision · revealed after the cutoff</h3><p><span class="tag">O/D historical comparison</span> Petrol moved to Rp6,500 per litre; diesel to Rp5,500. These were increases of 44.4% and 22.2% from Rp4,500. This version did not label these as known options at the cutoff.</p></div><div class="reveal-item"><h3>Assumptions are different from outcomes</h3><p><span class="tag">O</span> Revised-budget inflation assumption: 6.3%. <span class="tag">D</span> BPS reported October 2013 year-on-year inflation of 8.32%. These have different reference periods. The gap does not measure the fuel reform’s causal effect.</p></div><div class="reveal-item"><h3>Cash assistance and the wider package</h3><p><span class="tag">O</span> The supplied sheet describes a planned Rp29.1T package; Rp9.3T was the cash-transfer component. Our assistance control models extra cash only, so Rp29.1T must not be interpreted as the historical cash-transfer amount. The sheet describes four monthly payments in the plan and three actual payments with the same Rp600,000 total; that payment-timing claim still needs primary-source verification and is not simulated.</p></div><p>Discuss who bears the cost, what the model leaves out, and why reproducing a budget assumption does not validate a forecast. Read the source and verification notes in Data & model.</p>';
  $('reveal').hidden=!state.reveal;
 }
 $('reveal-button').onclick=()=>{if(!state.records.some(r=>r.group===state.group&&r.stage===state.stage&&r.kind!=='attempt')){say('Submit a selected group record for this stage before opening the historical reveal.',true);return;}state.reveal=!state.reveal;renderReveal();persist();};
 $('version').textContent=C.version;
 renderAssumptions();renderStage();renderRecords();renderReveal();loadNoteDraft();
})();
