const root = document.querySelector('#app');
let items = [];
const objectives = [
  'Challenge founder claims', 'Investigate founders and team',
  'Find competitors and market threats', 'Investigate technology differentiation',
  'Identify negative news and controversies'
];
const h = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
const date = value => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

async function api(path, options = {}) {
  const response = await fetch('/api/investigations' + path, options);
  if (!response.ok) throw Error((await response.json()).detail || 'Request failed');
  return response.json();
}

function inlineMarkdown(value) {
  let text = h(value);
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  text = text.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');
  text = text.replace(/(?<!["=])(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  return text;
}

function markdown(source) {
  const lines = String(source ?? '').replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (/^```/.test(line)) {
      const code = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++;
      out.push(`<pre><code>${h(code.join('\n'))}</code></pre>`); continue;
    }
    if (/^\s*([-*_]\s*){3,}$/.test(line)) { out.push('<hr>'); i++; continue; }
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const cells = value => value.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(x => x.trim());
      const head = cells(lines[i]); i += 2;
      let rows = '';
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows += `<tr>${cells(lines[i++]).map(cell => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`;
      }
      out.push(`<div class="table-scroll"><table><thead><tr>${head.map(cell => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`); continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) { const level = heading[1].length; out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); i++; continue; }
    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${quote.map(inlineMarkdown).join('<br>')}</blockquote>`); continue;
    }
    if (/^\s*[-*+]\s+/.test(line)) {
      const list = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) list.push(`<li>${inlineMarkdown(lines[i++].replace(/^\s*[-*+]\s+/, ''))}</li>`);
      out.push(`<ul>${list.join('')}</ul>`); continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const list = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) list.push(`<li>${inlineMarkdown(lines[i++].replace(/^\s*\d+[.)]\s+/, ''))}</li>`);
      out.push(`<ol>${list.join('')}</ol>`); continue;
    }
    const para = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|>|\s*[-*+]\s+|\s*\d+[.)]\s+|```|\|)/.test(lines[i])) para.push(lines[i++]);
    out.push(`<p>${para.map(inlineMarkdown).join('<br>')}</p>`);
  }
  return out.join('\n');
}

function header(label = 'Investment intelligence') {
  return `<header class="header"><a class="brand" href="/app/">Sherlock Capital</a><span class="eyebrow">${h(label)}</span></header>`;
}
function frame(body, label) { root.innerHTML = `<main class="shell">${header(label)}${body}</main>`; }
function loading(label = 'Loading your investigations') {
  root.innerHTML = `<main class="shell">${header()}<section class="section loading-state"><span class="spinner"></span><div><b>${h(label)}</b><div class="small muted">Getting the latest case updates…</div></div></section></main>`;
}

async function dashboard() {
  loading();
  try { items = await api(''); }
  catch (error) {
    frame(`<section class="section"><div class="notice error-panel"><b>Could not load investigations</b><p>${h(error.message)}</p><button class="btn ghost" onclick="dashboard()">Try again</button></div></section>`, 'INVESTIGATIONS');
    return;
  }
  const pending = items.filter(item => ['queued', 'investigating'].includes(item.status)).length;
  const completed = items.filter(item => item.status === 'completed').length;
  frame(`<section class="section"><div class="row"><div><div class="eyebrow">Private market intelligence</div><h1>Investigations</h1></div><span class="pill green"><span class="live-dot"></span> Live workspace</span></div>
    <div class="grid"><div class="card"><div class="metric">${String(pending).padStart(2, '0')}</div><div class="muted">In progress</div></div><div class="card"><div class="metric" style="color:#a8701e">${String(items.filter(item => item.status === 'review').length).padStart(2, '0')}</div><div class="muted">Review required</div></div><div class="card"><div class="metric" style="color:#69736b">${String(completed).padStart(2, '0')}</div><div class="muted">Completed</div></div></div></section>
    <section class="section"><div class="row"><h2>Recent investigations</h2><span class="small muted">${items.length} total</span></div><div class="list">${items.length ? items.map(item => `<a class="invest" href="/app/?id=${h(item.id)}"><div><b>${h(item.name)}</b><div class="small muted" style="margin-top:5px">${h(item.website || 'Company investigation')} · ${date(item.created_at)}</div></div>${statusPill(item.status)}</a>`).join('') : `<div class="card empty"><div class="serif" style="font-size:23px">Your first investigation starts here</div><p class="muted">Build an evidence-backed view of a company with Sherlock Capital’s research team.</p></div>`}</div><a class="btn launch" href="/app/?new=1">＋ &nbsp; Launch investigation</a></section>`, 'INVESTMENT INTELLIGENCE');
}

function statusPill(status) {
  const active = ['queued', 'investigating'].includes(status);
  const label = status === 'investigating' ? 'Investigating' : status === 'queued' ? 'Queued' : status === 'completed' ? 'Completed' : 'Review required';
  return `<span class="pill ${status === 'completed' ? 'gray' : status === 'review' ? 'red' : 'gold'}">${active ? '<span class="spinner tiny"></span>' : ''}${label}</span>`;
}

function boardPanel(item) {
  const activity = item.board_activity || [];
  const roles = ['detective', 'bull', 'bear', 'judge'];
  const steps = Object.fromEntries(roles.map(role => [role, {}]));
  let topic = '';
  for (const event of activity) {
    if (event.topic) topic = event.topic;
    if (!steps[event.role]) continue;
    if (event.action === 'registered') steps[event.role].registered = true;
    if (event.action === 'subscribed') steps[event.role].subscribed = true;
    if (event.action === 'read') steps[event.role].read = event.refs || [];
    if (event.action === 'posted') steps[event.role].posted = event.ref || true;
  }
  const connected = activity.some(event => event.action === 'registered');
  const content = activity.length
    ? `<div class="board-roles">${roles.map(role => {
      const state = steps[role];
      const labels = [];
      if (state.registered) labels.push('<span class="board-step done">Registered</span>');
      if (state.subscribed) labels.push('<span class="board-step done">On case topic</span>');
      if (state.read) labels.push(`<span class="board-step">${state.read.length ? `Read ${state.read.length} ${state.read.length === 1 ? 'handoff' : 'handoffs'}` : 'No earlier handoffs'}</span>`);
      if (state.posted) labels.push(`<span class="board-step posted">Posted ${typeof state.posted === 'string' ? h(state.posted) : 'finding'}</span>`);
      return `<article class="board-role"><div class="board-role-name">${h(role)}</div><div class="board-steps">${labels.join('') || '<span class="small muted">Waiting for role activity</span>'}</div></article>`;
    }).join('')}</div>`
    : `<div class="notice loading-inline">${['queued', 'investigating'].includes(item.status) ? '<span class="spinner"></span><span>Connecting to OpenCrawl and registering the research team…</span>' : '<span>No OpenCrawl activity was saved for this investigation.</span>'}</div>`;
  return `<section class="board-panel"><div class="board-head"><div><div class="eyebrow">Shared research handoffs</div><h2>OpenCrawl board</h2><div class="small muted">${topic ? `Case topic · <code>${h(topic)}</code>` : 'Role registration, findings, and handoffs'}</div></div><span class="pill ${connected ? 'green' : 'gray'}">${connected ? '<span class="live-dot"></span>Connected' : 'Waiting'}</span></div>${content}</section>`;
}

function newForm() {
  frame(`<section class="section"><a class="small muted" href="/app/">← Back to investigations</a><div class="eyebrow" style="margin-top:30px">Step 01 · Identify the target</div><h1>New investigation</h1>
    <form id="create"><div class="formgrid"><label class="field">Company name<input name="name" placeholder="Acme AI" required></label><label class="field">Company website<input name="website" type="url" placeholder="https://acme.ai"></label></div>
    <div class="section"><h2>Documents</h2><p class="muted">Share company materials so claims can be checked against source documents.</p><div class="list">${[['pitch','Pitch deck','PDF · up to 25 MB','.pdf'],['financials','Financial statements','PDF or Excel · up to 25 MB','.pdf,.xlsx,.xls,.csv'],['vendors','Vendor contacts','Excel or CSV','.xlsx,.xls,.csv']].map(([id,title,hint,accept]) => `<label class="upload" id="wrap-${id}"><input name="files" type="file" data-kind="${id}" accept="${accept}"><span class="uploadicon">＋</span><span class="uptext"><b>${title}</b><span class="small muted filename" style="display:block;margin-top:4px">${hint}</span></span><span class="action">Browse</span></label>`).join('')}</div></div>
    <div class="section"><h2>Verified revenue</h2><p class="muted">Optional read-only payment data check.</p><div class="card row"><div><b>Stripe account</b><div id="stripe-label" class="small muted" style="margin-top:4px">Not connected · demo only</div></div><button type="button" id="stripe" class="btn ghost">Connect Stripe</button></div></div>
    <div class="section"><h2>Investigation intensity</h2><div class="choicegrid">${[['quick','Quick scan','2 minutes'],['deep','Deep investigation','10 minutes'],['forensic','Forensic investigation','20+ minutes']].map(([value,title,mins]) => `<label class="choice ${value === 'deep' ? 'active' : ''}"><input type="radio" name="level" value="${value}" ${value === 'deep' ? 'checked' : ''} hidden><b>${title}</b><span class="small muted">${mins}</span></label>`).join('')}</div></div>
    <div class="section"><h2>Objectives</h2><div class="checklist">${objectives.map((objective,index) => `<label class="checkrow"><input type="checkbox" name="objective" value="${h(objective)}" ${index < 3 ? 'checked' : ''}>${h(objective)}</label>`).join('')}</div></div>
    <div class="section"><button class="btn" type="submit" style="width:100%">Launch investigation →</button><div id="form-error" class="error" style="margin-top:12px"></div></div></form></section>`, 'NEW INVESTIGATION');
  document.querySelectorAll('.choice').forEach(choice => choice.onclick = () => { document.querySelectorAll('.choice').forEach(node => node.classList.remove('active')); choice.classList.add('active'); });
  document.querySelectorAll('input[type=file]').forEach(input => input.onchange = () => { const file=input.files[0],wrap=document.querySelector('#wrap-'+input.dataset.kind); if(file){wrap.classList.add('hasfile');wrap.querySelector('.filename').textContent=file.name;wrap.querySelector('.action').textContent='Replace';} });
  let stripe=false; document.querySelector('#stripe').onclick=()=>{stripe=!stripe;document.querySelector('#stripe-label').textContent=stripe?'Demo connected · no payment data accessed':'Not connected · demo only';document.querySelector('#stripe').textContent=stripe?'Disconnect':'Connect Stripe';};
  document.querySelector('#create').onsubmit=async event=>{event.preventDefault();const form=event.currentTarget,button=form.querySelector('[type=submit]'),body=new FormData(form);body.delete('objective');body.set('objectives',JSON.stringify([...form.querySelectorAll('[name=objective]:checked')].map(input=>input.value)));button.disabled=true;button.innerHTML='<span class="spinner"></span> Starting your investigation…';try{const item=await api('',{method:'POST',body});location.href='/app/?id='+item.id;}catch(error){button.disabled=false;button.textContent='Launch investigation →';document.querySelector('#form-error').textContent=error.message;}};
}

function detail(item) {
  const roles=['DETECTIVE','BULL','BEAR','JUDGE'];
  const completed=new Set((item.feed||[]).map(entry=>entry.agent).filter(Boolean));
  const activeRole=item.status==='investigating'?roles.find(role=>!completed.has(role)):null;
  const progress=item.status==='completed'?100:Math.round((completed.size/roles.length)*100);
  const team=[['DETECTIVE','Finding hidden connections'],['BULL','Building the investment case'],['BEAR','Testing the downside'],['JUDGE','Weighing the evidence']];
  frame(`<section class="section"><a class="small muted" href="/app/">← Back to investigations</a><div class="eyebrow" style="margin-top:28px">Investigation ${h(item.id)}</div><div class="row case-title"><div><h1>${h(item.name)}</h1><div class="muted">${h(item.website||'Company research')}</div></div>${statusPill(item.status)}</div>
    <div class="section"><div class="row"><b>Investigation progress</b><b class="serif">${progress}%</b></div><div class="progress" style="margin-top:10px"><div style="width:${progress}%"></div></div>${item.status==='investigating'?'<div class="small muted" style="margin-top:9px"><span class="spinner tiny"></span> Research is running; this page updates automatically.</div>':''}</div>
    <div class="section"><h2>Intelligence team</h2><div class="list">${team.map(([agent,task])=>{const done=item.status==='completed'||completed.has(agent),working=agent===activeRole;return `<div class="teamrow ${working?'working':''}"><span class="avatar">${agent==='BEAR'?'−':agent==='DETECTIVE'?'⌕':agent==='BULL'?'✦':'✓'}</span><div class="teamcopy"><div class="teamname">THE ${agent}</div><div class="small muted">${task}</div></div><span class="pill ${done?'green':working?'gold':'gray'}">${done?'Completed':working?'<span class="spinner tiny"></span>Working':'Queued'}</span></div>`;}).join('')}</div></div>
    ${boardPanel(item)}
    <div class="section"><div class="row"><h2>Live intelligence feed</h2><a class="small" style="color:var(--green)" href="/app/?id=${h(item.id)}&evidence=1">Evidence room →</a></div>${item.feed?.length?`<div class="feed">${item.feed.map(entry=>`<article class="feeditem"><span class="agenttag">${h(entry.agent)}</span><div class="markdown feed-markdown">${markdown(entry.text)}</div></article>`).join('')}</div>`:`<div class="notice loading-inline"><span class="spinner"></span><span>Preparing the research team and searching for the first evidence…</span></div>`}</div>
    <div class="section"><div class="row"><h2>Documents</h2><span class="small muted">${item.files?.length||0} attached</span></div>${item.files?.map(file=>`<div class="evidence doc-row"><span class="doc-icon">PDF</span><div><b>${h(file.name)}</b><div class="small muted">${(file.size/1024).toFixed(0)} KB · Source document</div></div></div>`).join('')||'<div class="notice">No documents attached.</div>'}</div>
    ${item.result?`<div class="section"><div class="verdict-heading"><div class="eyebrow">Final assessment</div><h2>Judge’s verdict</h2></div><article class="card markdown verdict">${markdown(item.result)}</article></div>`:''}
    ${item.status==='review'?'<div class="notice error-panel"><b>Review required</b><p>One or more roles could not finish. Check the feed for details.</p></div>':''}</section>`, 'INVESTIGATION DETAIL');
  if(['investigating','queued'].includes(item.status)) setTimeout(async()=>{try{detail(await api('/'+encodeURIComponent(item.id)));}catch{}},5000);
}

function evidence(item) {
  frame(`<section class="section"><a class="small muted" href="/app/?id=${h(item.id)}">← Back to ${h(item.name)}</a><div class="eyebrow" style="margin-top:28px">Case evidence</div><h1>Evidence room</h1><div class="section"><h2>Company documents</h2>${item.files?.map(file=>`<div class="evidence"><div class="row"><h3>${h(file.name)}</h3><span class="pill green">Uploaded source</span></div><p class="muted">${(file.size/1024).toFixed(0)} KB · Original uploaded document</p></div>`).join('')||'<div class="notice">No uploaded documents.</div>'}</div><div class="section"><h2>Agent findings</h2>${item.feed?.map(entry=>`<article class="evidence markdown"><div class="row"><h3>${h(entry.agent)} finding</h3><span class="pill">Research note</span></div>${markdown(entry.text)}</article>`).join('')||'<div class="notice">Evidence will appear here as the agent team completes its work.</div>'}</div></section>`, 'EVIDENCE ROOM');
  if(['investigating','queued'].includes(item.status)) setTimeout(async()=>{try{evidence(await api('/'+encodeURIComponent(item.id)));}catch{}},5000);
}

(async()=>{const query=new URLSearchParams(location.search);if(query.has('new'))return newForm();if(query.has('id')){try{const item=await api('/'+encodeURIComponent(query.get('id')));return query.has('evidence')?evidence(item):detail(item);}catch{return dashboard();}}dashboard();})();
