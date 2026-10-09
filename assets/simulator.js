(() => {
const data=window.RateSimulator;
const form=document.querySelector('#rate-form');
const pref=document.querySelector('#prefecture');
const area=document.querySelector('#power-area');
const gas=document.querySelector('#gas-provider');
const result=document.querySelector('#sim-result');
const values=document.querySelector('#result-numbers');
const yen=n=>n.toLocaleString('ja-JP');
// Use the simulator's single dataset for the expandable comparison list.
const allRates=document.querySelector('#all-rate-tables');
for(const [label,items] of [['電気',data.electricity],['都市ガス',data.gas]]){
 const table=document.createElement('table');table.className='rate-list-table';
 const caption=table.createCaption();caption.textContent=label;
 const head=table.createTHead().insertRow();
 for(const label of ['9月使用分','10月使用分','値上がり']){
  const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th);
 }
 for(const item of Object.values(items)){
  const body=table.createTBody();const title=body.insertRow();
  const name=document.createElement('th');name.colSpan=3;name.scope='rowgroup';name.textContent=item.name;title.append(name);
  const row=body.insertRow();
  [yen(item.current-item.increase)+'円',yen(item.current)+'円','＋'+yen(item.increase)+'円'].forEach((text,i)=>{
   const cell=row.insertCell();cell.textContent=text;if(i===2)cell.className='rate-list-increase';
  });
 }
 allRates.append(table);
}

data.prefectures.forEach(([name])=>pref.add(new Option(name,name)));
function setConsultationReady(ready){
 document.querySelectorAll('.mobile-cta .check-rates').forEach(el=>el.hidden=ready);
 document.querySelectorAll('.after-result').forEach(el=>el.hidden=!ready);

}
function resetResult(){result.hidden=true;values.replaceChildren();setConsultationReady(false);}
pref.addEventListener('change',()=>{
 resetResult();gas.value="";area.replaceChildren();
 const selected=data.prefectures.find(p=>p[0]===pref.value);
 document.querySelector('#area-field').hidden=!selected;
 if(!selected)return;
 const ids=selected[1].split(',');
 if(ids.length>1)area.add(new Option('分からない（候補の幅を確認）',''));
 Object.entries(data.electricity).forEach(([id,item])=>area.add(new Option(item.name+'エリア',id)));
 area.value=ids.length===1?ids[0]:'';
 document.querySelector('#area-help').textContent=ids.length>1?'複数エリアあり・変更可':'電力エリアの変更可';
});
area.addEventListener('change',resetResult);gas.addEventListener('change',resetResult);
function card(item,label){
 const article=document.createElement('article');article.className='rate-result-card';
 // All interpolated fields below come from the fixed, validated dataset.
 article.innerHTML='<p class="rate-kind">'+label+'｜'+item.name+'</p><p class="rate-difference"><span>前月より</span><strong>＋'+yen(item.increase)+'</strong><b>円／月</b></p><div class="rate-comparison"><p>9月使用分<strong>'+yen(item.previous)+'<small>円</small></strong></p><span aria-hidden="true">→</span><p>10月使用分<strong>'+yen(item.current)+'<small>円</small></strong></p></div>';
 return article;
}
form.addEventListener('submit',event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const calculation=data.calculate(pref.value,area.value,gas.value);
 values.replaceChildren();
 document.querySelector('#result-heading').textContent=calculation.prefecture+'の料金目安';
 if(calculation.electricity.length>1){
  const amounts=calculation.electricity.map(v=>v.increase);
  const range=document.createElement('p');range.className='rate-range';range.textContent='電気は月＋'+yen(Math.min(...amounts))+'〜'+yen(Math.max(...amounts))+'円';values.append(range);
  const note=document.createElement('p');note.className='fine';note.textContent='電力エリア未確定・候補を表示';values.append(note);
 }
 calculation.electricity.forEach(item=>values.append(card(item,'電気')));
 if(calculation.gas)values.append(card(calculation.gas,'都市ガス'));
 else {
  const note=document.createElement('p');note.className='gas-result-note';
  note.textContent=gas.value==='none'?'ガス利用なし':gas.value==='lpg'?'LPガスは試算対象外':gas.value==='other'?'選択したガス会社は試算対象外':'電気のみの目安';values.append(note);
 }
 result.hidden=false;setConsultationReady(true);
 result.focus({preventScroll:true});
 result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
});
})();
