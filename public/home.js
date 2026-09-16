/* Website JS */
function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
}
function toggleFaq(btn) {
  const item = btn.parentElement;
  item.classList.toggle('open');
}

/* Game: rules database */
const RULES = {
  classic: {
    'A':     { badge:'WATERFALL',       name:'Waterfall',          desc:'Everyone starts drinking. The drawer stops first, then clockwise each person can stop.' },
    '2':     { badge:'YOU',             name:'You',                desc:'Point at anyone — they drink.' },
    '3':     { badge:'ME',              name:'Me',                 desc:'You drink!' },
    '4':     { badge:'FLOOR',           name:'Floor',              desc:'Last person to touch the floor drinks.' },
    '5':     { badge:'GUYS',            name:'Guys',               desc:'All guys drink.' },
    '6':     { badge:'GIRLS',           name:'Girls',              desc:'All girls drink.' },
    '7':     { badge:'HEAVEN',          name:'Heaven',             desc:'Last to raise their hand drinks.' },
    '8':     { badge:'MATE',            name:'Mate',               desc:'Pick a drinking buddy. When you drink, they drink — and vice versa.' },
    '9':     { badge:'RHYME',           name:'Bust a Rhyme',       desc:'Say a word. Go clockwise rhyming it. First to fail or repeat drinks.' },
    '10':    { badge:'CATEGORIES',      name:'Categories',         desc:'Name a category. Go clockwise naming items in it. First to fail drinks.' },
    'J':     { badge:'NEVER EVER',      name:'Never Have I Ever',  desc:'Say something you\'ve never done. Everyone who HAS done it drinks.' },
    'Q':     { badge:'Q MASTER',        name:'Question Master',    desc:'You are Question Master until the next Queen. If someone answers your question, they drink.' },
    'K':     { badge:"KING'S CUP",      name:"King's Cup",         desc:'Pour some of your drink into the King\'s Cup. The 4th King drawn must drink the whole cup!' },
    'Joker': { badge:'WILD CARD',       name:'Wild Card',          desc:'Make up any rule. Everyone must follow it until the next Joker is drawn.' },
  },
  funny: {
    'A':     { badge:'ACCENT',          name:'Accent Attack',      desc:'Speak in a ridiculous accent until the next Ace. Break character? Drink.' },
    '2':     { badge:'WEIRD COMPLIMENT',name:'Weird Compliment',   desc:'Give someone the most bizarre compliment you can think of. If they laugh, they drink.' },
    '3':     { badge:'ANIMAL',          name:'Animal Time',        desc:'Act like an animal for 30 seconds. Group votes — most convincing picks who drinks.' },
    '4':     { badge:'FLOOR',           name:'Floor',              desc:'Last person to touch the floor drinks.' },
    '5':     { badge:'GUYS',            name:'Guys',               desc:'All guys drink.' },
    '6':     { badge:'GIRLS',           name:'Girls',              desc:'All girls drink.' },
    '7':     { badge:'HEAVEN',          name:'Heaven',             desc:'Last to raise their hand drinks.' },
    '8':     { badge:'ROBOT',           name:'Robot Mode',         desc:'Speak only like a robot until your next turn. Say anything human? Drink.' },
    '9':     { badge:'RHYME',           name:'Bust a Rhyme',       desc:'Say a word. Rhyme clockwise. First to fail drinks.' },
    '10':    { badge:'IMPRESSION',      name:'Impressions',        desc:'Best celebrity impression. Group votes — worst one drinks.' },
    'J':     { badge:'WYR',             name:'Would You Rather',   desc:'Pose a "Would You Rather" to the group. The minority drinks.' },
    'Q':     { badge:'MIME MASTER',     name:'Mime Master',        desc:'Communicate only through mime until the next Queen. Speak? Drink.' },
    'K':     { badge:"KING'S CUP",      name:"King's Cup",         desc:'Pour into the King\'s Cup. The 4th King must drink the whole cup!' },
    'Joker': { badge:'REVERSE!',        name:'Reverse Everything', desc:'All current special rules are cancelled. Pure chaos!' },
  },
  college: {
    'A':     { badge:'WATERFALL',       name:'Hard Waterfall',     desc:'Waterfall — count to 10 before the drawer can stop. Last one is a legend.' },
    '2':     { badge:'GIVE 2',          name:'Give 2',             desc:'Give 2 drinks to any player(s) of your choice.' },
    '3':     { badge:'TAKE 3',          name:'Take 3',             desc:'You drink 3. No excuses.' },
    '4':     { badge:'SOCIAL',          name:'Social',             desc:'Everyone drinks! Raise those glasses.' },
    '5':     { badge:'GUYS',            name:'Guys',               desc:'All guys drink.' },
    '6':     { badge:'GIRLS',           name:'Girls',              desc:'All girls drink.' },
    '7':     { badge:'HEAVEN',          name:'Heaven',             desc:'Last to raise their hand drinks.' },
    '8':     { badge:'MATE',            name:'Mate',               desc:'Pick a drinking buddy for the rest of the game.' },
    '9':     { badge:'RHYME',           name:'Bust a Rhyme',       desc:'Say a word, rhyme clockwise. Fail? Drink.' },
    '10':    { badge:'CATEGORIES',      name:'Categories',         desc:'Name a category. Go around — fail? Drink.' },
    'J':     { badge:'THUMB MASTER',    name:'Thumb Master',       desc:'Put thumb on table anytime. Last to notice drinks. Keep power until next Jack.' },
    'Q':     { badge:'Q MASTER',        name:'Question Master',    desc:'If they answer your question, they drink. Lasts until next Queen.' },
    'K':     { badge:"KING'S CUP",      name:"King's Cup",         desc:'Pour into the King\'s Cup. 4th King? Chug it all.' },
    'Joker': { badge:'MAKE A RULE',     name:'Make a Rule',        desc:'Create a rule for the rest of the game. Break it = drink.' },
  },
  couples: {
    'A':     { badge:'KISS OR DRINK',   name:'Kiss or Drink',      desc:'Kiss your partner — or take a drink. Your call!' },
    '2':     { badge:'COMPLIMENT',      name:'Sweet Words',        desc:'Give your partner a genuine compliment. Not good enough? You drink.' },
    '3':     { badge:'MEMORY',          name:'Memory Lane',        desc:'Share your favorite memory together. Sweetest one doesn\'t drink.' },
    '4':     { badge:'FLOOR',           name:'Floor',              desc:'Last to touch the floor drinks.' },
    '5':     { badge:'HIM',             name:'Him / Them',         desc:'All "him/them" partners drink.' },
    '6':     { badge:'HER',             name:'Her / Them',         desc:'All "her/them" partners drink.' },
    '7':     { badge:'HEAVEN',          name:'Heaven',             desc:'Last to raise their hand drinks.' },
    '8':     { badge:"COUPLE'S BET",    name:"Couple's Bet",       desc:'Your partner guesses your answer to a personal question. Wrong? They drink.' },
    '9':     { badge:'RHYME',           name:'Bust a Rhyme',       desc:'Say a word, rhyme clockwise. Fail? Drink.' },
    '10':    { badge:'THIS OR THAT',    name:'This or That',       desc:'Pose a preference question. Whoever changed their answer drinks.' },
    'J':     { badge:'DARE',            name:'Dare',               desc:'Dare your partner something cute or funny. Refuse? Drink double.' },
    'Q':     { badge:'STARE CONTEST',   name:'Stare Contest',      desc:'Stare into your partner\'s eyes. First to laugh or look away drinks.' },
    'K':     { badge:"KING'S CUP",      name:"King's Cup",         desc:'Pour into the King\'s Cup. The couple who draws the 4th King both drink it.' },
    'Joker': { badge:'SWAP DRINKS',     name:'Swap Drinks',        desc:'Everyone swaps their drink with their partner right now.' },
  },
  family: {
    'A':     { badge:'DANCE!',          name:'Dance Party',        desc:'Everyone must dance for 10 seconds. No sitting still!' },
    '2':     { badge:'KIND WORDS',      name:'Compliment',         desc:'Give someone at the table a genuine compliment. Make it good!' },
    '3':     { badge:'JOKE TIME',       name:'Joke Time',          desc:'Tell your best joke. If nobody laughs, do 5 jumping jacks.' },
    '4':     { badge:'FLOOR',           name:'Floor',              desc:'Last to touch the floor does 5 jumping jacks.' },
    '5':     { badge:'BOYS',            name:'Boys Challenge',     desc:'All boys do 3 push-ups (best attempt!).' },
    '6':     { badge:'GIRLS',           name:'Girls Challenge',    desc:'All girls do 5 jumping jacks.' },
    '7':     { badge:'HEAVEN',          name:'Heaven',             desc:'Last to raise their hand hops on one foot 3 times.' },
    '8':     { badge:'TEAM UP',         name:'Team Up',            desc:'Pick a buddy! You two do all tasks together until the next 8.' },
    '9':     { badge:'RHYME',           name:'Bust a Rhyme',       desc:'Say a word, rhyme clockwise. Fail? Do a silly dance move!' },
    '10':    { badge:'CATEGORIES',      name:'Categories',         desc:'Name a category. Go around — can\'t name one? Do 5 jumping jacks.' },
    'J':     { badge:'CONFESSION',      name:'True Confession',    desc:'Share something funny or embarrassing. Best story picks a dare for someone!' },
    'Q':     { badge:'Q MASTER',        name:'Question Master',    desc:'If they answer your question, they do 5 jumping jacks. Lasts until next Queen.' },
    'K':     { badge:"KING'S JAR",      name:"King's Jar",         desc:'Add a challenge token to the jar. The 4th King must complete a group dare!' },
    'Joker': { badge:'WILD!',           name:'Wild Challenge',     desc:'Make up a fun activity for the whole group. Be creative!' },
  },
};

const VERSIONS = [
  { id:'classic', icon:'🃏', name:'Classic',  desc:'The original Kings Cup rules everyone knows' },
  { id:'funny',   icon:'🤣', name:'Funny',    desc:'Silly twists and hilarious challenges' },
  { id:'college', icon:'🎓', name:'College',  desc:'More intense rules for experienced players' },
  { id:'couples', icon:'💑', name:'Couples',  desc:'Romantic rules for you and your partner' },
  { id:'family',  icon:'👨‍👩‍👧', name:'Family',  desc:'No drinks — fun challenges for all ages' },
];

const SUITS  = ['♠','♥','♦','♣'];
const VALUES = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RED    = ['♥','♦'];

/* Game state */
let G = {
  version:'classic', deck:[], kingsDrawn:0, animating:false, hasDrawn:false,
  players:['Player 1','Player 2','Player 3','Player 4'],
  currentPlayer:0,
  soundEnabled:true,
};

/* Overlay helpers */
const isSmallScreen = () => window.matchMedia('(max-width: 700px)').matches;

function enterFullscreen() {
  document.getElementById('game-overlay').classList.add('fullscreen');
  document.body.style.overflow = 'hidden';
}
function exitFullscreen() {
  document.getElementById('game-overlay').classList.remove('fullscreen');
  document.body.style.overflow = '';
}
function toggleFullscreen() {
  document.getElementById('game-overlay').classList.contains('fullscreen') ? exitFullscreen() : enterFullscreen();
}
/* Deep-page CTAs: jump to the stage (inline on desktop, fullscreen on phones) */
function openGame(screen, version) {
  if (version) { G.version = version; }
  gRenderVersions();
  gShowScreen(screen);
  if (isSmallScreen()) { enterFullscreen(); }
  else { document.getElementById('game-stage').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}
function closeGame() {
  exitFullscreen();
  stopTimer();
  // Inline (desktop) mode: the frame is already "closed", so move the reader on to the page content
  if (!isSmallScreen()) {
    let next = document.getElementById('game-stage').closest('section')?.nextElementSibling;
    while (next && !next.offsetHeight) next = next.nextElementSibling;   // skip the collapsed ad slot
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') exitFullscreen(); });

/* Game screens */
function gShowScreen(id) {
  document.querySelectorAll('.gscreen').forEach(s => s.classList.remove('active'));
  document.getElementById('gs-' + id).classList.add('active');
  document.getElementById('game-overlay').dataset.screen = id;
  if (id === 'players') renderPlayerSetup();
  // Phones: the inline frame is cramped once play starts, so go fullscreen (the old overlay UX)
  if (id !== 'home' && isSmallScreen()) enterFullscreen();
}

/* Players */
const AVATARS = ['🎩','🎭','👑','🃏','🎪','🦁','🐯','🦊','🐺','🦅'];

function renderPlayerSetup() {
  document.getElementById('g-players-list').innerHTML = G.players.map((name,i) => `
    <div class="player-row">
      <span class="player-avatar">${AVATARS[i % AVATARS.length]}</span>
      <input class="player-input" type="text" value="${esc(name)}" data-idx="${i}"
             oninput="G.players[this.dataset.idx]=this.value"
             placeholder="Player ${i+1}" autocomplete="off" autocorrect="off">
      ${G.players.length > 2
        ? `<button class="player-remove" onclick="removePlayer(${i})">✕</button>`
        : '<div class="player-spacer"></div>'}
    </div>`).join('');
}

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

function addPlayer() {
  if (G.players.length >= 10) { gToast('Max 10 players!'); return; }
  G.players.push('Player ' + (G.players.length + 1));
  renderPlayerSetup();
  const inputs = document.querySelectorAll('.player-input');
  if (inputs.length) inputs[inputs.length-1].focus();
}

function removePlayer(i) {
  if (G.players.length <= 2) return;
  G.players.splice(i, 1);
  renderPlayerSetup();
}

function updateTurnDisplay() {
  const name = String(G.players[G.currentPlayer] || '').trim() || 'Player ' + (G.currentPlayer+1);
  document.getElementById('g-turn').textContent = '👤 ' + name + '\'s turn';
}

function advanceTurn() {
  G.currentPlayer = (G.currentPlayer + 1) % G.players.length;
  updateTurnDisplay();
}

/* Sound (web audio api - no files) */
let _ctx = null;
function ac() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

function toggleSound() {
  G.soundEnabled = !G.soundEnabled;
  document.getElementById('sound-btn').textContent = G.soundEnabled ? '🔊' : '🔇';
  gToast(G.soundEnabled ? '🔊 Sound on' : '🔇 Sound off');
}

function snd_flip() {
  if (!G.soundEnabled) return;
  try {
    const ctx=ac(), len=Math.floor(ctx.sampleRate*.09);
    const buf=ctx.createBuffer(1,len,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,1.8);
    const src=ctx.createBufferSource(), f=ctx.createBiquadFilter(), g=ctx.createGain();
    f.type='bandpass'; f.frequency.value=1400; f.Q.value=0.7; g.gain.value=0.42;
    src.buffer=buf; src.connect(f); f.connect(g); g.connect(ctx.destination); src.start();
  } catch(e){}
}

function snd_king() {
  if (!G.soundEnabled) return;
  try {
    const ctx=ac();
    [523,659,784,1047].forEach((freq,i)=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type='sine'; o.frequency.value=freq;
      const t=ctx.currentTime+i*.13;
      g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.35,t+.07);
      g.gain.exponentialRampToValueAtTime(.0001,t+.5); o.start(t); o.stop(t+.55);
    });
  } catch(e){}
}

function snd_joker() {
  if (!G.soundEnabled) return;
  try {
    const ctx=ac(), o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination); o.type='sine';
    o.frequency.setValueAtTime(180,ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(900,ctx.currentTime+.3);
    o.frequency.exponentialRampToValueAtTime(320,ctx.currentTime+.65);
    g.gain.setValueAtTime(.28,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.7);
    o.start(ctx.currentTime); o.stop(ctx.currentTime+.72);
  } catch(e){}
}

function snd_start() {
  if (!G.soundEnabled) return;
  try {
    const ctx=ac();
    [262,330,392,523].forEach((freq,i)=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.type='sine'; o.frequency.value=freq;
      const t=ctx.currentTime+i*.09;
      g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.22,t+.05);
      g.gain.exponentialRampToValueAtTime(.0001,t+.3); o.start(t); o.stop(t+.35);
    });
  } catch(e){}
}

function snd_gameover() {
  if (!G.soundEnabled) return;
  try {
    const ctx=ac();
    [[523,0],[659,.15],[784,.3],[1047,.5],[784,.7],[1047,.95]].forEach(([fr,d])=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.type='sine'; o.frequency.value=fr;
      const t=ctx.currentTime+d;
      g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.28,t+.05);
      g.gain.exponentialRampToValueAtTime(.0001,t+.38); o.start(t); o.stop(t+.42);
    });
  } catch(e){}
}

function snd_timer_end() {
  if (!G.soundEnabled) return;
  try {
    const ctx=ac();
    [880,880,880,1320].forEach((freq,i)=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.type='square'; o.frequency.value=freq;
      const t=ctx.currentTime+i*.28;
      g.gain.setValueAtTime(.18,t); g.gain.setValueAtTime(0,t+.18);
      o.start(t); o.stop(t+.2);
    });
  } catch(e){}
}

/* Timer */
const CIRCUM = 2 * Math.PI * 42; // r=42 → ≈263.9
let T = { total:30, remaining:30, interval:null };

function openTimerSheet() {
  document.getElementById('timer-overlay').classList.add('open');
  document.querySelectorAll('.timer-preset').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.s) === T.total);
  });
}
function closeTimerSheet() { document.getElementById('timer-overlay').classList.remove('open'); }
function timerOverlayClick(e) { if(e.target===document.getElementById('timer-overlay')) closeTimerSheet(); }

function setTimerPreset(s) {
  T.total = s;
  document.querySelectorAll('.timer-preset').forEach(b => b.classList.toggle('active', parseInt(b.dataset.s)===s));
}

function startCountdown() {
  closeTimerSheet();
  clearInterval(T.interval);
  clearTimeout(T.alarmTimeout);
  T.remaining = T.total;
  _refreshTimerUI();
  const disp = document.getElementById('timer-display');
  disp.classList.remove('alarm'); disp.classList.add('active');
  T.interval = setInterval(()=>{
    T.remaining--;
    _refreshTimerUI();
    if (T.remaining <= 0) stopTimer(true);
  }, 1000);
}

function stopTimer(alarm) {
  clearInterval(T.interval); T.interval = null;
  const el = document.getElementById('timer-display');
  clearTimeout(T.alarmTimeout);
  if (alarm) {
    snd_timer_end();
    el.classList.add('alarm');
    T.alarmTimeout = setTimeout(()=> {
      el.classList.remove('alarm');
      if (!T.interval) el.classList.remove('active');   // keep a countdown that restarted meanwhile
    }, 2200);
  } else {
    el.classList.remove('active','alarm');
  }
}

function _refreshTimerUI() {
  const frac = Math.max(0, T.remaining / T.total);
  const offset = CIRCUM * (1 - frac);
  const color  = frac > .5 ? '#69f0ae' : frac > .25 ? '#FFD700' : '#ff4444';
  const circle = document.getElementById('timer-circle');
  circle.style.strokeDasharray  = CIRCUM;
  circle.style.strokeDashoffset = offset;
  circle.style.stroke = color;
  document.getElementById('timer-num').textContent = T.remaining;
  document.getElementById('timer-num').style.color = color;
}

/* Version select */
function gRenderVersions() {
  document.getElementById('g-vlist').innerHTML = VERSIONS.map(v => `
    <div class="g-vcard ${v.id===G.version?'sel':''}" onclick="gSelectVer('${v.id}')" data-id="${v.id}">
      <span class="g-vic">${v.icon}</span>
      <div class="g-vinfo"><div class="g-vname">${v.name}</div><div class="g-vdesc">${v.desc}</div></div>
      <span class="g-vcheck">✓</span>
    </div>`).join('');
}
function gSelectVer(id) {
  G.version = id;
  document.querySelectorAll('.g-vcard').forEach(c => c.classList.toggle('sel', c.dataset.id===id));
}

/* Deck */
function buildDeck() {
  const cards = SUITS.flatMap(s => VALUES.map(v => ({ s, v })));
  cards.push({ s:'🃏', v:'Joker' }, { s:'🃏', v:'Joker' });
  return shuffle(cards);
}
function shuffle(a) {
  const arr=[...a];
  for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
  return arr;
}

/* Game logic */
function startGame() {
  G.deck=buildDeck(); G.kingsDrawn=0; G.animating=false; G.hasDrawn=false; G.currentPlayer=0;
  const c=document.getElementById('gcard');
  c.style.transition='none'; c.classList.remove('flipped'); void c.offsetWidth;
  updateTurnDisplay(); refreshRem(); refreshKings();
  document.getElementById('draw-hint').textContent='Tap to draw the first card';
  document.getElementById('draw-btn').textContent='Draw Card 🃏';
  closeGMenu(); stopTimer(); snd_start();
  gShowScreen('main');
}

function drawCard() {
  if(G.animating) return;
  if(G.deck.length===0){ snd_gameover(); gShowScreen('over'); return; }
  G.animating=true;
  const c=document.getElementById('gcard');
  if(G.hasDrawn){
    c.style.transition='transform .18s ease-in';
    c.classList.remove('flipped');
    setTimeout(()=>revealCard(c),200);
  } else { revealCard(c); }
}

function revealCard(c) {
  const {s,v}=G.deck.pop(); G.hasDrawn=true;
  if(v==='K'){
    G.kingsDrawn++; refreshKings(); snd_king();
    gToast(G.kingsDrawn<4?`👑 King! ${4-G.kingsDrawn} more to fill the cup`:'👑 4th King! Drink the whole cup!');
  } else if(v==='Joker'){ snd_joker(); } else { snd_flip(); }
  paintCard(s,v); refreshRem();
  setTimeout(()=>{
    c.style.transition='transform .52s cubic-bezier(.4,.2,.2,1)';
    c.classList.add('flipped');
    setTimeout(()=>{
      G.animating=false;
      advanceTurn();
      const done=G.deck.length===0;
      document.getElementById('draw-btn').textContent=done?'See Results 🎉':'Draw Card 🃏';
      document.getElementById('draw-hint').textContent=
        done?'Last card drawn!': `${G.deck.length} card${G.deck.length===1?'':'s'} remaining`;
    },540);
  },40);
}

function paintCard(suit,value) {
  const rule=RULES[G.version][value]||RULES.classic[value];
  const isRed=RED.includes(suit), cls=isRed?'suit-red':'suit-blck', isJkr=value==='Joker';
  const dsVal=isJkr?'★':value, dsSut=isJkr?'':suit, bigSt=isJkr?'🃏':suit;
  ['cv-tl','cv-br'].forEach(id=>{const e=document.getElementById(id);e.textContent=dsVal;e.className='cv '+cls;});
  ['cs-tl','cs-br'].forEach(id=>{const e=document.getElementById(id);e.textContent=dsSut;e.className='cs '+cls;});
  const bs=document.getElementById('big-suit');
  bs.textContent=bigSt; bs.className='big-suit'+(isJkr?'':' '+cls);
  document.getElementById('rule-badge').textContent=rule?.badge||value;
  document.getElementById('rule-name').textContent=rule?.name||value;
  document.getElementById('rule-desc').textContent=rule?.desc||'';
}

function refreshRem() {
  const n=G.deck.length;
  document.getElementById('grem').textContent=`${n} card${n===1?'':'s'} left`;
}
function refreshKings() {
  for(let i=1;i<=4;i++){
    const e=document.getElementById('k'+i);
    e.classList.toggle('lit',i<=G.kingsDrawn);
  }
}

/* Game menu */
function openGMenu()  { document.getElementById('gmenu-overlay').classList.add('open'); }
function closeGMenu() { document.getElementById('gmenu-overlay').classList.remove('open'); }
function gmOverlayClick(e){ if(e.target===document.getElementById('gmenu-overlay')) closeGMenu(); }
function gmGo(s){ closeGMenu(); setTimeout(()=>gShowScreen(s),280); }

function reshuffleDeck() {
  closeGMenu();
  const c=document.getElementById('gcard');
  c.style.transition='transform .18s'; c.classList.remove('flipped');
  G.hasDrawn=false;
  setTimeout(()=>{
    G.deck=buildDeck(); G.kingsDrawn=0;
    refreshRem(); refreshKings();
    document.getElementById('draw-hint').textContent='Deck reshuffled — draw again!';
    document.getElementById('draw-btn').textContent='Draw Card 🃏';
    gToast('🔀 Deck reshuffled!');
  },220);
}

/* Toast */
function gToast(msg) {
  const el=document.getElementById('g-toast');
  el.textContent=msg; el.classList.add('show');
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),2600);
}

/* Init */
gRenderVersions();

/* Footer partner badges - scroll rail */
(function () {
  var rail = document.querySelector('.footer-partner-rail');
  if (!rail) return;
  var track = rail.querySelector('.footer-partner-badges');
  var btns  = rail.querySelectorAll('.footer-partner-nav');

  function sync() {
    var max = track.scrollWidth - track.clientWidth;
    rail.dataset.scrollable = max > 4 ? 'true' : 'false';
    btns[0].disabled = track.scrollLeft <= 2;
    btns[1].disabled = track.scrollLeft >= max - 2;
  }
  function step() { return Math.max(180, track.clientWidth * 0.8); }

  Array.prototype.forEach.call(btns, function (btn) {
    btn.addEventListener('click', function () {
      track.scrollBy({ left: step() * Number(btn.dataset.dir), behavior: 'smooth' });
    });
  });
  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  window.addEventListener('load', sync);
  Array.prototype.forEach.call(track.querySelectorAll('img'), function (img) {
    img.addEventListener('load', sync);
    img.addEventListener('error', sync);
  });
  sync();
})();
