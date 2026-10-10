(()=>{'use strict';
const $=id=>document.getElementById(id);
// Game names and text commands: starter selection; expand after checking against the live game.
const emotes=[['手を振る','/wave'],['お辞儀する','/bow'],['拍手する','/clap'],['座る','/sit'],['踊る','/dance'],['笑う','/laugh'],['うなずく','/yes'],['首を横に振る','/no'],['喜ぶ','/joy'],['応援する','/cheer'],['指さす','/point'],['泣く','/cry'],['驚く','/surprised'],['敬礼する','/salute'],['考える','/think']];
let state=[],past=[],future=[];const clone=x=>JSON.parse(JSON.stringify(x));
function save(){try{localStorage.setItem('shioan-builder-v03',JSON.stringify(state))}catch(e){}}
try{const v=JSON.parse(localStorage.getItem('shioan-builder-v03')||'[]');if(Array.isArray(v))state=v.filter(x=>x&&typeof x.cmd==='string').slice(0,15)}catch(e){}
function commit(next){past.push(clone(state));if(past.length>60)past.shift();future=[];state=next;save();render()}
function result(){return state.map((x,i)=>x.cmd+(i<state.length-1&&x.wait?` <wait.${x.wait}>`:'' )).join('\n')}
function render(){ $('makePreview').value=result();$('makeCount').textContent=`${state.length} / 15行`; $('makeUndo').disabled=!past.length;$('makeRedo').disabled=!future.length;$('makeAdd').disabled=state.length>=15;
const area=$('makeRows');area.replaceChildren();state.forEach((x,i)=>{const row=document.createElement('div');row.className='line';const n=document.createElement('span');n.className='num';n.textContent=i+1;const c=document.createElement('code');c.textContent=x.cmd+(i<state.length-1&&x.wait?` <wait.${x.wait}>`:'');row.append(n,c);
const btn=(label,fn,disabled)=>{const b=document.createElement('button');b.className='small secondary';b.textContent=label;b.disabled=!!disabled;b.onclick=fn;row.append(b)};
btn('編集',()=>{const edited=prompt('この行を編集',x.cmd);if(edited===null)return;const cmd=edited.trim().replace(/[\r\n]+/g,' ');if(!cmd)return;const next=clone(state);next[i].cmd=cmd;commit(next)});
btn('↑',()=>{const next=clone(state);[next[i-1],next[i]]=[next[i],next[i-1]];commit(next)},i===0);
btn('↓',()=>{const next=clone(state);[next[i+1],next[i]]=[next[i],next[i+1]];commit(next)},i===state.length-1);
btn('×',()=>commit(state.filter((_,j)=>i!==j)));area.append(row)});
}
function updateType(){$('makeChat').classList.toggle('hidden',$('makeType').value!=='chat');$('makeEmote').classList.toggle('hidden',$('makeType').value!=='emote')}
function updateWait(){$('makeWaitRow').classList.toggle('hidden',!['y','sh'].includes($('channel').value))}
function updateEmotes(){const q=$('emoteSearch').value.toLowerCase().trim();const sel=$('makeEmoteSelect');sel.replaceChildren();emotes.filter(x=>x.join(' ').toLowerCase().includes(q)).forEach(([name,cmd])=>{const o=document.createElement('option');o.value=cmd;o.textContent=`${name}　／　${cmd}`;sel.append(o)})}
$('makeType').onchange=updateType;$('channel').onchange=updateWait;$('emoteSearch').oninput=updateEmotes;
$('makeAdd').onclick=()=>{if(state.length>=15)return;let cmd='',wait='';if($('makeType').value==='chat'){const text=$('makeText').value.trim().replace(/[\r\n]+/g,' ');if(!text){alert('セリフを入力してね');return}const ch=$('channel').value;cmd=`/${ch} ${text}`;if(['y','sh'].includes(ch))wait=$('makeWait').value;}else{cmd=$('makeEmoteSelect').value;if(!cmd){alert('エモートを選んでね');return}}commit([...state,{cmd,wait}]);if($('makeType').value==='chat')$('makeText').value='';$('makeText').focus()};
$('makeUndo').onclick=()=>{if(!past.length)return;future.push(clone(state));state=past.pop();save();render()};$('makeRedo').onclick=()=>{if(!future.length)return;past.push(clone(state));state=future.pop();save();render()};
$('makeClear').onclick=()=>{if(state.length&&confirm('作成中のマクロをすべて消去する？'))commit([])};
$('makeImport').onclick=()=>{if(!state.length){alert('まず1行追加してね');return}setSource(result())};
$('makeCopy').onclick=()=>{if(!state.length)return;copy(result())};
updateType();updateWait();updateEmotes();render();
})();
