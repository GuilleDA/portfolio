"use strict";

// ===== Configuración base =====
const MAX_MANA = 3;
const HAND_SIZE = 5;
const PLAYER_HP = 30;
const ENEMY_HP = 22;

const CARD_TYPES = {
  attack: { label: "Ataque", icon: "⚔" },
  defense: { label: "Defensa", icon: "🛡" },
  heal: { label: "Curación", icon: "✚" },
  aoe: { label: "Área", icon: "💥" },
};

const CLASSES = {
  warrior: {
    name: "Guerrero",
    starter: { type: "attack", name: "Furia", cost: 0, value: 4 },
  },
  mage: {
    name: "Mago",
    starter: { type: "aoe", name: "Chispa", cost: 0, value: 2 },
  },
  healer: {
    name: "Sanador",
    starter: { type: "heal", name: "Aliento", cost: 0, value: 4 },
  },
  ranger: {
    name: "Ranger",
    starter: { type: "attack", name: "Disparo", cost: 0, value: 5 },
  },
};

// Pool de cartas que pueden aparecer como recompensa.
const REWARD_POOL = [
  { type: "attack", name: "Tajo", cost: 1, value: 6 },
  { type: "attack", name: "Estocada", cost: 2, value: 10 },
  { type: "attack", name: "Golpe pesado", cost: 3, value: 14 },
  { type: "defense", name: "Guardia", cost: 1, value: 6 },
  { type: "defense", name: "Muralla", cost: 2, value: 10 },
  { type: "defense", name: "Bastión", cost: 3, value: 14 },
  { type: "heal", name: "Vendaje", cost: 1, value: 5 },
  { type: "heal", name: "Bálsamo", cost: 2, value: 9 },
  { type: "heal", name: "Plegaria", cost: 3, value: 13 },
  { type: "aoe", name: "Onda", cost: 2, value: 5 },
  { type: "aoe", name: "Tormenta", cost: 3, value: 7 },
];

// ===== Estado del juego =====
const state = {
  players: [],
  enemies: [],
  hand: [],
  deck: [],
  discard: [],
  selectedCard: null,
  activePlayer: null,
  phase: "player",
  busy: false,
  cardCounter: 0,
  floor: 1,
  classId: "warrior",
  numPlayers: 2,
  screen: "menu", // menu | game | reward | gameover
};

// ===== Elementos del DOM =====
const el = {
  menu: document.getElementById("menu"),
  game: document.getElementById("game"),
  reward: document.getElementById("reward"),
  rewardText: document.getElementById("rewardText"),
  rewardCards: document.getElementById("rewardCards"),
  skipRewardBtn: document.getElementById("skipRewardBtn"),
  gameOver: document.getElementById("gameOver"),
  gameOverTitle: document.getElementById("gameOverTitle"),
  gameOverSub: document.getElementById("gameOverSub"),
  numPlayers: document.getElementById("numPlayers"),
  playerClass: document.getElementById("playerClass"),
  startBtn: document.getElementById("startBtn"),
  restartBtn: document.getElementById("restartBtn"),
  players: document.getElementById("players"),
  enemies: document.getElementById("enemies"),
  hand: document.getElementById("hand"),
  floorLabel: document.getElementById("floorLabel"),
  turnLabel: document.getElementById("turnLabel"),
  manaLabel: document.getElementById("manaLabel"),
  deckLabel: document.getElementById("deckLabel"),
  endTurnBtn: document.getElementById("endTurnBtn"),
  log: document.getElementById("log"),
};

// ===== Utilidades =====
const rand = (n) => Math.floor(Math.random() * n);

function log(msg) {
  const entry = document.createElement("div");
  entry.className = "entry";
  entry.textContent = msg;
  el.log.prepend(entry);
  while (el.log.children.length > 14) {
    el.log.removeChild(el.log.lastChild);
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createCard(template) {
  return {
    id: ++state.cardCounter,
    type: template.type,
    name: template.name,
    cost: template.cost,
    value: template.value,
  };
}

// ===== Mazo =====
function buildStarterDeck(classId) {
  const cards = [];
  for (let i = 0; i < 4; i++) {
    cards.push(createCard({ type: "attack", name: "Golpe", cost: 1, value: 5 }));
  }
  for (let i = 0; i < 4; i++) {
    cards.push(createCard({ type: "defense", name: "Escudo", cost: 1, value: 5 }));
  }
  cards.push(createCard(CLASSES[classId].starter));
  return shuffle(cards);
}

function resetDrawPile(cards) {
  state.deck = shuffle([...cards]);
  state.discard = [];
  state.hand = [];
}

function drawCards(n) {
  for (let i = 0; i < n; i++) {
    if (state.deck.length === 0) {
      if (state.discard.length === 0) break;
      state.deck = shuffle(state.discard);
      state.discard = [];
      log("Se baraja la pila de descarte.");
    }
    state.hand.push(state.deck.pop());
  }
}

function discardHand() {
  state.discard.push(...state.hand);
  state.hand = [];
}

function addCardToDeck(template) {
  const card = createCard(template);
  state.deck.push(card);
  shuffle(state.deck);
  log(`Agregaste ${card.name} al mazo.`);
}

// ===== Unidades =====
function makePlayer(name, classId) {
  return {
    name,
    classId,
    hp: PLAYER_HP,
    maxHp: PLAYER_HP,
    shield: 0,
    mana: MAX_MANA,
    maxMana: MAX_MANA,
    alive: true,
    fx: null,
  };
}

function makeEnemy(name, floor) {
  const hpBonus = (floor - 1) * 4;
  return {
    name,
    hp: ENEMY_HP + hpBonus,
    maxHp: ENEMY_HP + hpBonus,
    shield: 0,
    alive: true,
    fx: null,
    intent: null,
  };
}

function enemyCountForFloor(floor) {
  const maxExtra = Math.min(3, 1 + Math.floor((floor - 1) / 2));
  return 1 + rand(maxExtra + 1);
}

function spawnEnemies(floor) {
  const count = enemyCountForFloor(floor);
  state.enemies = [];
  for (let i = 0; i < count; i++) {
    state.enemies.push(makeEnemy(`Enemigo ${i + 1}`, floor));
  }
  log(`Piso ${floor}: aparecen ${count} enemigo${count > 1 ? "s" : ""}.`);
}

function setupPlayers(numPlayers, classId) {
  state.players = [];
  const className = CLASSES[classId].name;
  for (let i = 0; i < numPlayers; i++) {
    const suffix = numPlayers > 1 ? ` ${i + 1}` : "";
    state.players.push(makePlayer(`${className}${suffix}`, classId));
  }
}

// ===== Intenciones enemigas =====
function enemyAttackValue(floor) {
  return 4 + rand(4) + Math.floor((floor - 1) / 2);
}

function enemyDefendValue(floor) {
  return 4 + rand(4) + Math.floor((floor - 1) / 3);
}

function planEnemyIntents() {
  const alivePlayers = state.players.filter((p) => p.alive);
  state.enemies.forEach((enemy) => {
    if (!enemy.alive) {
      enemy.intent = null;
      return;
    }
    if (Math.random() < 0.65 && alivePlayers.length > 0) {
      const target = alivePlayers[rand(alivePlayers.length)];
      enemy.intent = {
        action: "attack",
        value: enemyAttackValue(state.floor),
        target,
      };
    } else {
      enemy.intent = {
        action: "defend",
        value: enemyDefendValue(state.floor),
      };
    }
  });
}

function intentLabel(enemy) {
  if (!enemy.alive || !enemy.intent) return "";
  const { action, value, target } = enemy.intent;
  if (action === "attack") {
    const targetName = target && target.alive ? target.name : "?";
    return `⚔ ${value} → ${targetName}`;
  }
  return `🛡 +${value}`;
}

function executeIntent(enemy) {
  const intent = enemy.intent;
  if (!intent) return;

  if (intent.action === "attack" && intent.target && intent.target.alive) {
    applyDamage(intent.target, intent.value);
    log(`${enemy.name} ataca a ${intent.target.name} por ${intent.value}.`);
  } else if (intent.action === "defend") {
    enemy.shield += intent.value;
    enemy.fx = { kind: "shield", text: `+${intent.value} 🛡` };
    log(`${enemy.name} se defiende (+${intent.value} escudo).`);
  } else if (intent.action === "attack") {
    const fallback = state.players.filter((p) => p.alive);
    if (fallback.length > 0) {
      const target = fallback[rand(fallback.length)];
      applyDamage(target, intent.value);
      log(`${enemy.name} ataca a ${target.name} por ${intent.value}.`);
    }
  }
}

// ===== Run roguelike =====
function startRun() {
  state.floor = 1;
  state.classId = el.playerClass.value;
  state.numPlayers = Math.min(4, Math.max(1, parseInt(el.numPlayers.value) || 1));
  state.selectedCard = null;
  state.phase = "player";
  state.busy = false;
  state.cardCounter = 0;
  el.log.innerHTML = "";

  setupPlayers(state.numPlayers, state.classId);
  resetDrawPile(buildStarterDeck(state.classId));
  spawnEnemies(state.floor);
  beginCombat(true);
}

function beginCombat(isFreshFloor) {
  state.phase = "player";
  state.busy = false;
  state.selectedCard = null;
  discardHand();
  drawCards(HAND_SIZE);
  state.players.forEach((p) => {
    if (p.alive) {
      p.mana = p.maxMana;
      if (isFreshFloor) p.shield = 0;
    }
  });
  state.enemies.forEach((e) => {
    if (e.alive) e.shield = 0;
  });
  const firstAlive = state.players.findIndex((p) => p.alive);
  state.activePlayer = firstAlive >= 0 ? firstAlive : 0;
  planEnemyIntents();
  showScreen("game");
  render();
  log(`Piso ${state.floor}. Tu turno.`);
}

function showScreen(name) {
  state.screen = name;
  el.menu.classList.toggle("hidden", name !== "menu");
  el.game.classList.toggle("hidden", name !== "game");
  el.reward.classList.toggle("hidden", name !== "reward");
  el.gameOver.classList.toggle("hidden", name !== "gameover");
}

// ===== Recompensas =====
function cardsForReward(floor) {
  const maxCost = Math.min(3, 1 + Math.floor(floor / 2));
  const pool = REWARD_POOL.filter((c) => c.cost <= maxCost);
  const picks = [];
  const used = new Set();
  while (picks.length < 3 && used.size < pool.length) {
    const card = pool[rand(pool.length)];
    const key = `${card.type}-${card.name}-${card.cost}`;
    if (used.has(key)) continue;
    used.add(key);
    picks.push(card);
  }
  return picks;
}

function showRewardScreen() {
  const options = cardsForReward(state.floor);
  el.rewardText.textContent = `Piso ${state.floor} superado. Elegí una carta o omití.`;
  el.rewardCards.innerHTML = "";
  options.forEach((template) => {
    const def = CARD_TYPES[template.type];
    const div = document.createElement("div");
    div.className = `card reward-pick ${template.type}`;
    div.innerHTML = `
      <div class="card-cost">${template.cost}</div>
      <div class="card-name">${template.name}</div>
      <div class="card-type">${def.label}</div>
      <div class="card-value">${def.icon} ${template.value}</div>
    `;
    div.addEventListener("click", () => pickReward(template));
    el.rewardCards.appendChild(div);
  });
  showScreen("reward");
}

function pickReward(template) {
  addCardToDeck(template);
  advanceFloor();
}

function skipReward() {
  log("Omitiste la recompensa.");
  advanceFloor();
}

function advanceFloor() {
  state.floor += 1;
  state.players.forEach((p) => {
    if (p.alive) {
      const heal = 5;
      p.hp = Math.min(p.maxHp, p.hp + heal);
    }
  });
  spawnEnemies(state.floor);
  beginCombat(true);
}

// ===== Render =====
function fxFloat(unit) {
  if (!unit.fx) return "";
  return `<div class="float ${unit.fx.kind}">${unit.fx.text}</div>`;
}

function unitEl(unit, index, isEnemy) {
  const div = document.createElement("div");
  div.className = "unit" + (isEnemy ? " enemy" : "");
  if (!unit.alive) div.classList.add("dead");

  const card = state.selectedCard != null ? state.hand[state.selectedCard] : null;
  const isTargetable =
    state.phase === "player" &&
    !state.busy &&
    unit.alive &&
    card != null &&
    ((card.type === "attack" && isEnemy) ||
      ((card.type === "defense" || card.type === "heal") && !isEnemy));

  if (isTargetable) {
    div.classList.add("targetable");
    div.addEventListener("click", () => playCardOn(unit));
  }

  if (!isEnemy && unit.alive && state.phase === "player" && !state.busy && !isTargetable) {
    div.style.cursor = "pointer";
    div.addEventListener("click", () => setActivePlayer(index));
  }

  if (!isEnemy && index === state.activePlayer) div.classList.add("active");
  if (unit.fx && unit.fx.shake) div.classList.add("hit");
  if (unit.fx && unit.fx.kind === "heal") div.classList.add("healed");

  const hpPct = Math.max(0, (unit.hp / unit.maxHp) * 100);
  const manaPips = isEnemy
    ? ""
    : `<div class="mana-pips">${Array.from(
        { length: unit.maxMana },
        (_, i) => `<span class="pip${i < unit.mana ? " on" : ""}"></span>`
      ).join("")}</div>`;

  const intentHtml =
    isEnemy && unit.alive && unit.intent
      ? `<div class="enemy-intent ${unit.intent.action}">${intentLabel(unit)}</div>`
      : "";

  div.innerHTML = `
    ${fxFloat(unit)}
    ${intentHtml}
    <div class="unit-name">
      <span>${unit.name}</span>
      ${unit.shield > 0 ? `<span class="unit-shield">🛡 ${unit.shield}</span>` : ""}
    </div>
    <div class="hp-bar"><div class="hp-fill" style="width:${hpPct}%"></div></div>
    <div class="hp-text">${Math.max(0, unit.hp)} / ${unit.maxHp}</div>
    ${manaPips}
  `;
  return div;
}

function cardEl(card, index) {
  const div = document.createElement("div");
  div.className = `card ${card.type}`;
  if (index === state.selectedCard) div.classList.add("selected");

  const active = state.players[state.activePlayer];
  const affordable =
    state.phase === "player" &&
    !state.busy &&
    active &&
    active.alive &&
    card.cost <= active.mana;
  if (!affordable) div.classList.add("unaffordable");

  const def = CARD_TYPES[card.type];
  div.innerHTML = `
    <div class="card-cost">${card.cost}</div>
    <div class="card-name">${card.name}</div>
    <div class="card-type">${def.label}</div>
    <div class="card-value">${def.icon} ${card.value}</div>
  `;

  if (affordable) div.addEventListener("click", () => selectCard(index));
  return div;
}

function render() {
  el.players.innerHTML = "";
  state.players.forEach((u, i) => el.players.appendChild(unitEl(u, i, false)));

  el.enemies.innerHTML = "";
  state.enemies.forEach((u, i) => el.enemies.appendChild(unitEl(u, i, true)));

  el.hand.innerHTML = "";
  state.hand.forEach((c, i) => el.hand.appendChild(cardEl(c, i)));

  const active = state.players[state.activePlayer];
  el.floorLabel.textContent = `Piso ${state.floor}`;
  el.manaLabel.textContent = active
    ? `${active.name} · Maná: ${active.mana} / ${active.maxMana}`
    : "";
  el.deckLabel.textContent = `Mazo: ${state.deck.length} · Descarte: ${state.discard.length}`;
  el.turnLabel.textContent =
    state.phase === "player" ? "Turno del jugador" : "Turno enemigo";
  el.endTurnBtn.disabled = state.phase !== "player" || state.busy;

  state.players.forEach((u) => (u.fx = null));
  state.enemies.forEach((u) => (u.fx = null));
}

// ===== Interacción del jugador =====
function setActivePlayer(index) {
  if (!state.players[index].alive) return;
  state.activePlayer = index;
  state.selectedCard = null;
  render();
}

function selectCard(index) {
  const card = state.hand[index];
  if (card.type === "aoe") {
    playAoe(index);
    return;
  }
  state.selectedCard = state.selectedCard === index ? null : index;
  render();
}

function spendMana(card) {
  state.players[state.activePlayer].mana -= card.cost;
}

function playCardOn(target) {
  const idx = state.selectedCard;
  if (idx == null) return;
  const card = state.hand[idx];
  const active = state.players[state.activePlayer];
  if (!active || card.cost > active.mana) return;

  spendMana(card);

  if (card.type === "attack") {
    applyDamage(target, card.value);
    log(`${active.name} usa ${card.name}: ${card.value} de daño a ${target.name}.`);
  } else if (card.type === "defense") {
    target.shield += card.value;
    target.fx = { kind: "shield", text: `+${card.value} 🛡` };
    log(`${active.name} usa ${card.name}: +${card.value} de escudo a ${target.name}.`);
  } else if (card.type === "heal") {
    applyHeal(target, card.value);
    log(`${active.name} usa ${card.name}: +${card.value} de vida a ${target.name}.`);
  }

  consumeCard(idx);
  if (checkCombatEnd()) return;
  render();
}

function playAoe(idx) {
  const card = state.hand[idx];
  const active = state.players[state.activePlayer];
  if (!active || card.cost > active.mana) return;

  spendMana(card);
  state.enemies.forEach((e) => {
    if (e.alive) applyDamage(e, card.value);
  });
  log(`${active.name} usa ${card.name}: ${card.value} de daño a todos los enemigos.`);

  consumeCard(idx);
  if (checkCombatEnd()) return;
  render();
}

function consumeCard(idx) {
  state.discard.push(state.hand[idx]);
  state.hand.splice(idx, 1);
  state.selectedCard = null;
}

function applyDamage(unit, amount) {
  let remaining = amount;
  if (unit.shield > 0) {
    const absorbed = Math.min(unit.shield, remaining);
    unit.shield -= absorbed;
    remaining -= absorbed;
  }
  unit.hp -= remaining;
  unit.fx = { kind: "damage", text: `-${amount}`, shake: true };
  if (unit.hp <= 0) {
    unit.hp = 0;
    unit.alive = false;
    log(`${unit.name} ha caído.`);
  }
}

function applyHeal(unit, amount) {
  const healed = Math.min(amount, unit.maxHp - unit.hp);
  unit.hp += healed;
  unit.fx = { kind: "heal", text: `+${healed}` };
}

// ===== Turnos =====
function endTurn() {
  if (state.phase !== "player" || state.busy) return;
  state.selectedCard = null;
  state.phase = "enemy";
  state.busy = true;
  discardHand();
  render();
  log("Finalizas tu turno...");
  setTimeout(enemyTurn, 700);
}

function enemyTurn() {
  const actors = state.enemies.filter((e) => e.alive);
  let i = 0;

  function nextEnemy() {
    if (i >= actors.length) {
      startPlayerTurn();
      return;
    }
    const enemy = actors[i++];
    if (!state.players.some((p) => p.alive)) {
      checkCombatEnd();
      return;
    }
    executeIntent(enemy);
    render();
    if (checkCombatEnd()) return;
    setTimeout(nextEnemy, 600);
  }

  nextEnemy();
}

function startPlayerTurn() {
  state.phase = "player";
  state.busy = false;
  state.players.forEach((p) => {
    if (p.alive) p.mana = p.maxMana;
  });
  drawCards(HAND_SIZE);
  const firstAlive = state.players.findIndex((p) => p.alive);
  state.activePlayer = firstAlive >= 0 ? firstAlive : 0;
  planEnemyIntents();
  render();
  log("Tu turno. Recuperás maná y robás cartas.");
}

function checkCombatEnd() {
  const playersAlive = state.players.some((p) => p.alive);
  const enemiesAlive = state.enemies.some((e) => e.alive);

  render();

  if (!playersAlive) {
    endRun(false);
    return true;
  }
  if (!enemiesAlive) {
    state.busy = true;
    setTimeout(showRewardScreen, 400);
    return true;
  }
  return false;
}

function endRun(victory) {
  state.busy = true;
  if (victory) {
    el.gameOverTitle.textContent = "¡Run completada!";
    el.gameOverSub.textContent = `Llegaste al piso ${state.floor}.`;
  } else {
    el.gameOverTitle.textContent = "Fin de la run";
    el.gameOverSub.textContent = `Caíste en el piso ${state.floor}.`;
  }
  showScreen("gameover");
}

// ===== Eventos =====
el.startBtn.addEventListener("click", () => {
  startRun();
});

el.endTurnBtn.addEventListener("click", endTurn);
el.skipRewardBtn.addEventListener("click", skipReward);

el.restartBtn.addEventListener("click", () => {
  showScreen("menu");
});
