const BIBLE_API = 'https://api.midvash.com/v1';
const QURAN_API = 'https://api.alquran.cloud/v1';
const RESEARCH_DATA = './data/research.json';

const bibleBooks = [
  ['Genèse','genesis',50,'Ancien Testament'],['Exode','exodus',40,'Ancien Testament'],['Lévitique','leviticus',27,'Ancien Testament'],['Nombres','numbers',36,'Ancien Testament'],['Deutéronome','deuteronomy',34,'Ancien Testament'],['Josué','joshua',24,'Ancien Testament'],['Juges','judges',21,'Ancien Testament'],['Ruth','ruth',4,'Ancien Testament'],['1 Samuel','1-samuel',31,'Ancien Testament'],['2 Samuel','2-samuel',24,'Ancien Testament'],['1 Rois','1-kings',22,'Ancien Testament'],['2 Rois','2-kings',25,'Ancien Testament'],['1 Chroniques','1-chronicles',29,'Ancien Testament'],['2 Chroniques','2-chronicles',36,'Ancien Testament'],['Esdras','ezra',10,'Ancien Testament'],['Néhémie','nehemiah',13,'Ancien Testament'],['Esther','esther',10,'Ancien Testament'],['Job','job',42,'Ancien Testament'],['Psaumes','psalms',150,'Ancien Testament'],['Proverbes','proverbs',31,'Ancien Testament'],['Ecclésiaste','ecclesiastes',12,'Ancien Testament'],['Cantique des cantiques','song-of-solomon',8,'Ancien Testament'],['Ésaïe','isaiah',66,'Ancien Testament'],['Jérémie','jeremiah',52,'Ancien Testament'],['Lamentations','lamentations',5,'Ancien Testament'],['Ézéchiel','ezekiel',48,'Ancien Testament'],['Daniel','daniel',12,'Ancien Testament'],['Osée','hosea',14,'Ancien Testament'],['Joël','joel',3,'Ancien Testament'],['Amos','amos',9,'Ancien Testament'],['Abdias','obadiah',1,'Ancien Testament'],['Jonas','jonah',4,'Ancien Testament'],['Michée','micah',7,'Ancien Testament'],['Nahum','nahum',3,'Ancien Testament'],['Habacuc','habakkuk',3,'Ancien Testament'],['Sophonie','zephaniah',3,'Ancien Testament'],['Aggée','haggai',2,'Ancien Testament'],['Zacharie','zechariah',14,'Ancien Testament'],['Malachie','malachi',4,'Ancien Testament'],
  ['Matthieu','matthew',28,'Nouveau Testament'],['Marc','mark',16,'Nouveau Testament'],['Luc','luke',24,'Nouveau Testament'],['Jean','john',21,'Nouveau Testament'],['Actes','acts',28,'Nouveau Testament'],['Romains','romans',16,'Nouveau Testament'],['1 Corinthiens','1-corinthians',16,'Nouveau Testament'],['2 Corinthiens','2-corinthians',13,'Nouveau Testament'],['Galates','galatians',6,'Nouveau Testament'],['Éphésiens','ephesians',6,'Nouveau Testament'],['Philippiens','philippians',4,'Nouveau Testament'],['Colossiens','colossians',4,'Nouveau Testament'],['1 Thessaloniciens','1-thessalonians',5,'Nouveau Testament'],['2 Thessaloniciens','2-thessalonians',3,'Nouveau Testament'],['1 Timothée','1-timothy',6,'Nouveau Testament'],['2 Timothée','2-timothy',4,'Nouveau Testament'],['Tite','titus',3,'Nouveau Testament'],['Philémon','philemon',1,'Nouveau Testament'],['Hébreux','hebrews',13,'Nouveau Testament'],['Jacques','james',5,'Nouveau Testament'],['1 Pierre','1-peter',5,'Nouveau Testament'],['2 Pierre','2-peter',3,'Nouveau Testament'],['1 Jean','1-john',5,'Nouveau Testament'],['2 Jean','2-john',1,'Nouveau Testament'],['3 Jean','3-john',1,'Nouveau Testament'],['Jude','jude',1,'Nouveau Testament'],['Apocalypse','revelation',22,'Nouveau Testament']
];

const surahs = ['Al-Fatiha','Al-Baqara','Al-Imran','An-Nisa','Al-Maida','Al-Anam','Al-Araf','Al-Anfal','At-Tawba','Yunus','Hud','Yusuf','Ar-Rad','Ibrahim','Al-Hijr','An-Nahl','Al-Isra','Al-Kahf','Maryam','Ta-Ha','Al-Anbiya','Al-Hajj','Al-Muminun','An-Nur','Al-Furqan','Ash-Shuara','An-Naml','Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajda','Al-Ahzab','Saba','Fatir','Ya-Sin','As-Saffat','Sad','Az-Zumar','Ghafir','Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiya','Al-Ahqaf','Muhammad','Al-Fath','Al-Hujurat','Qaf','Adh-Dhariyat','At-Tur','An-Najm','Al-Qamar','Ar-Rahman','Al-Waqia','Al-Hadid','Al-Mujadila','Al-Hashr','Al-Mumtahana','As-Saff','Al-Jumua','Al-Munafiqun','At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqa','Al-Maarij','Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyama','Al-Insan','Al-Mursalat','An-Naba','An-Naziat','Abasa','At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj','At-Tariq','Al-Ala','Al-Ghashiya','Al-Fajr','Al-Balad','Ash-Shams','Al-Layl','Ad-Duha','Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyina','Az-Zalzala','Al-Adiyat','Al-Qaria','At-Takathur','Al-Asr','Al-Humaza','Al-Fil','Quraysh','Al-Maun','Al-Kawthar','Al-Kafirun','An-Nasr','Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas'];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const normalize = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const getBook = slug => bibleBooks.find(b => b[1] === slug);

const state = {
  view: 'home', source: 'bible', book: 'john', chapter: 3, surah: 61,
  quranEdition: 'fr.hamidullah', font: 19, selected: null,
  currentVerses: [], currentRef: 'Jean 3', research: {dossiers:[], sources:[]}
};
let frenchEditionsLoaded = false;
let readerRequestId = 0;

async function init(){
  bibleBooks.forEach(b => $('#bibleBook').add(new Option(`${b[0]} · ${b[3] === 'Ancien Testament' ? 'AT' : 'NT'}`, b[1])));
  surahs.forEach((s,i) => $('#quranSurah').add(new Option(`${String(i+1).padStart(3,'0')} · ${s}`, i+1)));
  restorePreferences();
  $('#bibleBook').value = state.book; buildChapters(); $('#bibleChapter').value = state.chapter; $('#quranSurah').value = state.surah;
  bind(); renderBookmarks(); routeFromHash();
  await Promise.allSettled([loadResearch(), loadReader(), runCompare()]);
  if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('./sw.js').catch(()=>{});
}

function restorePreferences(){
  state.font = Math.max(16, Math.min(25, +(localStorage.getItem('ts-font') || 19)));
  document.documentElement.style.setProperty('--reader-size', `${state.font}px`);
  const theme = localStorage.getItem('ts-theme'); if(theme) document.documentElement.dataset.theme = theme;
  const edition = localStorage.getItem('ts-quran-edition'); if(edition) state.quranEdition = edition;
}

function bind(){
  $$('.nav-btn').forEach(b => b.addEventListener('click', () => switchView(b.dataset.view)));
  $$('[data-route]').forEach(b => b.addEventListener('click', e => {e.preventDefault(); switchView(b.dataset.route)}));
  $$('[data-home-action]').forEach(b => b.addEventListener('click', () => homeAction(b.dataset.homeAction)));
  $$('[data-compare-preset]').forEach(b => b.addEventListener('click', () => applyComparePreset(b.dataset.comparePreset)));
  $('#bibleTab').addEventListener('click', () => switchSource('bible'));
  $('#quranTab').addEventListener('click', async () => {await loadFrenchEditions(); switchSource('quran')});
  $('#bibleBook').addEventListener('change', () => {state.book=$('#bibleBook').value; state.chapter=1; buildChapters(); loadReader(true)});
  $('#bibleChapter').addEventListener('change', () => {state.chapter=+$('#bibleChapter').value; loadReader(true)});
  $('#quranSurah').addEventListener('change', () => {state.surah=+$('#quranSurah').value; loadReader(true)});
  $('#quranEdition').addEventListener('change', () => {state.quranEdition=$('#quranEdition').value; localStorage.setItem('ts-quran-edition',state.quranEdition); loadReader(true)});
  $('#fontMinus').addEventListener('click', () => setFont(-1)); $('#fontPlus').addEventListener('click', () => setFont(1));
  $('#prevChapter').addEventListener('click', () => changeChapter(-1)); $('#nextChapter').addEventListener('click', () => changeChapter(1));
  $('#copyChapter').addEventListener('click', copyChapter); $('#copySelection').addEventListener('click', copySelection);
  $('#compareSelection').addEventListener('click', sendSelectionToCompare); $('#bookmarkSelection').addEventListener('click', toggleBookmark);
  $('#personalNote').addEventListener('input', debounce(saveNote,250));
  $$('[data-jump]').forEach(b => b.addEventListener('click', () => jump(b.dataset.jump)));
  $('#runCompare').addEventListener('click', runCompare); $('#swapCompare').addEventListener('click', swapCompare);
  ['#compareAInput','#compareBInput'].forEach(sel => $(sel).addEventListener('keydown', e => {if(e.key==='Enter') runCompare()}));
  $('#openCommand').addEventListener('click', openCommand); $('#commandInput').addEventListener('keydown', e => {if(e.key==='Enter'){e.preventDefault();openReferenceFromCommand()}});
  $('#themeToggle').addEventListener('click', toggleTheme); $('#librarySearch').addEventListener('input', filterLibrary);
  window.addEventListener('hashchange', routeFromHash);
  window.addEventListener('keydown', e => {if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}if(e.key==='Escape'&&$('#commandDialog').open)$('#commandDialog').close()});
}

function switchView(view, updateHash=true){
  if(!document.getElementById(view)) view='home'; state.view=view;
  $$('.view').forEach(v => v.classList.toggle('active-view', v.id===view));
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view===view));
  if(updateHash && location.hash !== `#${view}`) history.replaceState(null,'',`#${view}`);
  window.scrollTo({top:0,behavior:'instant'});
}
function routeFromHash(){const view=(location.hash||'#home').slice(1); switchView(view,false)}
function homeAction(action){if(action==='bible'){switchView('reader');switchSource('bible')}else if(action==='quran'){switchView('reader');loadFrenchEditions().finally(()=>switchSource('quran'))}else if(action==='isaiah42'){switchView('dossiers');setTimeout(()=>openDossier('isaiah42'),50)}}
function applyComparePreset(spec){const [a,b]=spec.split('|');$('#compareAInput').value=a;$('#compareBInput').value=b;switchView('compare');runCompare()}

function buildChapters(){const b=getBook(state.book);$('#bibleChapter').innerHTML='';for(let i=1;i<=b[2];i++)$('#bibleChapter').add(new Option(`Chapitre ${i}`,i));$('#bibleChapter').value=state.chapter}
function switchSource(source){state.source=source;state.selected=null;$('#bibleTab').classList.toggle('active',source==='bible');$('#quranTab').classList.toggle('active',source==='quran');$('#bibleTab').setAttribute('aria-selected',source==='bible');$('#quranTab').setAttribute('aria-selected',source==='quran');$('#bibleControls').classList.toggle('hidden',source!=='bible');$('#quranControls').classList.toggle('hidden',source!=='quran');loadReader()}
function setFont(delta){state.font=Math.max(16,Math.min(25,state.font+delta));document.documentElement.style.setProperty('--reader-size',`${state.font}px`);localStorage.setItem('ts-font',state.font)}
function toggleTheme(){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('ts-theme',next)}
function changeChapter(delta){if(state.source==='bible'){const book=getBook(state.book);const idx=bibleBooks.indexOf(book);let next=state.chapter+delta;if(next<1){if(idx===0)return;state.book=bibleBooks[idx-1][1];state.chapter=bibleBooks[idx-1][2];$('#bibleBook').value=state.book;buildChapters()}else if(next>book[2]){if(idx===bibleBooks.length-1)return;state.book=bibleBooks[idx+1][1];state.chapter=1;$('#bibleBook').value=state.book;buildChapters()}else{state.chapter=next;$('#bibleChapter').value=next}}else{let next=state.surah+delta;if(next<1||next>114)return;state.surah=next;$('#quranSurah').value=next}loadReader(true)}

async function loadReader(scroll=false){
  const requestId=++readerRequestId; state.selected=null; resetStudy(); $('#readerBody').innerHTML=spinner();
  try{
    if(state.source==='bible'){
      const book=getBook(state.book); const data=await fetchBible(state.book,state.chapter); if(requestId!==readerRequestId)return;
      state.currentVerses=data.verses; state.currentRef=`${book[0]} ${state.chapter}`;
      $('#readerKicker').textContent='BIBLE · LOUIS SEGOND 1910'; $('#readerHeading').textContent=state.currentRef; $('#readerMeta').textContent=book[3];
      $('#readerCredit').textContent=data.credit || 'Louis Segond 1910 · via Midvash';
      $('#readerBody').innerHTML=data.verses.map(v=>`<span class="verse" data-v="${v.n}" tabindex="0"><sup class="verse-number">${v.n}</sup>${escapeHtml(v.text)} </span>`).join('');
      $('#contextBox').innerHTML='<div><b>Corpus</b>Bible · Louis Segond 1910</div><div><b>Statut</b>Version signalée domaine public par la source.</div><div><b>Données</b>Midvash API · lecture en ligne.</div>';
    }else{
      const data=await fetchQuran(state.surah,state.quranEdition); if(requestId!==readerRequestId)return;
      state.currentVerses=data.verses; state.currentRef=`Coran ${state.surah}`;
      $('#readerKicker').textContent='CORAN · ARABE UTHMANI + TRADUCTION'; $('#readerHeading').textContent=`${state.surah}. ${surahs[state.surah-1]}`; $('#readerMeta').textContent=data.revelationType || 'Sourate';
      $('#readerCredit').textContent=`Arabe : ${data.arabicName||'Uthmani'} · Français : ${data.translationName||state.quranEdition} · via Al Quran Cloud`;
      $('#readerBody').innerHTML=data.verses.map(v=>`<div class="quran-verse" data-v="${v.n}" tabindex="0"><div class="arabic">${escapeHtml(v.ar)} <sup class="verse-number">${v.n}</sup></div><div class="translation"><sup class="verse-number">${v.n}</sup>${escapeHtml(v.fr)}</div></div>`).join('');
      $('#contextBox').innerHTML=`<div><b>Corpus</b>Coran · arabe Uthmani</div><div><b>Traduction affichée</b>${escapeHtml(data.translationName||state.quranEdition)}</div><div><b>Important</b>Une traduction est une interprétation linguistique ; le nom du traducteur est conservé.</div>`;
    }
    $$('#readerBody [data-v]').forEach(el=>{el.addEventListener('click',()=>selectVerse(+el.dataset.v));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectVerse(+el.dataset.v)}})});
    if(scroll) window.scrollTo({top:0,behavior:'smooth'});
  }catch(err){if(requestId===readerRequestId)$('#readerBody').innerHTML=errorBox(err)}
}
function resetStudy(){$('#selectedBadge').textContent='Chapitre';$('#studyCard').innerHTML='<p class="study-placeholder">Clique sur un verset pour l’isoler, le copier, le comparer ou lui associer une note.</p>';['#copySelection','#compareSelection','#bookmarkSelection'].forEach(s=>$(s).disabled=true);$('#personalNote').value=''}
function selectVerse(n){state.selected=n;$$('#readerBody [data-v]').forEach(el=>el.classList.toggle('selected',+el.dataset.v===n));const v=state.currentVerses.find(v=>v.n===n);if(!v)return;const ref=selectionRef();$('#selectedBadge').textContent=`v. ${n}`;$('#studyCard').innerHTML=`<h3 class="study-ref-title">${escapeHtml(ref)}</h3><p class="study-text">${escapeHtml(state.source==='bible'?v.text:v.fr)}</p>${state.source==='quran'?`<p class="arabic" style="font-size:22px">${escapeHtml(v.ar)}</p>`:''}<p class="study-source">${state.source==='bible'?'Louis Segond 1910':'Traduction : '+escapeHtml($('#quranEdition option:checked')?.textContent||state.quranEdition)}</p>`;['#copySelection','#compareSelection','#bookmarkSelection'].forEach(s=>$(s).disabled=false);updateBookmarkButton();loadNote()}

async function fetchBible(book,chapter){
  const res=await fetch(`${BIBLE_API}/lsg/${book}/${chapter}`); if(!res.ok)throw new Error(`Bible API : erreur ${res.status}`); const j=await res.json(); const d=j.data||j;
  let verses=[];
  if(Array.isArray(d.verses)) verses=d.verses.map((v,i)=>typeof v==='string'?{n:i+1,text:v}:{n:+(v.verse||v.number||v.verse_number||i+1),text:v.text||v.content||''});
  else if(Array.isArray(d)) verses=d.map((v,i)=>({n:+(v.verse||v.number||i+1),text:v.text||String(v)}));
  else if(typeof d.text==='string') verses=parseChapterText(d.text);
  if(!verses.length)throw new Error('Le format du chapitre reçu est inattendu.');
  return {verses,credit:j.meta?.copyright||j.meta?.license||'Louis Segond 1910 · via Midvash'};
}
function parseChapterText(text){const lines=text.split(/\n+/).map(x=>x.trim()).filter(Boolean);if(lines.length>1)return lines.map((t,i)=>{const m=t.match(/^(\d+)[.\s]+(.+)$/);return m?{n:+m[1],text:m[2]}:{n:i+1,text:t}});return [{n:1,text:text.trim()}]}
async function fetchQuran(surah,edition){
  const candidates=[edition,'fr.hamidullah','fr.montada'].filter((v,i,a)=>v&&a.indexOf(v)===i); let j=null,chosen=edition;
  for(const ed of candidates){const res=await fetch(`${QURAN_API}/surah/${surah}/editions/quran-uthmani,${encodeURIComponent(ed)}`);if(res.ok){j=await res.json();chosen=ed;break}}
  if(!j)throw new Error('Aucune traduction française disponible via la source.');
  const arr=j.data||[]; const ar=arr.find(x=>x.edition?.language==='ar')||arr[0]; const fr=arr.find(x=>x.edition?.language==='fr')||arr[1]; if(!ar?.ayahs)throw new Error('Édition coranique indisponible.');
  return {verses:ar.ayahs.map((a,i)=>({n:a.numberInSurah,ar:a.text,fr:fr?.ayahs?.[i]?.text||'—'})),arabicName:ar.edition?.name||ar.edition?.englishName,translationName:fr?.edition?.name||fr?.edition?.englishName||chosen,revelationType:ar.surah?.revelationType||''};
}
async function loadFrenchEditions(){if(frenchEditionsLoaded)return;frenchEditionsLoaded=true;try{const r=await fetch(`${QURAN_API}/edition/language/fr`);if(!r.ok)return;const j=await r.json();const editions=(j.data||[]).filter(e=>e.format==='text'&&(e.type==='translation'||!e.type));if(!editions.length)return;const sel=$('#quranEdition');sel.innerHTML='';editions.forEach(e=>sel.add(new Option(e.name||e.englishName||e.identifier,e.identifier)));if(editions.some(e=>e.identifier===state.quranEdition))sel.value=state.quranEdition;else{state.quranEdition=editions[0].identifier;sel.value=state.quranEdition}}catch{}}

function jump(spec){const p=spec.split('|');switchView('reader');if(p[0]==='bible'){state.book=p[1];state.chapter=+p[2];$('#bibleBook').value=state.book;buildChapters();$('#bibleChapter').value=state.chapter;switchSource('bible')}else{state.surah=+p[1];$('#quranSurah').value=state.surah;loadFrenchEditions().finally(()=>switchSource('quran'))}}

function parseReference(raw){
  const original=raw.trim(); const s=normalize(original); let m=s.match(/(?:coran|quran|sourate)\s*(\d{1,3})(?:\s+(\d+)(?:\s+(\d+))?)?$/);
  if(m){const surah=+m[1];if(surah<1||surah>114)throw new Error('Sourate hors limites.');return{type:'quran',surah,from:m[2]?+m[2]:null,to:m[3]?+m[3]:(m[2]?+m[2]:null),display:original}}
  const rm=original.match(/^(.*?)(?:\s+)(\d+)(?::(\d+)(?:-(\d+))?)?\s*$/); if(!rm)throw new Error(`Référence non reconnue : « ${original} »`);
  const name=normalize(rm[1]),chapter=+rm[2],from=rm[3]?+rm[3]:null,to=rm[4]?+rm[4]:(from?from:null);
  const aliases={es:'isaiah',esaie:'isaiah',is:'isaiah',mi:'micah',michee:'micah',mt:'matthew',mat:'matthew',matthieu:'matthew',mc:'mark',marc:'mark',lc:'luke',luc:'luke',jn:'john',jean:'john',dt:'deuteronomy',deuteronome:'deuteronomy',ps:'psalms',psaume:'psalms',psaumes:'psalms',jeremie:'jeremiah',jrm:'jeremiah',cantique:'song-of-solomon','cantique des cantiques':'song-of-solomon'};
  const key=name.replace(/\s+/g,' '); let b=bibleBooks.find(x=>normalize(x[0])===key||normalize(x[1])===key); if(!b&&aliases[key])b=getBook(aliases[key]); if(!b)throw new Error(`Livre non reconnu dans « ${original} »`); if(chapter<1||chapter>b[2])throw new Error('Chapitre hors limites.'); return{type:'bible',book:b[1],chapter,from,to,display:original};
}
async function renderReference(raw,el){
  try{const r=parseReference(raw);if(r.type==='quran'){const d=await fetchQuran(r.surah,state.quranEdition);const verses=clipVerses(d.verses,r.from,r.to);el.innerHTML=`<h3>Coran ${r.surah}${r.from?`:${r.from}${r.to!==r.from?'-'+r.to:''}`:''}</h3><div class="scripture-body">${verses.map(v=>`<div class="quran-verse"><div class="arabic">${escapeHtml(v.ar)} <sup class="verse-number">${v.n}</sup></div><div class="translation"><sup class="verse-number">${v.n}</sup>${escapeHtml(v.fr)}</div></div>`).join('')}</div><div class="compare-credit">${escapeHtml(d.translationName||state.quranEdition)} · Al Quran Cloud</div>`}
    else{const b=getBook(r.book),d=await fetchBible(r.book,r.chapter),verses=clipVerses(d.verses,r.from,r.to);el.innerHTML=`<h3>${b[0]} ${r.chapter}${r.from?`:${r.from}${r.to!==r.from?'-'+r.to:''}`:''}</h3><div class="scripture-body">${verses.map(v=>`<span class="verse"><sup class="verse-number">${v.n}</sup>${escapeHtml(v.text)} </span>`).join('')}</div><div class="compare-credit">${escapeHtml(d.credit||'Louis Segond 1910')}</div>`}}
  catch(err){el.innerHTML=errorBox(err)}
}
function clipVerses(vs,from,to){if(!from)return vs;return vs.filter(v=>v.n>=from&&v.n<=(to||from))}
async function runCompare(){$('#compareA').innerHTML=spinner();$('#compareB').innerHTML=spinner();await Promise.all([renderReference($('#compareAInput').value,$('#compareA')),renderReference($('#compareBInput').value,$('#compareB'))])}
function swapCompare(){const a=$('#compareAInput').value;$('#compareAInput').value=$('#compareBInput').value;$('#compareBInput').value=a;runCompare()}

function openCommand(){$('#commandDialog').showModal();setTimeout(()=>{$('#commandInput').focus();$('#commandInput').select()},30)}
function openReferenceFromCommand(){const raw=$('#commandInput').value.trim();if(!raw)return;try{const r=parseReference(raw);$('#commandDialog').close();switchView('reader');if(r.type==='quran'){state.surah=r.surah;$('#quranSurah').value=r.surah;loadFrenchEditions().finally(()=>switchSource('quran'))}else{state.book=r.book;state.chapter=r.chapter;$('#bibleBook').value=r.book;buildChapters();$('#bibleChapter').value=r.chapter;switchSource('bible')}if(r.from)setTimeout(()=>selectVerse(r.from),650)}catch(err){showToast(err.message)}}

function selectionRef(){if(!state.selected)return null;return state.source==='bible'?`${state.currentRef}:${state.selected}`:`Coran ${state.surah}:${state.selected}`}
function selectionText(){const v=state.currentVerses.find(v=>v.n===state.selected);if(!v)return'';return state.source==='bible'?v.text:`${v.fr}\n${v.ar}`}
async function writeClipboard(text){try{await navigator.clipboard.writeText(text);return true}catch{return false}}
async function copySelection(){if(!state.selected)return;showToast(await writeClipboard(`${selectionRef()} — ${selectionText()}`)?'Verset copié':'Copie non disponible')}
async function copyChapter(){const text=state.source==='bible'?state.currentVerses.map(v=>`${v.n} ${v.text}`).join('\n'):state.currentVerses.map(v=>`${v.n} ${v.ar}\n${v.fr}`).join('\n\n');showToast(await writeClipboard(`${state.currentRef}\n\n${text}`)?'Chapitre copié':'Copie non disponible')}
function sendSelectionToCompare(){const ref=selectionRef();if(!ref)return;$('#compareAInput').value=ref;switchView('compare');runCompare()}

function bookmarks(){try{return JSON.parse(localStorage.getItem('ts-bookmarks')||'[]')}catch{return[]}}
function bookmarkKey(){return selectionRef()}
function toggleBookmark(){const key=bookmarkKey();if(!key)return;let list=bookmarks();const exists=list.some(x=>x.ref===key);if(exists)list=list.filter(x=>x.ref!==key);else list.unshift({ref:key,source:state.source,book:state.book,chapter:state.chapter,surah:state.surah,verse:state.selected});localStorage.setItem('ts-bookmarks',JSON.stringify(list.slice(0,30)));renderBookmarks();updateBookmarkButton();showToast(exists?'Marque-page retiré':'Passage enregistré')}
function updateBookmarkButton(){if(!state.selected)return;const exists=bookmarks().some(x=>x.ref===bookmarkKey());$('#bookmarkSelection').textContent=exists?'★ Enregistré':'☆ Enregistrer'}
function renderBookmarks(){const list=bookmarks();$('#bookmarkCount').textContent=list.length;const box=$('#bookmarkList');if(!list.length){box.innerHTML='<p class="empty-small">Aucun passage enregistré.</p>';return}box.innerHTML=list.slice(0,8).map((b,i)=>`<button class="bookmark-item" data-i="${i}">${escapeHtml(b.ref)}</button>`).join('');$$('.bookmark-item').forEach(btn=>btn.addEventListener('click',()=>openBookmark(list[+btn.dataset.i])))}
function openBookmark(b){switchView('reader');if(b.source==='quran'){state.surah=b.surah;$('#quranSurah').value=b.surah;loadFrenchEditions().finally(()=>switchSource('quran'))}else{state.book=b.book;state.chapter=b.chapter;$('#bibleBook').value=b.book;buildChapters();$('#bibleChapter').value=b.chapter;switchSource('bible')}setTimeout(()=>selectVerse(b.verse),650)}
function noteKey(){return `ts-note:${state.selected?selectionRef():state.currentRef}`}
function saveNote(){localStorage.setItem(noteKey(),$('#personalNote').value)}
function loadNote(){$('#personalNote').value=localStorage.getItem(noteKey())||''}

async function loadResearch(){
  try{const r=await fetch(RESEARCH_DATA);if(!r.ok)throw new Error('Données de recherche indisponibles');state.research=await r.json();renderDossiers();renderLibrary()}catch(err){$('#dossierGrid').innerHTML=errorBox(err);$('#libraryGrid').innerHTML=errorBox(err)}
}
function renderDossiers(){
  const host=$('#dossierGrid');host.innerHTML=state.research.dossiers.map((d,i)=>`<article class="dossier-card ${d.status==='live'?'live-card':''}" ${d.status==='live'?`data-dossier-id="${escapeHtml(d.id)}"`:''}><div class="dossier-top"><span class="status ${d.status}">${d.status==='live'?'Documenté':'Prévu'}</span><span>${escapeHtml(d.readingTime||'')}</span></div><p class="dossier-number">DOSSIER ${String(i+1).padStart(3,'0')}</p><h3>${escapeHtml(d.title)}</h3><p>${escapeHtml(d.summary)}</p>${d.status==='live'?'<button class="text-btn">Ouvrir le dossier →</button>':''}</article>`).join('');
  $$('[data-dossier-id]').forEach(card=>card.addEventListener('click',()=>openDossier(card.dataset.dossierId)));
}
function openDossier(id){const d=state.research.dossiers.find(x=>x.id===id&&x.status==='live');if(!d)return;const sourceMap=Object.fromEntries(state.research.sources.map(s=>[s.id,s]));const host=$('#dossierDetailHost');host.innerHTML=`<article class="dossier-detail"><div class="detail-head"><div><span class="eyebrow">DOSSIER DOCUMENTÉ · ${escapeHtml(d.version||'')}</span><h2>${escapeHtml(d.questionTitle||d.title)}</h2></div><button id="closeDossier" class="icon-btn" aria-label="Fermer le dossier">×</button></div><div class="claim-banner"><span>QUESTION</span><p>${escapeHtml(d.question)}</p><strong>${escapeHtml(d.shortAnswer)}</strong></div><div class="evidence-grid">${d.evidence.map(e=>`<section class="evidence-card"><span class="evidence-type">${escapeHtml(e.type)}</span><h3>${escapeHtml(e.title)}</h3><p>${e.html?sanitizeTrustedMarkup(e.html):escapeHtml(e.text)}</p>${e.reference?`<button class="study-ref" data-ref="${escapeHtml(e.reference)}">Lire / comparer →</button>`:''}${e.sourceId&&sourceMap[e.sourceId]?`<a class="source-inline" href="${escapeHtml(sourceMap[e.sourceId].url)}" target="_blank" rel="noopener noreferrer">Source →</a>`:''}<span class="certainty ${escapeHtml((e.grade||'d').toLowerCase())}">Niveau ${escapeHtml(e.grade||'D')} · ${escapeHtml(e.certainty||'')}</span></section>`).join('')}</div><div class="perspectives"><h3>Donnée et interprétations</h3>${d.perspectives.map(p=>`<div class="perspective-row"><span class="perspective-label ${escapeHtml(p.kind)}">${escapeHtml(p.label)}</span><p>${escapeHtml(p.text)}</p></div>`).join('')}</div><div class="source-list"><h3>Sources utilisées dans ce dossier</h3>${d.sourceIds.map((sid,i)=>{const s=sourceMap[sid];if(!s)return'';return`<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer"><span>${String(i+1).padStart(2,'0')}</span><div><b>${escapeHtml(s.title)}</b><small>${escapeHtml(s.description)}</small></div><i>↗</i></a>`}).join('')}</div></article>`;
  $('#closeDossier').addEventListener('click',()=>host.innerHTML='');$$('.study-ref').forEach(b=>b.addEventListener('click',()=>{const ref=b.dataset.ref;$('#compareAInput').value=ref;switchView('compare');runCompare()}));setTimeout(()=>host.scrollIntoView({behavior:'smooth',block:'start'}),20);
}
function renderLibrary(){const host=$('#libraryGrid');host.innerHTML=state.research.sources.map(s=>`<article class="library-card" data-tags="${escapeHtml((s.tags||[]).join(' '))}"><div class="library-card-top"><span class="library-icon">${escapeHtml(s.icon||'⌘')}</span><span class="library-kind">${escapeHtml(s.kind)}</span></div><p class="mini-title">${escapeHtml(s.category)}</p><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">Ouvrir la source ↗</a></article>`).join('')}
function filterLibrary(){const q=normalize($('#librarySearch').value);$$('#libraryGrid .library-card').forEach(a=>a.classList.toggle('filtered',q&&!normalize(a.textContent+' '+(a.dataset.tags||'')).includes(q)))}

function spinner(){return'<div class="loading"><span></span><span></span><span></span></div>'}
function errorBox(err){return`<div class="error-box"><b>Impossible de charger ce contenu.</b>${escapeHtml(err?.message||String(err))}<br><small>Le lecteur dépend de sources externes et nécessite une connexion internet.</small></div>`}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),1800)}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function sanitizeTrustedMarkup(s){return String(s||'').replace(/<(?!\/?(?:b|i|em|strong)\b)[^>]*>/gi,'').replace(/on\w+\s*=/gi,'')}
function debounce(fn,ms){let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms)}}

init();
