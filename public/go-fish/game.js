/* Go Fish — single-player vs. computer opponents.
   Standard rules: ask for a rank you hold, collect books of four,
   most books when the 13th book is made (or the pond and hands run dry) wins. */
(function () {
  'use strict';

  var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  var SUITS = ['♠', '♥', '♦', '♣'];
  var RANK_NAMES = { A: 'Aces', J: 'Jacks', Q: 'Queens', K: 'Kings' };
  var RANK_SINGULAR = { A: 'an Ace', J: 'a Jack', Q: 'a Queen', K: 'a King', 8: 'an 8' };
  var BOT_POOL = [
    { name: 'Mia', avatar: '🧑‍🎤' },
    { name: 'Leo', avatar: '🧔' },
    { name: 'Zoe', avatar: '👩‍🎓' }
  ];
  var BOT_DELAY = 950;
  var STATS_KEY = 'gofish-stats';

  var $ = function (sel) { return document.querySelector(sel); };
  var el = {
    board: $('#gf-board'),
    setup: $('#gf-setup'),
    opponents: $('#gf-opponents'),
    stock: $('#gf-stock'),
    stockCount: $('#gf-stock-count'),
    bubble: $('#gf-bubble'),
    hand: $('#gf-hand'),
    books: $('#gf-books'),
    askBtn: $('#gf-ask'),
    hint: $('#gf-hint'),
    log: $('#gf-log'),
    overlay: $('#gf-overlay'),
    result: $('#gf-result'),
    record: $('#gf-record'),
    handCount: $('#gf-hand-count')
  };

  var G = null;          // game state
  var sel = { rank: null, target: null };
  var timer = null;

  /* ---------- helpers ---------- */
  function plural(rank) {
    return RANK_NAMES[rank] || rank + 's';
  }
  function quantity(n, rank) {
    return n === 1 ? (RANK_SINGULAR[rank] || 'a ' + rank) : n + ' ' + plural(rank);
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function countRank(hand, rank) {
    var n = 0;
    for (var i = 0; i < hand.length; i++) if (hand[i].rank === rank) n++;
    return n;
  }
  function ranksIn(hand) {
    var seen = {}, out = [];
    for (var i = 0; i < hand.length; i++) {
      if (!seen[hand[i].rank]) { seen[hand[i].rank] = true; out.push(hand[i].rank); }
    }
    return out;
  }
  function sortHand(hand) {
    hand.sort(function (a, b) {
      var d = RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);
      return d || SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
    });
  }
  function totalBooks() {
    var n = 0;
    for (var i = 0; i < G.players.length; i++) n += G.players[i].books.length;
    return n;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- stats (per-browser record) ---------- */
  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || { games: 0, wins: 0 }; }
    catch (e) { return { games: 0, wins: 0 }; }
  }
  function saveStats(s) {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) { /* private mode */ }
  }
  function renderRecord() {
    var s = loadStats();
    if (!el.record) return;
    el.record.textContent = s.games
      ? 'Your record on this device: ' + s.wins + ' win' + (s.wins === 1 ? '' : 's') + ' in ' + s.games + ' game' + (s.games === 1 ? '' : 's')
      : '';
  }

  /* ---------- public knowledge (what every player has seen) ---------- */
  // know[playerIndex][rank] = 'yes' | 'no' | undefined. Asks, hand-overs and
  // "go fish" replies are public, so the bots reason only from those.
  function knowSet(p, rank, v) { G.know[p][rank] = v; }
  function forgetNos(p, keepRank) {
    for (var r in G.know[p]) if (G.know[p][r] === 'no' && r !== keepRank) delete G.know[p][r];
  }

  /* ---------- game setup ---------- */
  function newGame(numPlayers, luckyFish) {
    if (timer) { clearTimeout(timer); timer = null; }
    var deck = [];
    for (var s = 0; s < 4; s++) for (var r = 0; r < 13; r++) deck.push({ rank: RANKS[r], suit: SUITS[s] });
    shuffle(deck);

    var players = [{ name: 'You', avatar: '😎', human: true, hand: [], books: [] }];
    for (var i = 0; i < numPlayers - 1; i++) {
      players.push({ name: BOT_POOL[i].name, avatar: BOT_POOL[i].avatar, human: false, hand: [], books: [] });
    }
    var perPlayer = numPlayers <= 3 ? 7 : 5;
    for (var c = 0; c < perPlayer; c++) for (var p = 0; p < players.length; p++) players[p].hand.push(deck.pop());

    G = {
      players: players,
      stock: deck,
      current: 0,
      luckyFish: luckyFish,
      know: players.map(function () { return {}; }),
      idle: 0,
      over: false,
      log: []
    };
    sel = { rank: null, target: numPlayers === 2 ? 1 : null };
    for (var q = 0; q < players.length; q++) { sortHand(players[q].hand); layDownBooks(q, true); }

    el.overlay.hidden = true;
    el.board.hidden = false;
    el.setup.hidden = true;
    el.log.innerHTML = '';
    say('Cards dealt: ' + perPlayer + ' each, ' + G.stock.length + ' in the pond. You go first — pick a rank from your hand.');
    logLine('New game: ' + numPlayers + ' players, ' + perPlayer + ' cards each.');
    render();
    startTurn();
  }

  /* ---------- turn engine ---------- */
  function startTurn() {
    if (G.over) return;
    if (checkGameOver()) return;
    var p = G.players[G.current];

    if (p.hand.length === 0) {
      if (G.stock.length) {
        var drawn = G.stock.pop();
        p.hand.push(drawn);
        knowSet(G.current, drawn.rank, undefined);
        logLine(p.name + (p.human ? ' have' : ' has') + ' no cards, so ' + (p.human ? 'you draw' : p.name + ' draws') + ' one from the pond.');
        if (p.human) say('Your hand was empty, so you drew a card. Now ask for it!');
        render();
      } else {
        logLine(p.name + ' ' + (p.human ? 'have' : 'has') + ' no cards and the pond is empty — turn skipped.');
        G.idle++;
        return nextPlayer();
      }
    }

    if (p.human) {
      if (G.players.length === 2) sel.target = 1;
      updateAskButton();
      render();
    } else {
      render();
      timer = setTimeout(botTurn, BOT_DELAY);
    }
  }

  function nextPlayer() {
    if (G.over) return;
    if (checkGameOver()) return;
    G.current = (G.current + 1) % G.players.length;
    sel.rank = null;
    if (G.players.length > 2) sel.target = null;
    startTurn();
  }

  function ask(askerIdx, targetIdx, rank) {
    var asker = G.players[askerIdx], target = G.players[targetIdx];
    knowSet(askerIdx, rank, 'yes');
    var line = (asker.human ? 'You ask ' : asker.name + ' asks ') + target.name + ': “Do you have any ' + plural(rank) + '?”';
    logLine(line);

    var got = [];
    for (var i = target.hand.length - 1; i >= 0; i--) {
      if (target.hand[i].rank === rank) got.unshift(target.hand.splice(i, 1)[0]);
    }

    if (got.length) {
      asker.hand = asker.hand.concat(got);
      sortHand(asker.hand);
      knowSet(targetIdx, rank, 'no');
      G.idle = 0;
      var handMsg = target.name + (target.human ? ' hand' : ' hands') + ' over ' + quantity(got.length, rank) + '.';
      logLine(handMsg);
      var made = layDownBooks(askerIdx);
      say((asker.human ? 'Yes! ' : '') + handMsg + (made ? ' ' + (asker.human ? 'You complete' : asker.name + ' completes') + ' a book of ' + plural(made) + '!' : '') + (asker.human ? ' Go again.' : ' ' + asker.name + ' goes again.'));
      render();
      if (checkGameOver()) return;
      if (asker.human) { sel.rank = null; if (G.players.length > 2) sel.target = null; startTurn(); }
      else timer = setTimeout(startTurn, BOT_DELAY);
      return;
    }

    // Go Fish
    knowSet(targetIdx, rank, 'no');
    logLine(target.name + ' say' + (target.human ? '' : 's') + ': “Go Fish!”');
    G.idle++;
    if (!G.stock.length) {
      say(target.name + ' say' + (target.human ? '' : 's') + ' “Go Fish!” — but the pond is empty. Next player.');
      render();
      if (asker.human) timer = setTimeout(nextPlayer, 700); else timer = setTimeout(nextPlayer, BOT_DELAY);
      return;
    }
    var drawn = G.stock.pop();
    asker.hand.push(drawn);
    sortHand(asker.hand);
    var lucky = G.luckyFish && drawn.rank === rank;
    if (lucky) {
      knowSet(askerIdx, rank, 'yes');
      forgetNos(askerIdx, null);
      G.idle = 0;
      logLine((asker.human ? 'You draw' : asker.name + ' draws') + ' the ' + drawn.rank + drawn.suit + ' — the rank ' + (asker.human ? 'you' : 'they') + ' asked for. Another turn!');
    } else {
      forgetNos(askerIdx, G.luckyFish ? rank : null);
      logLine((asker.human ? 'You draw' : asker.name + ' draws') + (asker.human ? ' the ' + drawn.rank + drawn.suit : ' a card') + ' from the pond.');
    }
    var made2 = layDownBooks(askerIdx);
    if (made2) logLine((asker.human ? 'You lay' : asker.name + ' lays') + ' down a book of ' + plural(made2) + '.');

    if (asker.human) {
      say('Go Fish! You drew the ' + drawn.rank + drawn.suit + '.' + (lucky ? ' Lucky — that is what you asked for, so you go again.' : made2 ? ' That completes a book of ' + plural(made2) + '!' : ''));
    } else {
      say(target.name + (target.human ? ' say' : ' says') + ' “Go Fish!” ' + asker.name + ' draws a card.' + (lucky ? ' Lucky draw — ' + asker.name + ' goes again.' : ''));
    }
    render();
    if (checkGameOver()) return;
    if (lucky) {
      if (asker.human) { sel.rank = null; if (G.players.length > 2) sel.target = null; startTurn(); }
      else timer = setTimeout(startTurn, BOT_DELAY);
    } else {
      timer = setTimeout(nextPlayer, asker.human ? 900 : BOT_DELAY);
    }
  }

  function layDownBooks(pIdx, silent) {
    var p = G.players[pIdx], made = null;
    var ranks = ranksIn(p.hand);
    for (var i = 0; i < ranks.length; i++) {
      if (countRank(p.hand, ranks[i]) === 4) {
        p.hand = p.hand.filter(function (c) { return c.rank !== ranks[i]; });
        p.books.push(ranks[i]);
        knowSet(pIdx, ranks[i], 'no');
        made = ranks[i];
        G.idle = 0;
        if (silent) logLine(p.name + (p.human ? ' were' : ' was') + ' dealt a book of ' + plural(ranks[i]) + '.');
      }
    }
    return made;
  }

  function checkGameOver() {
    if (G.over) return true;
    var cardsInHands = 0;
    for (var i = 0; i < G.players.length; i++) cardsInHands += G.players[i].hand.length;
    var done = totalBooks() === 13 || (!G.stock.length && cardsInHands === 0) || (!G.stock.length && G.idle >= G.players.length * 3);
    if (!done) return false;
    G.over = true;
    if (timer) { clearTimeout(timer); timer = null; }

    var best = 0;
    for (var j = 0; j < G.players.length; j++) if (G.players[j].books.length > best) best = G.players[j].books.length;
    var winners = G.players.filter(function (p) { return p.books.length === best; });
    var youWin = winners.length === 1 && winners[0].human;
    var tie = winners.length > 1;

    var stats = loadStats();
    stats.games++;
    if (youWin) stats.wins++;
    saveStats(stats);

    var title = youWin ? 'You win!' : tie ? 'It’s a tie!' : winners[0].name + ' wins';
    var rows = G.players.slice().sort(function (a, b) { return b.books.length - a.books.length; }).map(function (p) {
      return '<li><span>' + p.avatar + ' ' + escapeHtml(p.name) + '</span><strong>' + p.books.length + ' book' + (p.books.length === 1 ? '' : 's') + '</strong></li>';
    }).join('');
    el.result.innerHTML = '<h3>' + title + '</h3><ol class="gf-scores">' + rows + '</ol>';
    el.overlay.hidden = false;
    logLine('Game over — ' + title);
    say('Game over. ' + title);
    renderRecord();
    render();
    return true;
  }

  /* ---------- computer opponent ---------- */
  function botTurn() {
    if (G.over) return;
    var me = G.current, bot = G.players[me];
    var best = null, bestScore = -Infinity;
    var ranks = ranksIn(bot.hand);
    for (var r = 0; r < ranks.length; r++) {
      var rank = ranks[r], have = countRank(bot.hand, rank);
      for (var t = 0; t < G.players.length; t++) {
        if (t === me) continue;
        var k = G.know[t][rank];
        var score = have + (k === 'yes' ? 10 : k === 'no' ? -50 : 0) + Math.random();
        if (!G.players[t].hand.length) score -= 60;
        // With three of a kind, the last card is either in the pond or with the
        // one player who has not said no yet: worth a gamble.
        if (have === 3) score += 2;
        if (score > bestScore) { bestScore = score; best = { target: t, rank: rank }; }
      }
    }
    if (!best) { G.idle++; return nextPlayer(); }
    ask(me, best.target, best.rank);
  }

  /* ---------- rendering ---------- */
  function cardHtml(c, opts) {
    var red = c.suit === '♥' || c.suit === '♦';
    var cls = 'gf-card' + (red ? ' red' : '') + (opts && opts.selected ? ' selected' : '');
    return '<button type="button" class="' + cls + '" data-rank="' + c.rank + '" aria-pressed="' + (opts && opts.selected ? 'true' : 'false') + '" aria-label="' + c.rank + ' of ' + suitName(c.suit) + '"><span class="gf-card-corner">' + c.rank + '<br>' + c.suit + '</span><span class="gf-card-pip">' + c.suit + '</span></button>';
  }
  function suitName(s) {
    return { '♠': 'spades', '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs' }[s];
  }
  function booksHtml(books) {
    if (!books.length) return '<span class="gf-nobooks">No books yet</span>';
    return books.map(function (r) { return '<span class="gf-book" title="Book of ' + plural(r) + '">' + r + '<small>×4</small></span>'; }).join('');
  }

  function render() {
    if (!G) return;
    var you = G.players[0];
    var humanTurn = !G.over && G.current === 0;

    // opponents
    var html = '';
    for (var i = 1; i < G.players.length; i++) {
      var p = G.players[i];
      var backs = '';
      for (var b = 0; b < Math.min(p.hand.length, 9); b++) backs += '<span class="gf-back"></span>';
      var cls = 'gf-opp' + (G.current === i && !G.over ? ' active' : '') + (sel.target === i && humanTurn ? ' target' : '') + (!p.hand.length ? ' empty' : '');
      html += '<button type="button" class="' + cls + '" data-idx="' + i + '" ' + (humanTurn && G.players.length > 2 ? '' : 'tabindex="-1"') + ' aria-pressed="' + (sel.target === i ? 'true' : 'false') + '" aria-label="Ask ' + escapeHtml(p.name) + '">' +
        '<span class="gf-opp-head"><span class="gf-avatar">' + p.avatar + '</span><span class="gf-opp-name">' + escapeHtml(p.name) + '</span><span class="gf-opp-count">' + p.hand.length + ' card' + (p.hand.length === 1 ? '' : 's') + '</span></span>' +
        '<span class="gf-backs">' + backs + '</span>' +
        '<span class="gf-opp-books">' + booksHtml(p.books) + '</span></button>';
    }
    el.opponents.innerHTML = html;
    el.opponents.classList.toggle('choose', humanTurn && G.players.length > 2 && !sel.target);

    // stock
    el.stockCount.textContent = G.stock.length;
    el.stock.classList.toggle('empty', !G.stock.length);

    // hand
    var handHtml = '';
    for (var h = 0; h < you.hand.length; h++) handHtml += cardHtml(you.hand[h], { selected: sel.rank === you.hand[h].rank });
    el.hand.innerHTML = handHtml || '<p class="gf-empty-hand">Your hand is empty.</p>';
    el.hand.classList.toggle('disabled', !humanTurn);
    el.books.innerHTML = booksHtml(you.books);
    el.handCount.textContent = you.hand.length + ' card' + (you.hand.length === 1 ? '' : 's');
    updateAskButton();
  }

  function updateAskButton() {
    if (!G) return;
    var humanTurn = !G.over && G.current === 0;
    var ready = humanTurn && sel.rank && sel.target !== null && sel.target !== undefined;
    el.askBtn.disabled = !ready;
    if (!humanTurn) {
      el.askBtn.textContent = G.over ? 'Game over' : G.players[G.current].name + ' is thinking…';
      el.hint.textContent = '';
    } else if (!sel.rank) {
      el.askBtn.textContent = 'Ask for a rank';
      el.hint.textContent = 'Tap a card in your hand to choose which rank to ask for.';
    } else if (sel.target === null || sel.target === undefined) {
      el.askBtn.textContent = 'Ask for ' + plural(sel.rank);
      el.hint.textContent = 'Now tap the player you want to ask.';
    } else {
      el.askBtn.textContent = 'Ask ' + G.players[sel.target].name + ' for ' + plural(sel.rank);
      el.hint.textContent = '';
    }
  }

  function say(text) {
    el.bubble.textContent = text;
  }
  function logLine(text) {
    G.log.push(text);
    var li = document.createElement('li');
    li.textContent = text;
    el.log.appendChild(li);
    while (el.log.children.length > 60) el.log.removeChild(el.log.firstChild);
    el.log.scrollTop = el.log.scrollHeight;
  }

  /* ---------- events ---------- */
  el.hand.addEventListener('click', function (e) {
    var card = e.target.closest('.gf-card');
    if (!card || !G || G.over || G.current !== 0) return;
    sel.rank = sel.rank === card.dataset.rank ? null : card.dataset.rank;
    render();
  });
  el.opponents.addEventListener('click', function (e) {
    var opp = e.target.closest('.gf-opp');
    if (!opp || !G || G.over || G.current !== 0 || G.players.length === 2) return;
    var idx = Number(opp.dataset.idx);
    sel.target = sel.target === idx ? null : idx;
    render();
  });
  el.askBtn.addEventListener('click', function () {
    if (!G || G.over || G.current !== 0 || !sel.rank || sel.target === null || sel.target === undefined) return;
    var rank = sel.rank, target = sel.target;
    sel.rank = null;
    ask(0, target, rank);
  });
  el.setup.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = Number(el.setup.querySelector('input[name="players"]:checked').value);
    var lucky = el.setup.querySelector('input[name="lucky"]').checked;
    newGame(n, lucky);
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-gf="restart"]')) {
      if (timer) { clearTimeout(timer); timer = null; }
      G = null;
      el.overlay.hidden = true;
      el.board.hidden = true;
      el.setup.hidden = false;
      el.setup.querySelector('button[type="submit"]').focus();
    }
    if (e.target.closest('[data-gf="again"]')) {
      var n = G ? G.players.length : 2, lucky = G ? G.luckyFish : true;
      newGame(n, lucky);
    }
  });

  renderRecord();
})();
