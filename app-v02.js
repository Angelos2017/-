(function(){
const $=id=>document.getElementById(id);
const themeButton=$('theme');
function theme(t){document.documentElement.dataset.theme=t;themeButton.textContent=t==='dark'?'☀️ ライトモード':'🌙 ダークモード';themeButton.setAttribute('aria-label',themeButton.textContent);try{localStorage.setItem('shioan-macro-theme',t)}catch(e){}}
let saved='light';try{saved=localStorage.getItem('shioan-macro-theme')||'light'}catch(e){}theme(saved);
themeButton.onclick=()=>theme(document.documentElement.dataset.theme==='dark'?'light':'dark');
let commands=[];
function render(){const q=$('search').value.toLowerCase().trim(),cat=$('category').value;const list=commands.filter(x=>(!cat||x.category===cat)&&[x.name,x.command,x.description,x.example].join(' ').toLowerCase().includes(q));$('dictcount').textContent=`${list.length}件表示 / 全${commands.length}件`;
const area=$('dictionary');area.replaceChildren();if(!list.length){const p=document.createElement('p');p.className='muted';p.textContent='該当するコマンドは見つからなかったよ';area.append(p);return;}
list.forEach(x=>{const div=document.createElement('div');div.className='entry';const title=document.createElement('strong');title.textContent=x.name+'  '+x.command;const badge=document.createElement('span');badge.className='pill';badge.textContent=x.category;const p=document.createElement('p');p.textContent=x.description;const c=document.createElement('code');c.textContent=x.example;div.append(title,badge,p,c);
if(x.deprecated||x.complex){const caution=document.createElement('p');caution.className='muted';caution.textContent=x.deprecated?'⚠ 現在は利用できない旧コマンド':'⚠ 引数や実行条件は公式の説明を確認してね';div.append(caution)}
const row=document.createElement('div');row.className='row';const b=document.createElement('button');b.className='small';b.textContent='取り込み画面へ';b.onclick=()=>setSource(x.example);const a=document.createElement('a');a.href=x.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent='公式一覧を見る ↗';a.className='muted';row.append(b,a);div.append(row);area.append(div)});
}
$('search').addEventListener('input',render);$('category').addEventListener('change',render);
fetch('./commands.json').then(r=>{if(!r.ok)throw Error('読み込み失敗');return r.json()}).then(data=>{commands=data;const cats=[...new Set(data.map(x=>x.category))];cats.forEach(c=>{const opt=document.createElement('option');opt.value=c;opt.textContent=c;$('category').append(opt)});render()}).catch(()=>{$('dictcount').textContent='辞書を読み込めなかったよ　GitHub Pagesかローカルサーバーで開いてね';});
})();