import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, Map as MapIcon, BookOpen, Sparkles, Trophy, Camera, X, ChevronRight,
  Lock, Check, Compass, ScanLine, ArrowLeft, Users, Leaf, Volume2, Type,
  Contrast, Accessibility, Play, Info, Coins, Star,
} from "lucide-react";

/* ============================== DATA ============================== */

const INTERESTS = [
  { id: "bigcats", label: "Big Cats", emoji: "🐯" },
  { id: "primates", label: "Primates", emoji: "🦧" },
  { id: "birds", label: "Birds", emoji: "🦜" },
  { id: "reptiles", label: "Reptiles", emoji: "🦎" },
  { id: "ocean", label: "Ocean & Aquatic Life", emoji: "🐧" },
  { id: "intelligence", label: "Animal Intelligence", emoji: "🧠" },
  { id: "endangered", label: "Endangered Species", emoji: "🛡️" },
  { id: "conservation", label: "Conservation", emoji: "🌱" },
  { id: "weird", label: "Weird & Wonderful", emoji: "🦥" },
  { id: "surprise", label: "Surprise Me", emoji: "✨" },
];

const VISITOR_TYPES = ["Child", "Teen", "Adult", "Family", "School Group"];
const PACES = [
  { id: "relaxed", label: "Relaxed Explorer", desc: "Short route, fewer missions." },
  { id: "curious", label: "Curious Adventurer", desc: "Balanced exploration and challenges." },
  { id: "master", label: "Wildlife Master", desc: "Longer route, harder challenges, hidden discoveries." },
];
const TIMES = ["30 minutes", "1 hour", "2 hours", "Half Day", "Full Day"];

const LEVELS = [
  { name: "Rookie Ranger", min: 0 },
  { name: "Wildlife Scout", min: 300 },
  { name: "Habitat Hero", min: 700 },
  { name: "Conservation Champion", min: 1200 },
  { name: "Wildlife Guardian", min: 2000 },
];

const ANIMALS = [
  {
    id: "tiger", name: "Malayan Tiger", sci: "Panthera tigris jacksoni", emoji: "🐯",
    category: "bigcats", zone: "Tiger Trail", distance: "120m", difficulty: 3, rarity: "Rare",
    habitat: "Tropical & subtropical forest", diet: "Carnivore — deer, wild boar",
    status: "Critically Endangered", threat: "Habitat loss and poaching",
    help: "Support forest corridors and avoid products linked to illegal wildlife trade.",
    fact: "Fewer than 150 Malayan tigers remain in the wild — you're looking at one of the rarest cats on Earth.",
    mystery: [
      "Something powerful is nearby... 👀",
      "This predator can leap several metres in a single jump.",
      "No two of us have the same stripe pattern — like a fingerprint.",
    ],
    choices: ["Malayan Tiger", "Sun Bear", "Komodo Dragon", "Lion"],
    conservation: {
      title: "The Vanishing Stripes",
      q: "Malayan tiger habitat has shrunk drastically. Which action helps most?",
      options: ["Protecting connected forest corridors", "Buying tiger-print clothing", "Feeding tigers directly"],
      correct: 0,
      note: "Connected forests let tigers roam, hunt and find mates without crossing into human settlements.",
    },
  },
  {
    id: "lion", name: "Lion", sci: "Panthera leo", emoji: "🦁",
    category: "bigcats", zone: "Savanna Pride", distance: "260m", difficulty: 2, rarity: "Uncommon",
    habitat: "Grassland & savanna", diet: "Carnivore — antelope, zebra, buffalo",
    status: "Vulnerable", threat: "Habitat fragmentation and human conflict",
    help: "Support wildlife corridors that connect protected savanna reserves.",
    fact: "A lion's roar can be heard up to 8km away — that's roughly the distance across the whole reserve.",
  },
  {
    id: "orangutan", name: "Orangutan", sci: "Pongo pygmaeus", emoji: "🦧",
    category: "primates", zone: "Canopy Walk", distance: "180m", difficulty: 2, rarity: "Rare",
    habitat: "Rainforest canopy", diet: "Omnivore — fruit, bark, insects",
    status: "Critically Endangered", threat: "Deforestation for palm oil plantations",
    help: "Look for sustainably certified palm oil (RSPO) when you shop.",
    fact: "Orangutans share about 97% of their DNA with humans and build a fresh sleeping nest every single night.",
    mystery: [
      "I spend most of my life high above the forest floor.",
      "My arms are much longer than my legs.",
      "I help forests grow by spreading seeds wherever I travel.",
    ],
    choices: ["Orangutan", "Gibbon", "Macaque", "Sloth"],
    conservation: {
      title: "The Missing Trees",
      q: "Palm oil farming has replaced orangutan forest. What helps most?",
      options: ["Choosing RSPO-certified sustainable palm oil", "Avoiding all forests entirely", "Releasing orangutans into cities"],
      correct: 0,
      note: "Certified sustainable palm oil is grown without clearing more rainforest — small shopping choices add up.",
    },
  },
  {
    id: "proboscis", name: "Proboscis Monkey", sci: "Nasalis larvatus", emoji: "🐒",
    category: "primates", zone: "Mangrove Walk", distance: "310m", difficulty: 3, rarity: "Rare",
    habitat: "Mangrove & riverine forest", diet: "Herbivore — leaves, unripe fruit",
    status: "Endangered", threat: "Mangrove clearing and river pollution",
    help: "Support wetland conservation and reduce single-use plastic near waterways.",
    fact: "Males use their huge nose like a megaphone — it amplifies their call to warn off rivals.",
  },
  {
    id: "hornbill", name: "Great Hornbill", sci: "Buceros bicornis", emoji: "🦜",
    category: "birds", zone: "Canopy Walk", distance: "150m", difficulty: 2, rarity: "Uncommon",
    habitat: "Rainforest canopy", diet: "Omnivore — fruit, small animals",
    status: "Vulnerable", threat: "Logging removes the old trees they nest in",
    help: "Support reforestation projects that plant the tall, mature trees hornbills need.",
    fact: "A father hornbill seals his mate inside a tree hollow with mud, then feeds her through a tiny slit for months.",
  },
  {
    id: "komodo", name: "Komodo Dragon", sci: "Varanus komodoensis", emoji: "🦎",
    category: "reptiles", zone: "Dragon's Den", distance: "220m", difficulty: 3, rarity: "Rare",
    habitat: "Dry savanna & tropical forest", diet: "Carnivore — deer, wild boar, carrion",
    status: "Endangered", threat: "Rising sea levels shrinking island habitat",
    help: "Support climate action — their entire native range is a handful of low-lying islands.",
    fact: "The world's largest lizard can smell carrion from up to 9.5km away using its forked tongue.",
    mystery: [
      "I am the largest lizard alive today.",
      "My saliva contains venom, not just bacteria as once believed.",
      "I can run in short bursts faster than most people can sprint.",
    ],
    choices: ["Komodo Dragon", "Water Monitor", "Crocodile", "Iguana"],
  },
  {
    id: "sunbear", name: "Sun Bear", sci: "Helarctos malayanus", emoji: "🐻", category: "weird",
    zone: "Forest Floor", distance: "90m", difficulty: 1, rarity: "Uncommon",
    habitat: "Tropical rainforest", diet: "Omnivore — insects, fruit, honey",
    status: "Vulnerable", threat: "Deforestation and the illegal pet trade",
    help: "Never support venues offering bear cub photo ops — it fuels the illegal trade.",
    fact: "The world's smallest bear has a tongue up to 25cm long, perfect for scooping honey out of tree hollows.",
  },
  {
    id: "redpanda", name: "Red Panda", sci: "Ailurus fulgens", emoji: "🐾", category: "weird",
    zone: "Misty Highlands", distance: "410m", difficulty: 2, rarity: "Rare",
    habitat: "Temperate mountain forest", diet: "Herbivore — mostly bamboo",
    status: "Endangered", threat: "Habitat loss in Himalayan forests",
    help: "Support high-altitude forest protection programmes.",
    fact: "Despite the name, red pandas aren't closely related to giant pandas — their closest relatives are raccoons.",
  },
  {
    id: "panda", name: "Giant Panda", sci: "Ailuropoda melanoleuca", emoji: "🐼", category: "endangered",
    zone: "Bamboo Grove", distance: "140m", difficulty: 1, rarity: "Legendary",
    habitat: "Temperate bamboo forest", diet: "Herbivore — almost entirely bamboo",
    status: "Vulnerable", threat: "Fragmented bamboo forest habitat",
    help: "Support reforestation of connected bamboo corridors in the wild.",
    fact: "A giant panda eats up to 14 hours a day and can get through 12kg of bamboo — just to meet its energy needs.",
    mystery: [
      "I wear my own permanent black-and-white disguise.",
      "I spend most of my waking hours chewing on one plant.",
      "I was once found across most of southern and eastern China — now only in fragments of it.",
    ],
    choices: ["Giant Panda", "Red Panda", "Sun Bear", "Raccoon"],
    conservation: {
      title: "Bamboo Corridors",
      q: "Wild panda populations are split into isolated patches of forest. What helps most?",
      options: ["Planting bamboo corridors that reconnect patches", "Moving all pandas into one zoo", "Removing bamboo to make room for farms"],
      correct: 0,
      note: "Corridors let separated panda populations meet, breed, and stay genetically healthy.",
    },
  },
  {
    id: "rhino", name: "White Rhinoceros", sci: "Ceratotherium simum", emoji: "🦏", category: "endangered",
    zone: "Grass Plains", distance: "330m", difficulty: 2, rarity: "Legendary",
    habitat: "Savanna grassland", diet: "Herbivore — grasses",
    status: "Near Threatened", threat: "Poaching for illegal horn trade",
    help: "Support anti-poaching ranger programmes and never buy rhino horn products.",
    fact: "A rhino's horn is made of keratin — the same protein as your fingernails — yet it's targeted more than gold.",
    conservation: {
      title: "The Horn Trade",
      q: "Rhino horn is falsely believed to have medicinal power. What actually helps rhinos?",
      options: ["Funding ranger patrols and demand-reduction campaigns", "Removing every rhino's horn painlessly", "Ignoring the issue since it's far away"],
      correct: 0,
      note: "Most poaching is driven by demand thousands of kilometres away — patrols and awareness both matter.",
    },
  },
  {
    id: "elephant", name: "Asian Elephant", sci: "Elephas maximus", emoji: "🐘", category: "conservation",
    zone: "Elephant Trail", distance: "200m", difficulty: 1, rarity: "Rare",
    habitat: "Forest & grassland", diet: "Herbivore — grasses, bark, fruit",
    status: "Endangered", threat: "Habitat loss and human-elephant conflict",
    help: "Support corridors that let elephant herds move without crossing farmland.",
    fact: "Elephants mourn their dead and can recognise themselves in a mirror — a rare sign of self-awareness.",
  },
  {
    id: "giraffe", name: "Giraffe", sci: "Giraffa camelopardalis", emoji: "🦒", category: "intelligence",
    zone: "Grass Plains", distance: "280m", difficulty: 1, rarity: "Uncommon",
    habitat: "Savanna woodland", diet: "Herbivore — acacia leaves",
    status: "Vulnerable", threat: "Habitat loss, often called a 'silent extinction'",
    help: "Support savanna habitat protection — giraffe numbers have dropped sharply and quietly.",
    fact: "A giraffe's neck has the same number of neck bones as yours — just seven, each one enormous.",
  },
];

const QUIZ_BANK = {
  tiger: { q: "Roughly how many Malayan tigers remain in the wild?", options: ["Under 150", "About 5,000", "Over 20,000"], correct: 0 },
  lion: { q: "How far can a lion's roar carry?", options: ["About 200m", "Up to 8km", "Over 100km"], correct: 1 },
  orangutan: { q: "About how much DNA do orangutans share with humans?", options: ["50%", "70%", "97%"], correct: 2 },
  proboscis: { q: "Why do male proboscis monkeys have such a large nose?", options: ["To smell prey", "To amplify their call", "To cool down"], correct: 1 },
  hornbill: { q: "How does a father hornbill protect his mate while nesting?", options: ["Seals her in a tree hollow with mud", "Builds a second nest nearby", "Guards from a distance"], correct: 0 },
  komodo: { q: "How does a Komodo dragon mainly detect food from far away?", options: ["Hearing", "Smell via its tongue", "Vibrations"], correct: 1 },
  sunbear: { q: "What is a sun bear's tongue especially good for?", options: ["Digging burrows", "Scooping honey from hollows", "Grooming fur"], correct: 1 },
  redpanda: { q: "Which animal is the red panda's closest relative?", options: ["Giant panda", "Raccoon", "Cat"], correct: 1 },
  panda: { q: "About how many hours a day does a giant panda spend eating?", options: ["2 hours", "6 hours", "Up to 14 hours"], correct: 2 },
  rhino: { q: "A rhino's horn is made of the same material as...", options: ["Bone", "Your fingernails (keratin)", "Ivory"], correct: 1 },
  elephant: { q: "What rare ability do Asian elephants show?", options: ["Recognising themselves in a mirror", "Flying short distances", "Changing colour"], correct: 0 },
  giraffe: { q: "How many bones are in a giraffe's neck, compared to yours?", options: ["The same — seven", "Double — fourteen", "Triple — twenty-one"], correct: 0 },
};

const OBSERVATIONS = ["Resting", "Walking", "Grooming", "Eating", "Playing", "I can't tell"];
const OBS_EXPLAIN = {
  Resting: "Resting during the day is common — many species are most active at dawn, dusk or night to save energy in the heat.",
  Walking: "Patrolling their space keeps an animal aware of its territory, its group, and anything unfamiliar nearby.",
  Grooming: "Grooming isn't just hygiene — for social animals it also builds trust and strengthens bonds.",
  Eating: "Feeding behaviour tells you a lot: what, how much, and how often reveals how an animal survives in the wild.",
  Playing: "Play looks fun, but for young animals it's practice — for hunting, climbing, or social skills they'll need as adults.",
  "I can't tell": "That's a perfectly good answer — real wildlife detectives often need a second look. That's the whole point of watching closely.",
};

const BADGES = [
  { id: "bigcat", name: "Big Cat Tracker", desc: "Discover 2 big cats.", check: (g) => ANIMALS.filter(a => a.category === "bigcats" && g.discovered[a.id]).length >= 2 },
  { id: "primate", name: "Primate Pal", desc: "Discover 2 primates.", check: (g) => ANIMALS.filter(a => a.category === "primates" && g.discovered[a.id]).length >= 2 },
  { id: "sharpeyes", name: "Sharp Eyes", desc: "Complete 3 observation missions.", check: (g) => g.observationsDone >= 3 },
  { id: "ecohero", name: "Eco Hero", desc: "Complete 2 conservation challenges.", check: (g) => g.conservationDone >= 2 },
  { id: "genius", name: "Wildlife Genius", desc: "Answer 5 quiz questions correctly.", check: (g) => g.quizCorrectTotal >= 5 },
  { id: "explorer", name: "Master Explorer", desc: "Complete a full quest.", check: (g) => g.questsCompleted >= 1 },
];

const RARITY_STYLE = {
  Legendary: "from-amber-400 to-orange-500",
  Rare: "from-emerald-500 to-teal-600",
  Uncommon: "from-stone-400 to-stone-500",
};

function levelFor(xp) {
  let cur = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) cur = l;
  const idx = LEVELS.indexOf(cur);
  const next = LEVELS[idx + 1];
  return { name: cur.name, next, progress: next ? (xp - cur.min) / (next.min - cur.min) : 1 };
}

/* ============================== RAYA AI ============================== */

async function askRaya(prompt, animal, visitorType) {
  const sys = `You are Raya, the warm, witty wildlife-guide character inside "WildQuest AI", a gamified app for Mandai Wildlife Reserve in Singapore. Stay fully in character as a friendly explorer, never mention being an AI or language model. Reply in 2-4 short sentences, playful and specific, tailored for a ${visitorType || "general"} visitor. End with a small spark of curiosity when it fits naturally.`;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 220,
        system: sys,
        messages: [{ role: "user", content: `About the ${animal.name} (${animal.sci}): ${prompt}` }],
      }),
    });
    const data = await res.json();
    const text = (data?.content || []).map((b) => b.text || "").join(" ").trim();
    if (!text) throw new Error("empty");
    return text;
  } catch (e) {
    return `Raya's voice crackles a little in the humidity, but here's what I know: ${animal.fact}`;
  }
}

/* ============================== UI PRIMITIVES ============================== */

function StampCard({ children, rotate = -2, className = "" }) {
  return (
    <div
      className={`relative bg-stone-50 rounded-2xl p-4 shadow-lg border-2 border-dashed border-stone-300 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}

function XPBadgeChip({ xp }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
      <Star size={12} fill="currentColor" /> +{xp} XP
    </span>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-stone-50/90 backdrop-blur z-20 border-b border-stone-200">
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="p-1.5 -ml-1.5 rounded-full hover:bg-stone-200 text-emerald-900">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="font-display text-xl text-emerald-950">{title}</h1>
      </div>
      {right}
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "map", label: "Map", icon: MapIcon },
    { id: "quest", label: "Quest", icon: Compass },
    { id: "passport", label: "Passport", icon: BookOpen },
    { id: "raya", label: "Raya", icon: Sparkles },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-50/95 backdrop-blur border-t border-stone-200 flex justify-around py-2 z-30 max-w-md mx-auto">
      {items.map((it) => {
        const Icon = it.icon;
        const active = screen === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setScreen(it.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${active ? "text-emerald-700" : "text-stone-400"}`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className={`text-[10px] font-medium ${active ? "font-bold" : ""}`}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================== MAIN APP ============================== */

export default function WildQuestApp() {
  const [screen, setScreen] = useState("splash");
  const [onboard, setOnboard] = useState({ visitorType: null, interests: [], pace: null, time: null });
  const [quest, setQuest] = useState(null);
  const [game, setGame] = useState({
    xp: 0, coins: 0, discovered: {}, badges: {}, observationsDone: 0,
    conservationDone: 0, quizCorrectStreak: 0, quizCorrectTotal: 0, questsCompleted: 0,
  });
  const [activeId, setActiveId] = useState(null);
  const [stage, setStage] = useState(null);
  const [clueIdx, setClueIdx] = useState(0);
  const [toast, setToast] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showAccess, setShowAccess] = useState(false);
  const [rayaLog, setRayaLog] = useState([]);
  const [rayaLoading, setRayaLoading] = useState(false);
  const [accessibility, setAccessibility] = useState({ largeText: false, highContrast: false, reduceMotion: false });
  const demoTimers = useRef([]);

  const level = levelFor(game.xp);
  const activeAnimal = ANIMALS.find((a) => a.id === activeId);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }, []);

  function addXP(amount, coins = 0) {
    setGame((g) => {
      const next = { ...g, xp: g.xp + amount, coins: g.coins + coins };
      const before = levelFor(g.xp).name, after = levelFor(next.xp).name;
      if (before !== after) setTimeout(() => showToast(`🎉 Level up! You're now a ${after}`), 400);
      return next;
    });
  }

  function checkBadges(nextGame) {
    BADGES.forEach((b) => {
      if (!nextGame.badges[b.id] && b.check(nextGame)) {
        nextGame.badges[b.id] = true;
        setTimeout(() => showToast(`🏅 Badge unlocked: ${b.name}`), 900);
      }
    });
    return nextGame;
  }

  function startQuest(ob) {
    const chosen = ob.interests.includes("surprise") || ob.interests.length === 0
      ? ANIMALS
      : ANIMALS.filter((a) => ob.interests.includes(a.category));
    const pool = chosen.length ? chosen : ANIMALS;
    const timeCount = { "30 minutes": 3, "1 hour": 5, "2 hours": 7, "Half Day": 8, "Full Day": 8 }[ob.time] || 5;
    const paceAdj = ob.pace === "relaxed" ? -1 : ob.pace === "master" ? 1 : 0;
    const count = Math.max(3, Math.min(8, timeCount + paceAdj));
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    const themeLabel = ob.interests.filter((i) => i !== "surprise")[0];
    const themeName = INTERESTS.find((i) => i.id === themeLabel)?.label;
    setQuest({
      title: themeName ? `The ${themeName} Trail` : "The Vanishing Forest",
      subtitle: "Explore the park, find the animals, and restore the Forest Knowledge Map.",
      animalIds: shuffled.map((a) => a.id),
    });
    setGame((g) => ({ ...g, discovered: {}, questsCompleted: g.questsCompleted }));
    setScreen("loading");
    setTimeout(() => setScreen("dashboard"), 1400);
  }

  function openAnimal(id) {
    setActiveId(id);
    setClueIdx(0);
    const a = ANIMALS.find((x) => x.id === id);
    const alreadyDiscovered = !!game.discovered[id];
    setStage(!alreadyDiscovered && a.mystery ? "clue" : "travel");
    setScreen("animalFlow");
  }

  function guessCorrect() {
    addXP(75);
    showToast("✅ Correct! Mystery solved.");
    setStage("travel");
  }

  function completeScan() {
    setStage("scanning");
    setTimeout(() => setStage("discovered"), 1100);
  }

  function confirmDiscovered() {
    addXP(100, 20);
    setGame((g) => {
      const next = { ...g, discovered: { ...g.discovered, [activeId]: true } };
      return checkBadges(next);
    });
    setStage("observe");
  }

  function chooseObservation() {
    addXP(50);
    setGame((g) => {
      const next = { ...g, observationsDone: g.observationsDone + 1 };
      return checkBadges(next);
    });
    setStage("quiz");
  }

  function answerQuiz(correct) {
    setGame((g) => {
      const next = {
        ...g,
        quizCorrectStreak: correct ? g.quizCorrectStreak + 1 : 0,
        quizCorrectTotal: g.quizCorrectTotal + (correct ? 1 : 0),
      };
      return checkBadges(next);
    });
    if (correct) addXP(30);
    setStage(activeAnimal?.conservation ? "conservation" : "reward");
  }

  function answerConservation() {
    addXP(100);
    setGame((g) => {
      const next = { ...g, conservationDone: g.conservationDone + 1 };
      return checkBadges(next);
    });
    setStage("reward");
  }

  function finishAnimalFlow() {
    setScreen("map");
    setActiveId(null);
    setStage(null);
    if (quest && quest.animalIds.every((id) => game.discovered[id] || id === activeId)) {
      setGame((g) => ({ ...g, questsCompleted: g.questsCompleted + 1 }));
      setTimeout(() => setScreen("questComplete"), 300);
    }
  }

  async function sendRayaQuestion(text, animal) {
    const a = animal || activeAnimal || ANIMALS[0];
    setRayaLog((l) => [...l, { role: "user", text }]);
    setRayaLoading(true);
    const reply = await askRaya(text, a, onboard.visitorType);
    setRayaLoading(false);
    setRayaLog((l) => [...l, { role: "raya", text: reply, animal: a.name }]);
  }

  function runDemo() {
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];
    const t = (fn, ms) => demoTimers.current.push(setTimeout(fn, ms));
    setOnboard({ visitorType: "Teen", interests: ["bigcats", "conservation"], pace: "curious", time: "1 hour" });
    t(() => startQuest({ visitorType: "Teen", interests: ["bigcats", "conservation"], pace: "curious", time: "1 hour" }), 200);
    t(() => setScreen("map"), 2200);
    t(() => openAnimal("tiger"), 3600);
    t(() => guessCorrect(), 5200);
    t(() => completeScan(), 6600);
    t(() => confirmDiscovered(), 8600);
    t(() => chooseObservation(), 10600);
    t(() => answerQuiz(true), 12600);
    t(() => answerConservation(), 14600);
    t(() => finishAnimalFlow(), 16600);
    t(() => showToast("👋 That's the WildQuest core loop — feel free to explore freely now!"), 17200);
  }

  useEffect(() => () => demoTimers.current.forEach(clearTimeout), []);

  const textScale = accessibility.largeText ? "text-[1.08em]" : "";
  const contrastCls = accessibility.highContrast ? "contrast-125" : "";

  /* --------------------------- SCREENS --------------------------- */

  if (screen === "splash") {
    return (
      <Shell accessibility={accessibility}>
        <div className="min-h-full flex flex-col items-center justify-center px-8 text-center bg-gradient-to-b from-emerald-950 to-emerald-900 text-stone-50">
          <div className="w-20 h-20 rounded-3xl bg-emerald-800 border border-emerald-700 flex items-center justify-center mb-6 shadow-xl">
            <Compass size={36} className="text-amber-400" />
          </div>
          <h1 className="font-display text-4xl mb-2 tracking-tight">WildQuest AI</h1>
          <p className="text-emerald-200 font-mono text-sm mb-10">Every visit becomes an adventure.</p>
          <button
            onClick={() => setScreen("who")}
            className="w-full max-w-xs bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold py-3.5 rounded-full shadow-lg transition-colors"
          >
            Start My Adventure
          </button>
          <button
            onClick={runDemo}
            className="mt-3 flex items-center gap-2 text-sm text-emerald-200 hover:text-amber-300 transition-colors"
          >
            <Play size={14} /> Watch a 30-second demo adventure
          </button>
        </div>
      </Shell>
    );
  }

  if (screen === "who") {
    return (
      <Shell accessibility={accessibility}>
        <Onboard step={1} total={5}>
          <h2 className="font-display text-2xl text-emerald-950 mb-1">Who's exploring today?</h2>
          <p className="text-stone-500 mb-6 text-sm">This helps Raya tailor every clue and fact for you.</p>
          <div className="grid grid-cols-2 gap-3">
            {VISITOR_TYPES.map((v) => (
              <ChoiceCard key={v} label={v} selected={onboard.visitorType === v} onClick={() => setOnboard((o) => ({ ...o, visitorType: v }))} />
            ))}
          </div>
          <NextButton disabled={!onboard.visitorType} onClick={() => setScreen("interests")} />
        </Onboard>
      </Shell>
    );
  }

  if (screen === "interests") {
    return (
      <Shell accessibility={accessibility}>
        <Onboard step={2} total={5}>
          <h2 className="font-display text-2xl text-emerald-950 mb-1">What sparks your curiosity?</h2>
          <p className="text-stone-500 mb-6 text-sm">Pick as many as you like.</p>
          <div className="grid grid-cols-2 gap-3">
            {INTERESTS.map((i) => {
              const sel = onboard.interests.includes(i.id);
              return (
                <button
                  key={i.id}
                  onClick={() =>
                    setOnboard((o) => ({
                      ...o,
                      interests: sel ? o.interests.filter((x) => x !== i.id) : [...o.interests, i.id],
                    }))
                  }
                  className={`rounded-2xl border-2 p-3 text-left transition-all ${sel ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white"}`}
                >
                  <div className="text-2xl mb-1">{i.emoji}</div>
                  <div className="text-xs font-semibold text-emerald-950">{i.label}</div>
                </button>
              );
            })}
          </div>
          <NextButton disabled={onboard.interests.length === 0} onClick={() => setScreen("pace")} />
        </Onboard>
      </Shell>
    );
  }

  if (screen === "pace") {
    return (
      <Shell accessibility={accessibility}>
        <Onboard step={3} total={5}>
          <h2 className="font-display text-2xl text-emerald-950 mb-1">How do you want to explore?</h2>
          <p className="text-stone-500 mb-6 text-sm">Choose your adventure style.</p>
          <div className="space-y-3">
            {PACES.map((p) => (
              <button
                key={p.id}
                onClick={() => setOnboard((o) => ({ ...o, pace: p.id }))}
                className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${onboard.pace === p.id ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white"}`}
              >
                <div className="font-bold text-emerald-950">{p.label}</div>
                <div className="text-xs text-stone-500 mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
          <NextButton disabled={!onboard.pace} onClick={() => setScreen("time")} />
        </Onboard>
      </Shell>
    );
  }

  if (screen === "time") {
    return (
      <Shell accessibility={accessibility}>
        <Onboard step={4} total={5}>
          <h2 className="font-display text-2xl text-emerald-950 mb-1">How much time do you have?</h2>
          <p className="text-stone-500 mb-6 text-sm">Your quest length will match it.</p>
          <div className="grid grid-cols-1 gap-2">
            {TIMES.map((t) => (
              <ChoiceCard key={t} label={t} selected={onboard.time === t} onClick={() => setOnboard((o) => ({ ...o, time: t }))} wide />
            ))}
          </div>
          <NextButton label="Create My WildQuest" disabled={!onboard.time} onClick={() => startQuest(onboard)} />
        </Onboard>
      </Shell>
    );
  }

  if (screen === "loading") {
    return (
      <Shell accessibility={accessibility}>
        <div className="min-h-full flex flex-col items-center justify-center bg-emerald-950 text-stone-50 px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-700 border-t-amber-400 mb-6" />
          <p className="font-display text-xl">Creating your WildQuest...</p>
          <p className="text-emerald-300 text-xs font-mono mt-2">Raya is scouting the trails ahead</p>
        </div>
      </Shell>
    );
  }

  /* ---- Post-onboarding screens share the shell + bottom nav ---- */
  const discoveredCount = quest ? quest.animalIds.filter((id) => game.discovered[id]).length : 0;
  const questTotal = quest ? quest.animalIds.length : 0;
  const nextAnimalId = quest ? quest.animalIds.find((id) => !game.discovered[id]) : null;
  const nextAnimal = ANIMALS.find((a) => a.id === nextAnimalId);

  return (
    <Shell accessibility={accessibility}>
      <div className="pb-24 min-h-full bg-stone-50">
        {screen === "dashboard" && (
          <Dashboard
            onboard={onboard} game={game} level={level} quest={quest}
            discoveredCount={discoveredCount} questTotal={questTotal} nextAnimal={nextAnimal}
            setScreen={setScreen} openAnimal={openAnimal} setShowAbout={setShowAbout} setShowAccess={setShowAccess}
          />
        )}
        {screen === "map" && (
          <MapScreen quest={quest} game={game} openAnimal={openAnimal} setScreen={setScreen} />
        )}
        {screen === "quest" && (
          <QuestScreen quest={quest} game={game} discoveredCount={discoveredCount} questTotal={questTotal} setScreen={setScreen} openAnimal={openAnimal} />
        )}
        {screen === "passport" && <PassportScreen quest={quest} game={game} setScreen={setScreen} />}
        {screen === "raya" && (
          <RayaScreen animal={activeAnimal || nextAnimal || ANIMALS[0]} log={rayaLog} loading={rayaLoading} onAsk={sendRayaQuestion} setScreen={setScreen} />
        )}
        {screen === "animalFlow" && activeAnimal && (
          <AnimalFlow
            animal={activeAnimal} stage={stage} setStage={setStage} clueIdx={clueIdx} setClueIdx={setClueIdx}
            onGuess={guessCorrect} onScan={completeScan} onConfirm={confirmDiscovered}
            onObserve={chooseObservation} onQuiz={answerQuiz} onConservation={answerConservation}
            onFinish={finishAnimalFlow} game={game}
          />
        )}
        {screen === "questComplete" && (
          <QuestCompleteScreen quest={quest} game={game} setScreen={setScreen} />
        )}
      </div>
      {["dashboard", "map", "quest", "passport", "raya"].includes(screen) && (
        <BottomNav screen={screen} setScreen={setScreen} />
      )}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-950 text-stone-50 text-sm font-medium px-4 py-2.5 rounded-full shadow-xl z-50 max-w-[90%] text-center">
          {toast}
        </div>
      )}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showAccess && <AccessModal accessibility={accessibility} setAccessibility={setAccessibility} onClose={() => setShowAccess(false)} />}
    </Shell>
  );
}

/* ============================== SHELL / SHARED ============================== */

function Shell({ children, accessibility }) {
  return (
    <div
      className={`font-body max-w-md mx-auto min-h-screen bg-stone-50 relative overflow-hidden ${accessibility.largeText ? "text-[1.06em]" : ""} ${accessibility.highContrast ? "contrast-125" : ""}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Work Sans', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(217,142,59,0.35);} 50% { box-shadow: 0 0 0 8px rgba(217,142,59,0);} }
        .pulse-glow { animation: pulseGlow 2.2s infinite; }
      `}</style>
      {children}
    </div>
  );
}

function Onboard({ step, total, children }) {
  return (
    <div className="min-h-screen bg-stone-50 px-6 pt-10 pb-8 flex flex-col">
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-emerald-600" : "bg-stone-200"}`} />
        ))}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ChoiceCard({ label, selected, onClick, wide }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border-2 p-4 font-semibold text-sm transition-all ${wide ? "text-left" : "text-center"} ${selected ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-stone-200 bg-white text-stone-700"}`}
    >
      {label}
    </button>
  );
}

function NextButton({ onClick, disabled, label = "Continue" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mt-8 w-full py-3.5 rounded-full font-bold transition-colors ${disabled ? "bg-stone-200 text-stone-400" : "bg-emerald-700 text-stone-50 hover:bg-emerald-800"}`}
    >
      {label}
    </button>
  );
}

/* ============================== DASHBOARD ============================== */

function Dashboard({ onboard, game, level, quest, discoveredCount, questTotal, nextAnimal, setScreen, openAnimal, setShowAbout, setShowAccess }) {
  return (
    <div>
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-stone-50 px-5 pt-8 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-emerald-300 text-xs font-mono">Ready to explore,</p>
            <h1 className="font-display text-2xl">{level.name}?</h1>
          </div>
          <button onClick={() => setShowAccess(true)} className="p-2 bg-emerald-800/60 rounded-full border border-emerald-700">
            <Accessibility size={18} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          <Stat icon={<Star size={14} className="text-amber-400" />} value={game.xp} label="XP" />
          <Stat icon={<Coins size={14} className="text-amber-400" />} value={game.coins} label="WildCoins" />
          <Stat icon={<Trophy size={14} className="text-amber-400" />} value={Object.keys(game.badges).length} label="Badges" />
        </div>
        <div className="h-2 bg-emerald-900 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${Math.round(level.progress * 100)}%` }} />
        </div>
        <p className="text-[11px] text-emerald-300 font-mono mt-1">{level.next ? `${level.next.min - game.xp} XP to ${level.next.name}` : "Max level reached"}</p>
      </div>

      <div className="px-5 -mt-3">
        <div className="bg-white rounded-2xl shadow-md p-4 border border-stone-200">
          <p className="text-[11px] font-mono uppercase tracking-wide text-emerald-600 font-bold mb-1">Current Quest</p>
          <h3 className="font-display text-lg text-emerald-950 mb-1">{quest?.title}</h3>
          <p className="text-xs text-stone-500 mb-3">{quest?.subtitle}</p>
          <div className="flex items-center justify-between text-xs font-mono text-stone-600 mb-1">
            <span>{discoveredCount} / {questTotal} animals discovered</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${questTotal ? (discoveredCount / questTotal) * 100 : 0}%` }} />
          </div>
          {nextAnimal ? (
            <button
              onClick={() => openAnimal(nextAnimal.id)}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-stone-50 font-bold py-3 rounded-full flex items-center justify-center gap-2"
            >
              Continue Adventure <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={() => setScreen("questComplete")} className="w-full bg-amber-500 text-emerald-950 font-bold py-3 rounded-full">
              View Quest Summary
            </button>
          )}
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <DashCard title="Interactive Map" desc="See zones & mystery spots" icon={<MapIcon size={18} />} onClick={() => setScreen("map")} />
        <DashCard title="Wildlife Passport" desc={`${Object.keys(game.discovered).length} collected`} icon={<BookOpen size={18} />} onClick={() => setScreen("passport")} />
      </div>

      <div className="px-5 mt-3">
        <StampCard rotate={-1} className="border-amber-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wide text-amber-700 font-bold mb-1">Today's Quest</p>
              <h4 className="font-display text-base text-emerald-950">The Seed Spreaders</h4>
              <p className="text-xs text-stone-500 mt-1">Find three animals that help forests regenerate by spreading seeds.</p>
            </div>
            <span className="text-2xl">🌱</span>
          </div>
          <div className="mt-2"><XPBadgeChip xp={300} /></div>
        </StampCard>
      </div>

      <div className="px-5 mt-4">
        <button onClick={() => setScreen("raya")} className="w-full flex items-center gap-3 bg-emerald-950 text-stone-50 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-lg">🦜</div>
          <div className="text-left flex-1">
            <p className="font-semibold text-sm">Ask Raya Anything</p>
            <p className="text-xs text-emerald-300">Your AI wildlife guide is nearby</p>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="px-5 mt-4 pb-2">
        <button onClick={() => setShowAbout(true)} className="w-full flex items-center justify-center gap-2 text-xs text-stone-400 font-medium py-2">
          <Info size={14} /> Why WildQuest? · How it's built
        </button>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="bg-emerald-800/50 rounded-xl p-2.5 border border-emerald-700 text-center">
      <div className="flex items-center justify-center gap-1 font-mono font-bold text-sm">{icon}{value}</div>
      <div className="text-[10px] text-emerald-300 mt-0.5">{label}</div>
    </div>
  );
}

function DashCard({ title, desc, icon, onClick }) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl border border-stone-200 p-4 text-left shadow-sm">
      <div className="text-emerald-700 mb-2">{icon}</div>
      <p className="font-bold text-sm text-emerald-950">{title}</p>
      <p className="text-[11px] text-stone-500 mt-0.5">{desc}</p>
    </button>
  );
}

/* ============================== MAP ============================== */

const PIN_POS = [
  { top: "18%", left: "22%" }, { top: "12%", left: "62%" }, { top: "34%", left: "78%" },
  { top: "46%", left: "15%" }, { top: "55%", left: "48%" }, { top: "68%", left: "72%" },
  { top: "78%", left: "28%" }, { top: "88%", left: "58%" },
];

function MapScreen({ quest, game, openAnimal, setScreen }) {
  const animals = quest ? quest.animalIds.map((id) => ANIMALS.find((a) => a.id === id)) : [];
  return (
    <div>
      <TopBar title="Park Map" right={<span className="text-[10px] font-mono text-stone-400">stylised prototype</span>} />
      <div className="relative mx-4 mt-2 rounded-3xl overflow-hidden border border-stone-200" style={{ height: 420 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50" />
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M10,10 Q40,40 30,50 T70,70 T90,90" stroke="#059669" strokeWidth="0.6" fill="none" strokeDasharray="2,2" />
          <path d="M60,10 Q50,30 78,35 T25,80" stroke="#059669" strokeWidth="0.6" fill="none" strokeDasharray="2,2" />
        </svg>
        <div className="absolute top-3 left-3 bg-white/90 rounded-full px-3 py-1 text-[10px] font-mono font-bold text-emerald-700 flex items-center gap-1">
          <Compass size={12} /> You are here
        </div>
        {animals.map((a, i) => {
          const pos = PIN_POS[i % PIN_POS.length];
          const done = game.discovered[a.id];
          return (
            <button
              key={a.id}
              onClick={() => openAnimal(a.id)}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center ${!done ? "pulse-glow" : ""}`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl shadow-lg border-2 ${done ? "bg-stone-200 border-stone-300" : "bg-white border-amber-400"}`}>
                {done ? <Check size={18} className="text-emerald-600" /> : a.emoji}
              </div>
              <span className="text-[9px] font-bold font-mono bg-emerald-950 text-white px-1.5 py-0.5 rounded mt-1">{a.zone}</span>
            </button>
          );
        })}
      </div>

      <div className="px-5 mt-4 space-y-2">
        <p className="text-[11px] font-mono uppercase tracking-wide text-stone-400 font-bold">Quest checkpoints</p>
        {animals.map((a) => {
          const done = game.discovered[a.id];
          return (
            <button
              key={a.id}
              onClick={() => openAnimal(a.id)}
              className={`w-full flex items-center gap-3 bg-white rounded-2xl border p-3 text-left ${done ? "border-stone-200 opacity-60" : "border-stone-200"}`}
            >
              <div className="text-2xl">{done ? "✅" : a.emoji}</div>
              <div className="flex-1">
                <p className="font-bold text-sm text-emerald-950">{done ? a.name : a.mystery ? "Mystery Location" : a.name}</p>
                <p className="text-[11px] text-stone-500 font-mono">{a.distance} away · {"★".repeat(a.difficulty)} · +100 XP</p>
              </div>
              <ChevronRight size={16} className="text-stone-300" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== QUEST TAB ============================== */

function QuestScreen({ quest, game, discoveredCount, questTotal, setScreen, openAnimal }) {
  const nextId = quest?.animalIds.find((id) => !game.discovered[id]);
  const next = ANIMALS.find((a) => a.id === nextId);
  return (
    <div className="px-5">
      <TopBar title="Your Quest" />
      <StampCard rotate={0} className="mt-2 border-emerald-300">
        <h2 className="font-display text-xl text-emerald-950">{quest?.title}</h2>
        <p className="text-sm text-stone-500 mt-1">{quest?.subtitle}</p>
        <div className="flex items-center gap-2 mt-3 font-mono text-xs text-emerald-700 font-bold">
          <Compass size={14} /> {discoveredCount} / {questTotal} discovered
        </div>
      </StampCard>

      {next && (
        <div className="mt-4">
          <p className="text-[11px] font-mono uppercase tracking-wide text-stone-400 font-bold mb-2">Recommended next</p>
          <button onClick={() => openAnimal(next.id)} className="w-full bg-emerald-950 text-stone-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="text-3xl">{next.mystery && !game.discovered[next.id] ? "❓" : next.emoji}</div>
            <div className="flex-1 text-left">
              <p className="font-bold">{next.zone}</p>
              <p className="text-xs text-emerald-300 font-mono">{next.distance} · {"★".repeat(next.difficulty)} · +100 XP</p>
            </div>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <div className="mt-5">
        <p className="text-[11px] font-mono uppercase tracking-wide text-stone-400 font-bold mb-2">Badges</p>
        <div className="grid grid-cols-3 gap-2">
          {BADGES.map((b) => {
            const unlocked = !!game.badges[b.id];
            return (
              <div key={b.id} className={`rounded-2xl p-3 text-center border ${unlocked ? "bg-amber-50 border-amber-300" : "bg-stone-100 border-stone-200"}`}>
                <div className="flex justify-center mb-1">{unlocked ? <Trophy size={18} className="text-amber-500" /> : <Lock size={16} className="text-stone-300" />}</div>
                <p className={`text-[10px] font-bold ${unlocked ? "text-emerald-950" : "text-stone-400"}`}>{b.name}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
}

/* ============================== ANIMAL FLOW ============================== */

function AnimalFlow({ animal, stage, setStage, clueIdx, setClueIdx, onGuess, onScan, onConfirm, onObserve, onQuiz, onConservation, onFinish, game }) {
  const [obsCountdown, setObsCountdown] = useState(5);
  const [obsChoice, setObsChoice] = useState(null);
  const [quizPicked, setQuizPicked] = useState(null);
  const [consPicked, setConsPicked] = useState(null);

  useEffect(() => {
    if (stage === "observe" && obsChoice === null) {
      if (obsCountdown <= 0) return;
      const t = setTimeout(() => setObsCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [stage, obsCountdown, obsChoice]);

  useEffect(() => { setObsCountdown(5); setObsChoice(null); setQuizPicked(null); setConsPicked(null); }, [stage === "clue"]);

  const quiz = QUIZ_BANK[animal.id];

  return (
    <div className="px-5 pb-24">
      <TopBar title={animal.mystery && stage === "clue" ? "Mystery Location" : animal.name} onBack={onFinish} />

      {stage === "clue" && (
        <div className="mt-2">
          <div className="bg-emerald-950 text-stone-50 rounded-2xl p-5">
            <p className="text-xs font-mono text-amber-300 mb-2">RAYA</p>
            <p className="font-display text-lg leading-snug">{animal.mystery[clueIdx]}</p>
          </div>
          {clueIdx < animal.mystery.length - 1 && (
            <button onClick={() => setClueIdx((i) => i + 1)} className="mt-3 w-full py-2.5 rounded-full border-2 border-emerald-600 text-emerald-700 font-semibold text-sm">
              Give me another clue
            </button>
          )}
          <p className="text-[11px] font-mono uppercase tracking-wide text-stone-400 font-bold mt-5 mb-2">Who is it?</p>
          <div className="grid grid-cols-2 gap-2">
            {animal.choices.map((c) => (
              <button
                key={c}
                onClick={() => (c === animal.name ? onGuess() : setStage("wrongGuess"))}
                className="rounded-2xl border-2 border-stone-200 bg-white p-3 text-sm font-semibold text-emerald-950"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === "wrongGuess" && (
        <div className="mt-6 text-center">
          <p className="text-4xl mb-3">🤔</p>
          <p className="font-display text-lg text-emerald-950">Not quite — but great thinking!</p>
          <p className="text-sm text-stone-500 mt-1">Here's another clue to help.</p>
          <button onClick={() => setStage("clue")} className="mt-5 w-full py-3 rounded-full bg-emerald-700 text-stone-50 font-bold">Try Again</button>
        </div>
      )}

      {stage === "travel" && (
        <div className="mt-6 text-center">
          <p className="text-5xl mb-4">🧭</p>
          <p className="font-display text-xl text-emerald-950">Heading to {animal.zone}</p>
          <p className="text-sm text-stone-500 font-mono mt-1">{animal.distance} away</p>
          <button onClick={onScan} className="mt-8 w-full py-3.5 rounded-full bg-emerald-700 text-stone-50 font-bold">I've Arrived</button>
        </div>
      )}

      {(stage === "scanning" || stage === "scan") && (
        <div className="mt-10 text-center">
          <button
            onClick={onScan}
            className="mx-auto w-40 h-40 rounded-3xl border-4 border-dashed border-emerald-400 flex flex-col items-center justify-center gap-2 text-emerald-700"
          >
            <ScanLine size={36} />
            <span className="text-xs font-bold">SCAN ANIMAL CODE</span>
          </button>
          {stage === "scanning" && <p className="text-sm text-stone-400 font-mono mt-4 animate-pulse">Scanning...</p>}
        </div>
      )}

      {stage === "discovered" && (
        <div className="mt-2">
          <div className="text-center mb-4">
            <p className="font-display text-2xl text-emerald-950">Animal Discovered!</p>
          </div>
          <AnimalCard animal={animal} />
          <div className="flex gap-2 mt-3">
            <XPBadgeChip xp={100} />
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
              <Coins size={12} /> +20 WildCoins
            </span>
          </div>
          <button onClick={onConfirm} className="mt-5 w-full py-3.5 rounded-full bg-emerald-700 text-stone-50 font-bold">Continue</button>
        </div>
      )}

      {stage === "observe" && (
        <div className="mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="font-display text-lg text-emerald-950">👀 Phone Down Challenge</p>
            <p className="text-sm text-stone-600 mt-1">Watch the {animal.name} for a few seconds — what do you notice?</p>
            {obsChoice === null && obsCountdown > 0 && (
              <p className="font-mono text-2xl text-amber-600 font-bold mt-3">{obsCountdown}</p>
            )}
          </div>
          {(obsCountdown <= 0 || obsChoice) && (
            <div className="mt-4">
              <p className="text-[11px] font-mono uppercase tracking-wide text-stone-400 font-bold mb-2">Wildlife Detective Challenge</p>
              <div className="grid grid-cols-2 gap-2">
                {OBSERVATIONS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setObsChoice(o)}
                    className={`rounded-2xl border-2 p-3 text-sm font-semibold ${obsChoice === o ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white"}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {obsChoice && (
                <div className="mt-4 bg-emerald-950 text-stone-50 rounded-2xl p-4">
                  <p className="text-xs font-mono text-amber-300 mb-1">RAYA</p>
                  <p className="text-sm leading-snug">{OBS_EXPLAIN[obsChoice]}</p>
                  <button onClick={onObserve} className="mt-4 w-full py-3 rounded-full bg-amber-500 text-emerald-950 font-bold">Continue (+50 XP)</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {stage === "quiz" && quiz && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-mono uppercase tracking-wide text-stone-400 font-bold">Quick Quiz</p>
            {game.quizCorrectStreak >= 2 && <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">🔥 On a streak — harder round!</span>}
          </div>
          <p className="font-display text-lg text-emerald-950 mb-3">{quiz.q}</p>
          <div className="space-y-2">
            {quiz.options.map((opt, i) => {
              const picked = quizPicked !== null;
              const isCorrect = i === quiz.correct;
              return (
                <button
                  key={opt}
                  disabled={picked}
                  onClick={() => setQuizPicked(i)}
                  className={`w-full text-left rounded-2xl border-2 p-3 text-sm font-semibold ${
                    picked
                      ? isCorrect ? "border-emerald-600 bg-emerald-50" : i === quizPicked ? "border-red-300 bg-red-50" : "border-stone-200 bg-white opacity-50"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {quizPicked !== null && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-emerald-900 mb-3">
                {quizPicked === quiz.correct ? "🎉 Nice one! You got it." : "Good try — every guess builds your instincts."}
              </p>
              <button onClick={() => onQuiz(quizPicked === quiz.correct)} className="w-full py-3 rounded-full bg-emerald-700 text-stone-50 font-bold">Continue</button>
            </div>
          )}
        </div>
      )}

      {stage === "conservation" && animal.conservation && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2 text-emerald-700"><Leaf size={16} /><p className="text-[11px] font-mono uppercase tracking-wide font-bold">Conservation Mission</p></div>
          <p className="font-display text-lg text-emerald-950 mb-1">{animal.conservation.title}</p>
          <p className="text-sm text-stone-600 mb-3">{animal.conservation.q}</p>
          <div className="space-y-2">
            {animal.conservation.options.map((opt, i) => (
              <button
                key={opt}
                disabled={consPicked !== null}
                onClick={() => setConsPicked(i)}
                className={`w-full text-left rounded-2xl border-2 p-3 text-sm font-semibold ${consPicked !== null ? (i === animal.conservation.correct ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white opacity-50") : "border-stone-200 bg-white"}`}
              >
                {opt}
              </button>
            ))}
          </div>
          {consPicked !== null && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <p className="text-sm text-emerald-900 font-semibold">Great choice!</p>
              <p className="text-xs text-emerald-800 mt-1">{animal.conservation.note}</p>
              <button onClick={onConservation} className="mt-3 w-full py-3 rounded-full bg-emerald-700 text-stone-50 font-bold">Continue (+100 XP)</button>
            </div>
          )}
        </div>
      )}

      {stage === "reward" && (
        <div className="mt-8 text-center">
          <p className="text-5xl mb-3">🏆</p>
          <p className="font-display text-2xl text-emerald-950">Checkpoint complete!</p>
          <p className="text-sm text-stone-500 mt-1">{animal.name} added to your Wildlife Passport.</p>
          <button onClick={onFinish} className="mt-8 w-full py-3.5 rounded-full bg-amber-500 text-emerald-950 font-bold">Back to the Trail</button>
        </div>
      )}
    </div>
  );
}

function AnimalCard({ animal }) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
      <div className={`h-32 flex items-center justify-center text-6xl bg-gradient-to-br ${RARITY_STYLE[animal.rarity] || "from-emerald-400 to-emerald-600"}`}>
        {animal.emoji}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-emerald-950">{animal.name}</h3>
          <span className="text-[10px] font-mono font-bold bg-stone-100 px-2 py-1 rounded-full text-stone-500">{animal.rarity}</span>
        </div>
        <p className="text-xs italic text-stone-400 font-mono">{animal.sci}</p>
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <InfoRow label="Habitat" value={animal.habitat} />
          <InfoRow label="Diet" value={animal.diet} />
          <InfoRow label="Status" value={animal.status} />
          <InfoRow label="Threat" value={animal.threat} />
        </div>
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-[10px] font-mono uppercase font-bold text-amber-700 mb-1">Interesting Fact</p>
          <p className="text-xs text-emerald-900">{animal.fact}</p>
        </div>
        <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <p className="text-[10px] font-mono uppercase font-bold text-emerald-700 mb-1">What Helps</p>
          <p className="text-xs text-emerald-900">{animal.help}</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="bg-stone-50 rounded-lg p-2">
      <p className="text-[9px] font-mono uppercase text-stone-400 font-bold">{label}</p>
      <p className="text-[11px] text-emerald-950 font-medium leading-tight">{value}</p>
    </div>
  );
}

/* ============================== PASSPORT ============================== */

function PassportScreen({ quest, game, setScreen }) {
  return (
    <div className="px-5">
      <TopBar title="Wildlife Passport" />
      <p className="text-xs text-stone-500 -mt-1 mb-4">{Object.keys(game.discovered).length} of {ANIMALS.length} species collected across Mandai.</p>
      <div className="grid grid-cols-2 gap-3">
        {ANIMALS.map((a) => {
          const found = !!game.discovered[a.id];
          return (
            <StampCard key={a.id} rotate={found ? (a.id.length % 2 ? 1.5 : -1.5) : 0} className={found ? "border-emerald-300" : "border-stone-200 opacity-60"}>
              <div className="text-3xl text-center mb-1">{found ? a.emoji : "❔"}</div>
              <p className="text-center text-xs font-bold text-emerald-950">{found ? a.name : "???"}</p>
              {found && (
                <>
                  <p className="text-center text-[9px] font-mono text-stone-400 mt-0.5">{a.rarity}</p>
                  <div className="flex justify-center gap-1 mt-1.5">
                    <Check size={11} className="text-emerald-600" />
                    <span className="text-[9px] text-emerald-700">Observed</span>
                  </div>
                </>
              )}
            </StampCard>
          );
        })}
      </div>
      <div className="h-20" />
    </div>
  );
}

/* ============================== RAYA ============================== */

function RayaScreen({ animal, log, loading, onAsk, setScreen }) {
  const [input, setInput] = useState("");
  const suggestions = [
    "Why does this animal do that?",
    "What is its weirdest behaviour?",
    "How intelligent is it?",
    "What would happen if this species disappeared?",
  ];
  return (
    <div className="px-5 flex flex-col" style={{ minHeight: "70vh" }}>
      <TopBar title="Raya, Your Guide" />
      <div className="flex items-center gap-3 bg-emerald-950 text-stone-50 rounded-2xl p-4 mt-2">
        <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-2xl">🦜</div>
        <div>
          <p className="font-display text-lg">Raya</p>
          <p className="text-xs text-emerald-300">Currently exploring near the {animal.zone}</p>
        </div>
      </div>

      <div className="flex-1 mt-4 space-y-3 overflow-y-auto">
        {log.length === 0 && (
          <p className="text-sm text-stone-400 text-center mt-6">Ask Raya anything about the {animal.name}, or pick a question below.</p>
        )}
        {log.map((entry, i) =>
          entry.role === "user" ? (
            <div key={i} className="ml-auto max-w-[85%] bg-emerald-100 text-emerald-950 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">{entry.text}</div>
          ) : (
            <div key={i} className="mr-auto max-w-[90%] bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-emerald-950">
              <p className="text-[10px] font-mono font-bold text-amber-600 mb-1">RAYA · {entry.animal}</p>
              {entry.text}
            </div>
          )
        )}
        {loading && <div className="text-xs text-stone-400 font-mono">Raya is thinking...</div>}
      </div>

      <div className="flex flex-wrap gap-2 my-3">
        {suggestions.map((s) => (
          <button key={s} onClick={() => onAsk(s, animal)} className="text-xs font-semibold bg-white border border-stone-200 rounded-full px-3 py-1.5 text-emerald-800">
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2 pb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { onAsk(input, animal); setInput(""); } }}
          placeholder="Ask Raya anything..."
          className="flex-1 rounded-full border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => { if (input.trim()) { onAsk(input, animal); setInput(""); } }}
          className="bg-emerald-700 text-stone-50 rounded-full px-4 font-bold text-sm"
        >
          Ask
        </button>
      </div>
    </div>
  );
}

/* ============================== QUEST COMPLETE ============================== */

function QuestCompleteScreen({ quest, game, setScreen }) {
  const discovered = quest ? quest.animalIds.filter((id) => game.discovered[id]).length : 0;
  return (
    <div className="px-6 pt-16 text-center">
      <p className="text-6xl mb-4">🎊</p>
      <h1 className="font-display text-3xl text-emerald-950">Quest Complete!</h1>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <SummaryStat label="Animals discovered" value={discovered} />
        <SummaryStat label="Knowledge gained" value={`${game.xp} XP`} />
        <SummaryStat label="Observation missions" value={game.observationsDone} />
        <SummaryStat label="Conservation missions" value={game.conservationDone} />
      </div>
      <StampCard rotate={-2} className="mt-6 border-amber-300">
        <p className="font-display text-lg text-emerald-950">"You didn't just visit the wildlife park.</p>
        <p className="font-display text-lg text-emerald-950">You explored it."</p>
      </StampCard>
      <button onClick={() => setScreen("dashboard")} className="mt-8 w-full py-3.5 rounded-full bg-emerald-700 text-stone-50 font-bold">
        Back to Dashboard
      </button>
    </div>
  );
}

function SummaryStat({ label, value }) {
  return (
    <div className="bg-stone-100 rounded-2xl p-4">
      <p className="font-mono font-bold text-xl text-emerald-950">{value}</p>
      <p className="text-[10px] text-stone-500 mt-0.5">{label}</p>
    </div>
  );
}

/* ============================== ABOUT / ACCESSIBILITY MODALS ============================== */

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-stone-50 rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-emerald-950">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-full bg-stone-200"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AboutModal({ onClose }) {
  return (
    <ModalShell title="Why WildQuest?" onClose={onClose}>
      <div className="space-y-4 text-sm text-stone-700">
        <div>
          <p className="font-bold text-emerald-950 mb-1">The Problem</p>
          <p>Visitors can become passive observers, and a fixed signboard can't personalise itself to a 6-year-old and their grandparent standing side by side.</p>
        </div>
        <div>
          <p className="font-bold text-emerald-950 mb-1">The Idea</p>
          <p>WildQuest turns a Mandai visit into a personalised AI wildlife adventure — missions, mysteries and a Wildlife Passport built around what each guest actually cares about.</p>
        </div>
        <div>
          <p className="font-bold text-emerald-950 mb-1">Core Principle: Heads Up, Not Heads Down</p>
          <p>Every mechanic points back at the real animal — clues send you to the exhibit, observation challenges ask you to actually watch it, and rewards come from exploring, not from staring at a screen.</p>
        </div>
        <div>
          <p className="font-bold text-emerald-950 mb-1">Why AI</p>
          <p>Raya's answers and personalised quests are generated live, so the same park becomes a different learning experience for a curious teen, a school group, or a grandparent — not one script for everyone.</p>
        </div>
        <div>
          <p className="font-bold text-emerald-950 mb-1">Prototype vs. Production</p>
          <p className="mb-2">This build is a functional prototype: the map is stylised, QR scanning and camera recognition are simulated, and crowd/weather adaptation is illustrative.</p>
          <p className="font-bold text-emerald-900 text-xs uppercase font-mono mt-3 mb-1">Proposed AWS architecture</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><b>Amazon Bedrock</b> — Raya's conversation, adaptive quizzes, personalised quests</li>
            <li><b>Amazon Rekognition</b> — "What am I looking at?" real image recognition</li>
            <li><b>AWS Lambda</b> — quest generation & reward logic</li>
            <li><b>Amazon DynamoDB</b> — visitor progress, passport, achievements</li>
            <li><b>Amazon Location Service</b> — real navigation & location-based quests</li>
            <li><b>Amazon S3 + CloudFront</b> — animal media delivery</li>
          </ul>
          <p className="text-[11px] text-stone-400 mt-2">These services are proposed for production, not integrated in this prototype.</p>
        </div>
        <div>
          <p className="font-bold text-emerald-950 mb-1">Privacy</p>
          <p>Guest mode requires no personal information. Location is only used for on-park navigation, and any future analytics would be anonymised and aggregated.</p>
        </div>
      </div>
    </ModalShell>
  );
}

function AccessModal({ accessibility, setAccessibility, onClose }) {
  const opts = [
    { id: "largeText", label: "Large Text", icon: Type },
    { id: "highContrast", label: "High Contrast", icon: Contrast },
    { id: "reduceMotion", label: "Reduced Motion", icon: Accessibility },
  ];
  return (
    <ModalShell title="Accessibility" onClose={onClose}>
      <div className="space-y-2">
        {opts.map((o) => {
          const Icon = o.icon;
          const on = accessibility[o.id];
          return (
            <button
              key={o.id}
              onClick={() => setAccessibility((a) => ({ ...a, [o.id]: !a[o.id] }))}
              className={`w-full flex items-center justify-between rounded-2xl border-2 p-3 ${on ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white"}`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-emerald-950"><Icon size={16} />{o.label}</span>
              <div className={`w-9 h-5 rounded-full flex items-center px-0.5 ${on ? "bg-emerald-600 justify-end" : "bg-stone-300 justify-start"}`}>
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </button>
          );
        })}
        <p className="text-[11px] text-stone-400 mt-2 flex items-center gap-1"><Volume2 size={12} /> Audio narration, simplified language and wheelchair-friendly routing are planned for the production build.</p>
      </div>
    </ModalShell>
  );
}
