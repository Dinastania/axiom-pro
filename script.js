/* AXIOM PRO 3.0: local-first, no external JS dependencies. */
'use strict';
window.addEventListener('DOMContentLoaded',()=>{
const $=id=>document.getElementById(id),KEY='axiom_trades_v1',GOALS='axiom_pro_goals_v1',PLAY='axiom_playbook_v1';
const now=new Date();let month=new Date(now.getFullYear(),now.getMonth(),1),trades=[],demo=false,pendingImage='',goals={target:2000,limit:200};
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}};
const saved=read(KEY,[]);if(Array.isArray(saved))trades=saved;goals={...goals,...read(GOALS,{})};
const sample=[['2026-10-02','BTCUSDT','LONG','Breakout',336,115],['2026-10-03','EURUSD','SHORT','Pullback',-40,20],['2026-10-04','XAUUSD','LONG','SMC',95,50],['2026-10-06','ETHUSDT','LONG','Breakout',252,80],['2026-10-07','XAUUSD','SHORT','Pullback',-35,25],['2026-10-09','BTCUSDT','LONG','Breakout',450,140],['2026-10-10','NASDAQ','LONG','SMC',141,60]].map((t,i)=>({id:i+1,date:t[0],symbol:t[1],side:t[2],strategy:t[3],pnl:t[4],risk:t[5],entry:100,exit:110,qty:1,mood:'Bình tĩnh',notes:'Dữ liệu minh họa',image:''}));
const current=()=>demo?sample:trades,num=x=>Number(x)||0,money=x=>{let n=num(x);return(n<0?'−':'')+'$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})},element=(tag,value,cls)=>{let e=document.createElement(tag);e.textContent=String(value??'');if(cls)e.className=cls;return e},sortDate=(a,b)=>a.date.localeCompare(b.date)||num(a.id)-num(b.id),getR=t=>num(t.risk||t.riskAmount)>0?num(t.pnl)/num(t.risk||t.riskAmount):null,plannedRR=t=>{if(t.sl==null||t.tp==null||t.sl===''||t.tp==='')return null;let sign=t.side==='SHORT'?-1:1,risk=(num(t.entry)-num(t.sl))*sign,reward=(num(t.tp)-num(t.entry))*sign;return risk>0&&reward>0?reward/risk:null};
function toast(s){$('toast').textContent=s;$('toast').style.display='block';clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('toast').style.display='none',3200)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(trades));demo=false;render();return true}catch(e){toast('Trình duyệt không đủ dung lượng. Hãy giảm ảnh và sao lưu JSON.');return false}}
function daily(t){let map={};t.forEach(x=>{if(!map[x.date])map[x.date]={pnl:0,items:[]};map[x.date].pnl+=num(x.pnl);map[x.date].items.push(x)});return map}
function render(){let t=current(),wins=t.filter(x=>num(x.pnl)>0),losses=t.filter(x=>num(x.pnl)<0),gw=wins.reduce((s,x)=>s+num(x.pnl),0),gl=-losses.reduce((s,x)=>s+num(x.pnl),0),net=gw-gl,rate=t.length?wins.length/t.length*100:0,curve=[0],total=0,peak=0,dd=0,streak=0;[...t].sort(sortDate).forEach(x=>{total+=num(x.pnl);curve.push(total);peak=Math.max(peak,total);dd=Math.max(dd,peak-total);streak=num(x.pnl)>0?streak+1:0});$('demoBanner').hidden=!demo;$('demoBtn').textContent=demo?'← Dữ liệu cá nhân':'Xem dữ liệu mẫu';$('totalPnl').textContent=money(net);$('totalPnl').className='number '+(net>=0?'positive':'negative');$('winRate').textContent=rate.toFixed(1)+'%';$('winText').textContent=wins.length+' wins · '+losses.length+' losses';$('profitFactor').textContent=gl?(gw/gl).toFixed(2):(gw?'∞':'—');$('drawdown').textContent=money(-dd);$('avgWin').textContent=money(wins.length?gw/wins.length:0);$('avgLoss').textContent=money(losses.length?-gl/losses.length:0);$('expectancy').textContent=money(t.length?net/t.length:0);$('streak').textContent=streak;$('winMeter').style.width=rate+'%';$('meterText').textContent=rate.toFixed(1)+'% winning trades';$('tradeCount').textContent=t.length+' trades';drawChart(curve,net);drawCalendar(t);drawStrategies(t);drawGoals(t);drawTable(t)}
function drawChart(values,net){let min=Math.min(0,...values),max=Math.max(0,...values),span=max-min||1,points=values.map((v,i)=>[28+i*694/Math.max(values.length-1,1),227-(v-min)/span*184]);$('chartGrid').replaceChildren();[45,90,135,180,230].forEach(y=>{let l=document.createElementNS('http://www.w3.org/2000/svg','line');Object.entries({x1:0,x2:760,y1:y,y2:y,stroke:'#2b404c','stroke-dasharray':'4 6'}).forEach(([k,v])=>l.setAttribute(k,v));$('chartGrid').appendChild(l)});let path=points.map((p,i)=>(i?'L':'M')+p[0]+','+p[1]).join(' '),last=points[points.length-1];$('eqLine').setAttribute('d',path);$('eqLine').setAttribute('stroke',net>=0?'#44f2b5':'#ff718d');$('eqArea').setAttribute('d',path+' L'+last[0]+',250 L28,250 Z');$('eqDot').setAttribute('cx',last[0]);$('eqDot').setAttribute('cy',last[1]);$('eqDot').setAttribute('fill',net>=0?'#44f2b5':'#ff718d')}
function drawCalendar(t){let map=daily(t),y=month.getFullYear(),m=month.getMonth(),root=$('calendarGrid');root.replaceChildren();$('monthTitle').textContent=month.toLocaleDateString('vi-VN',{month:'long',year:'numeric'});['T2','T3','T4','T5','T6','T7','CN'].forEach(s=>root.appendChild(element('div',s,'dow')));for(let i=0,n=(new Date(y,m,1).getDay()+6)%7;i<n;i++)root.appendChild(element('div','','day empty'));let max=new Date(y,m+1,0).getDate();for(let d=1;d<=max;d++){let key=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'),item=map[key],value=item?.pnl||0,b=document.createElement('button');b.type='button';b.className='day'+(value>0?' good':value<0?' bad':'');b.appendChild(element('span',d));if(item)b.appendChild(element('strong',(value>0?'+':'')+Math.round(value)));b.title=key+' · '+money(value);b.addEventListener('click',()=>showDay(key,item));root.appendChild(b)}}

function showDay(date, item) {
  const dialog = $('dayDialog');
  const body = $('dayDetails');
  const items = Array.isArray(item?.items) ? item.items : [];
  const net = num(item?.pnl);
  const wins = items.filter(t => num(t.pnl) > 0).length;
  const losses = items.filter(t => num(t.pnl) < 0).length;

  const status = !items.length
    ? 'NO TRADES'
    : net > 0 ? 'PROFIT DAY'
    : net < 0 ? 'LOSS DAY'
    : 'BREAKEVEN';

  const tone = !items.length || net === 0
    ? 'neutral' : net > 0 ? 'profit' : 'loss';

  const signedMoney = value =>
    num(value) > 0 ? '+' + money(value) : money(value);

  const make = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = String(text);
    return node;
  };

  const [year, month, day] = date.split('-').map(Number);
  const dayLabel = new Date(year, month - 1, day)
    .toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

  $('dayHeading').textContent = dayLabel;
  body.replaceChildren();

  // 01 — Main PNL card
  const hero = make('section', 'adi-pnl-card ' + tone);

  const heroTop = make('div', 'adi-pnl-top');
  heroTop.append(
    make('span', 'adi-label', 'NET REALIZED PNL'),
    make('span', 'adi-status', status)
  );

  hero.append(
    heroTop,
    make('strong', 'adi-net', signedMoney(net)),
    make(
      'span',
      'adi-pnl-caption',
      !items.length
        ? 'Chưa ghi nhận giao dịch trong ngày'
        : items.length + ' giao dịch đã đóng'
    )
  );
  body.appendChild(hero);

  // 02 — Performance summary
  const stats = make('div', 'adi-stats');

  [
    ['TOTAL TRADES', items.length, ''],
    ['WINNING', wins, 'is-profit'],
    ['LOSING', losses, 'is-loss']
  ].forEach(([label, value, cls]) => {
    const card = make('div', 'adi-stat');
    card.append(
      make('span', 'adi-label', label),
      make('strong', cls, String(value).padStart(2, '0'))
    );
    stats.appendChild(card);
  });

  body.appendChild(stats);

  // 03 — Trade activity
  const section = make('section', 'adi-activity');

  const heading = make('div', 'adi-section-head');
  heading.append(
    make('h4', '', 'TRADE ACTIVITY'),
    make('span', '', items.length + ' closed trade' +
      (items.length === 1 ? '' : 's'))
  );
  section.appendChild(heading);

  if (!items.length) {
    const empty = make('div', 'adi-empty');
    empty.append(
      make('div', 'adi-empty-icon', '◇'),
      make('strong', '', 'No trading activity'),
      make(
        'p',
        '',
        'Chưa có giao dịch nào được ghi nhận vào ngày này.'
      )
    );
    section.appendChild(empty);
  } else {
    items.forEach((trade, index) => {
      const pnl = num(trade.pnl);
      const card = make(
        'article',
        'adi-trade ' +
        (pnl > 0 ? 'profit' : pnl < 0 ? 'loss' : 'neutral')
      );

      const top = make('div', 'adi-trade-top');
      const identity = make('div', 'adi-trade-identity');

      identity.append(
        make('strong', 'adi-symbol', trade.symbol || 'UNKNOWN'),
        make(
          'span',
          'adi-strategy',
          trade.strategy || trade.setup || 'Trading position'
        )
      );

      const side = make(
        'span',
        'adi-side ' + (trade.side === 'SHORT' ? 'short' : 'long'),
        trade.side === 'SHORT' ? 'SHORT ↘' : 'LONG ↗'
      );

      top.append(identity, side);

      const bottom = make('div', 'adi-trade-bottom');
      const result = make('div', 'adi-trade-result');

      result.append(
        make('span', '', 'REALIZED PNL'),
        make('strong', '', signedMoney(pnl))
      );

      const view = make('button', 'adi-view', 'View ↗');
      view.type = 'button';
      view.setAttribute(
        'aria-label',
        'Xem giao dịch ' + (trade.symbol || index + 1)
      );

      // Reuse the existing trade detail system.
      view.addEventListener('click', () => showTrade(trade));

      bottom.append(result, view);
      card.append(top, bottom);
      section.appendChild(card);
    });
  }

  body.appendChild(section);
  dialog.showModal();
}

function drawStrategies(t){let groups=new Map();t.forEach(x=>{let name=String(x.strategy||x.setup||'Không đặt tên').trim()||'Không đặt tên',v=groups.get(name)||{pnl:0,count:0};v.pnl+=num(x.pnl);v.count++;groups.set(name,v)});let items=[...groups.entries()].sort((a,b)=>b[1].pnl-a[1].pnl).slice(0,6),root=$('strategyRows');root.replaceChildren();if(!items.length){root.appendChild(element('p','Chưa có giao dịch.','muted'));$('strategyInsight').textContent='Nhập lệnh và tên chiến lược để xem phân tích.';return}let max=Math.max(1,...items.map(x=>Math.abs(x[1].pnl)));items.forEach(([name,v])=>{let row=element('div','','strategy-line'),track=element('div','','track'),fill=document.createElement('i');fill.style.width=Math.max(2,Math.abs(v.pnl)/max*100)+'%';fill.style.background=v.pnl>=0?'#44f2b5':'#ff718d';track.appendChild(fill);let label=element('span',name+' ('+v.count+')');label.title=name;row.append(label,track,element('strong',money(v.pnl),v.pnl>=0?'positive':'negative'));root.appendChild(row)});$('strategyInsight').textContent=items[0][1].pnl>0?'Setup dẫn đầu: '+items[0][0]+' · '+money(items[0][1].pnl)+' trên '+items[0][1].count+' lệnh.':'Chưa có setup tạo PNL dương.'}
function drawGoals(t){let prefix=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0'),monthly=t.filter(x=>x.date.startsWith(prefix)),sum=monthly.reduce((s,x)=>s+num(x.pnl),0),target=Math.max(1,num(goals.target)),limit=Math.max(1,num(goals.limit)),progress=Math.max(0,sum/target*100),bad=Object.values(daily(monthly)).filter(x=>x.pnl<=-limit);$('goalPercent').textContent=progress.toFixed(1)+'%';$('goalBar').style.width=Math.min(100,progress)+'%';$('monthNet').textContent=money(sum);$('monthNet').className=sum>=0?'positive':'negative';$('goalAmount').textContent='/ '+money(target);$('riskNotice').textContent=bad.length?'⚠ '+bad.length+' ngày có PNL chạm/vượt giới hạn lỗ '+money(limit)+' trong tháng.':'✓ Chưa có ngày nào chạm giới hạn lỗ '+money(limit)+' trong tháng.'}
function drawTable(t){let q=$('search').value.toLowerCase().trim(),side=$('sideFilter').value,out=$('resultFilter').value,mon=$('monthFilter').value,items=t.filter(x=>(x.symbol+' '+(x.strategy||x.setup||'')+' '+(x.notes||'')).toLowerCase().includes(q)&&(side==='all'||x.side===side)&&(out==='all'||out==='win'&&num(x.pnl)>0||out==='loss'&&num(x.pnl)<0||out==='flat'&&num(x.pnl)===0)&&(!mon||x.date.startsWith(mon))).sort((a,b)=>sortDate(b,a)),root=$('tradeRows');root.replaceChildren();$('filterCount').textContent=items.length+' entries';$('emptyState').style.display=items.length?'none':'block';items.forEach(x=>{let row=document.createElement('tr'),r=getR(x);[x.date,x.symbol,x.side,x.strategy||x.setup||'—',x.entry+' → '+x.exit,money(x.pnl),r===null?'—':r.toFixed(2)+'R',x.mood||'—',x.notes||'—'].forEach((v,i)=>{let cell=element('td',v,i===5?(num(x.pnl)>=0?'positive':'negative'):i===8?'note-cell':'');if(i===8)cell.title=String(v);row.appendChild(cell)});let actions=document.createElement('td'),view=element('button','View'),del=element('button','×');view.type=del.type='button';view.addEventListener('click',()=>showTrade(x));del.disabled=demo;del.addEventListener('click',()=>{if(!confirm('Xóa giao dịch '+x.symbol+'?'))return;let old=trades;trades=trades.filter(v=>v.id!==x.id);if(!save())trades=old;else toast('Đã xóa giao dịch')});actions.append(view,' ',del);row.appendChild(actions);root.appendChild(row)})}
function showTrade(x){$('tradeHeading').textContent=x.symbol+' · '+x.side;let root=$('tradeDetails');root.replaceChildren();root.appendChild(element('h2',money(x.pnl),num(x.pnl)>=0?'positive':'negative'));[['Ngày',x.date],['Chiến lược',x.strategy||x.setup||'—'],['Entry → Exit',x.entry+' → '+x.exit],['SL',x.sl??'—'],['TP',x.tp??'—'],['Planned R:R',plannedRR(x)===null?'—':plannedRR(x).toFixed(2)+':1'],['Realized R',getR(x)===null?'—':getR(x).toFixed(2)+'R'],['Ghi chú',x.notes||'—']].forEach(([k,v])=>root.appendChild(element('p',k+': '+v)));if(typeof x.image==='string'&&x.image.startsWith('data:image/jpeg;base64,')){let img=document.createElement('img');img.src=x.image;img.alt='Ảnh chụp lệnh '+x.symbol;root.appendChild(img)}$('tradeDialog').showModal()}
function liveRisk(){let val=id=>$(id).value,ratio=plannedRR({entry:val('entryPrice'),sl:val('sl'),tp:val('tp'),side:val('side')}),risk=num(val('risk'));$('rrPreview').textContent=ratio===null?'—':ratio.toFixed(2)+':1';$('rPreview').textContent=risk>0&&val('pnl')!==''?(num(val('pnl'))/risk).toFixed(2)+'R':'—'}
function compress(file){return new Promise((resolve,reject)=>{if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){reject(Error('Chọn ảnh JPG/PNG/WebP dưới 8 MB.'));return}let reader=new FileReader();reader.onerror=()=>reject(Error('Không đọc được ảnh'));reader.onload=()=>{let img=new Image();img.onerror=()=>reject(Error('Ảnh không hợp lệ'));img.onload=()=>{let scale=Math.min(1,850/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);let result=canvas.toDataURL('image/jpeg',.62);result.length>600000?reject(Error('Ảnh vẫn quá lớn sau nén.')):resolve(result)};img.src=String(reader.result)};reader.readAsDataURL(file)})}
$('screenshot').addEventListener('change',async e=>{pendingImage='';$('imagePreview').hidden=true;let file=e.target.files?.[0];if(!file)return;try{pendingImage=await compress(file);$('imagePreview').src=pendingImage;$('imagePreview').hidden=false}catch(err){toast(err.message);e.target.value=''}});
$('tradeForm').addEventListener('submit',e=>{e.preventDefault();let val=id=>$(id).value.trim(),x={id:Date.now()+Math.random(),date:val('date'),symbol:val('symbol').toUpperCase(),side:val('side'),strategy:val('strategy'),entry:Number(val('entryPrice')),exit:Number(val('exitPrice')),sl:val('sl')?Number(val('sl')):null,tp:val('tp')?Number(val('tp')):null,qty:Number(val('qty')),risk:val('risk')?Number(val('risk')):null,pnl:Number(val('pnl')),mood:val('mood'),notes:val('notes'),image:pendingImage};if(!x.date||!x.symbol||!(x.qty>0)||!Number.isFinite(x.pnl)||!Number.isFinite(x.entry)||!Number.isFinite(x.exit)){toast('Thông tin giao dịch chưa hợp lệ.');return}let old=trades;trades=[...trades,x];if(save()){$('tradeForm').reset();$('date').value=new Date().toLocaleDateString('en-CA');pendingImage='';$('imagePreview').hidden=true;liveRisk();toast('✓ Đã lưu lệnh '+x.symbol)}else trades=old});
$('demoBtn').addEventListener('click',()=>{demo=!demo;render()});$('prevMonth').addEventListener('click',()=>{month.setMonth(month.getMonth()-1);drawCalendar(current())});$('nextMonth').addEventListener('click',()=>{month.setMonth(month.getMonth()+1);drawCalendar(current())});$('closeDay').addEventListener('click',()=>$('dayDialog').close());$('closeTrade').addEventListener('click',()=>$('tradeDialog').close());['entryPrice','sl','tp','side','risk','pnl'].forEach(id=>$(id).addEventListener('input',liveRisk));['search','sideFilter','resultFilter','monthFilter'].forEach(id=>$(id).addEventListener('input',()=>drawTable(current())));$('clearFilters').addEventListener('click',()=>{$('search').value='';$('sideFilter').value='all';$('resultFilter').value='all';$('monthFilter').value='';drawTable(current())});
$('target').value=goals.target;$('dailyLimit').value=goals.limit;$('saveGoals').addEventListener('click',()=>{let target=Number($('target').value),limit=Number($('dailyLimit').value);if(!(target>0&&limit>0)){toast('Mục tiêu và giới hạn lỗ phải lớn hơn 0.');return}goals={target,limit};localStorage.setItem(GOALS,JSON.stringify(goals));drawGoals(current());toast('✓ Đã lưu mục tiêu')});$('playbookText').value=localStorage.getItem(PLAY)||'';$('savePlaybook').addEventListener('click',()=>{localStorage.setItem(PLAY,$('playbookText').value);toast('✓ Đã lưu nguyên tắc')});
function download(name,contents,type){let blob=new Blob([contents],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1700)}
$('exportCsv').addEventListener('click',()=>{let keys=['date','symbol','side','strategy','entry','exit','sl','tp','qty','risk','pnl','mood','notes'],lines=[keys.join(','),...trades.map(t=>keys.map(k=>{let v=String(t[k]??'');if(/^[=+@\t\r]/.test(v))v="'"+v;return '"'+v.replaceAll('"','""')+'"'}).join(','))];download('axiom-pro-trades.csv','\ufeff'+lines.join('\r\n'),'text/csv;charset=utf-8');toast('Đã xuất CSV')});$('backup').addEventListener('click',()=>{download('axiom-pro-backup.json',JSON.stringify({version:3,exportedAt:new Date().toISOString(),trades,goals,playbook:$('playbookText').value},null,2),'application/json');toast('Đã xuất bản sao lưu JSON')});$('importBtn').addEventListener('click',()=>$('importFile').click());$('importFile').addEventListener('change',async e=>{let file=e.target.files?.[0];if(!file)return;try{let data=JSON.parse(await file.text()),items=Array.isArray(data)?data:data.trades;if(!Array.isArray(items))throw Error('Tệp không có danh sách giao dịch');let clean=items.filter(t=>t&&typeof t.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(t.date)&&typeof t.symbol==='string'&&Number.isFinite(Number(t.pnl))).map((t,i)=>({...t,id:Date.now()+i+Math.random(),symbol:t.symbol.slice(0,30),side:t.side==='SHORT'?'SHORT':'LONG',pnl:Number(t.pnl),entry:num(t.entry),exit:num(t.exit),qty:num(t.qty||t.quantity)||1,risk:t.risk?num(t.risk):t.riskAmount?num(t.riskAmount):null,strategy:String(t.strategy||t.setup||''),sl:t.sl??t.stopLoss??null,tp:t.tp??t.takeProfit??null,image:typeof t.image==='string'&&t.image.startsWith('data:image/jpeg;base64,')?t.image:''}));if(!confirm('Thay thế '+trades.length+' lệnh hiện tại bằng '+clean.length+' lệnh từ bản sao lưu?'))return;let old=trades;trades=clean;if(!save()){trades=old;return}if(data.goals&&num(data.goals.target)>0&&num(data.goals.limit)>0){goals=data.goals;localStorage.setItem(GOALS,JSON.stringify(goals));$('target').value=goals.target;$('dailyLimit').value=goals.limit}if(typeof data.playbook==='string'){$('playbookText').value=data.playbook;localStorage.setItem(PLAY,data.playbook)}render();toast('✓ Đã nhập '+clean.length+' giao dịch')}catch(err){toast('Lỗi sao lưu: '+err.message)}finally{e.target.value=''}});
$('reminderForm').addEventListener('submit',e=>{e.preventDefault();localStorage.setItem('axiom_reminder',JSON.stringify({name:$('firstname').value,email:$('email').value}));$('reminderMessage').textContent='Đã lưu cục bộ; không tự gửi email.'});$('date').value=new Date().toLocaleDateString('en-CA');render();
});
