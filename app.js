const PROFILE_WEIGHT_KG = 75;

const dayTypes = {
  daily: {
    label: "日常",
    status: "日常方案 F",
    water: "2-2.5L 水",
    bananaDefault: false,
    proteinDefault: false,
    lead: "按优化版基础饮食执行，不主动加香蕉和主食缓冲。",
    actions: [
      "早餐吃麦片100g + 牛奶125ml + 鸡蛋1个。",
      "第二餐用鸡胸150g + 鸭胸100g；想省事可按天轮换。",
      "第三餐按方案F吃鸡蛋4个。",
      "今天不主动加香蕉，不主动加50g主食缓冲。"
    ]
  },
  run: {
    label: "跑步",
    status: "跑前香蕉",
    water: "2.5-3L 水",
    bananaDefault: true,
    proteinDefault: true,
    lead: "5km 跑步日先补香蕉，恢复压力大时第三餐升到 K。",
    actions: [
      "跑前30-60分钟吃1根香蕉。",
      "第三餐默认升到K：鸡蛋3个 + 鸡胸100g。",
      "第二餐仍只吃一份主食，不把土豆和米饭完整叠加。",
      "跑后超过1小时仍腿沉，再打开50g主食缓冲。"
    ]
  },
  strength: {
    label: "力量",
    status: "看训练状态",
    water: "2.3-2.8L 水",
    bananaDefault: false,
    proteinDefault: false,
    lead: "力量日先用方案 F；训练掉力或恢复差时再开 K 和主食缓冲。",
    actions: [
      "先按方案F执行，蛋白质已经覆盖日常保肌。",
      "如果今天训练明显掉力，打开50g主食缓冲。",
      "如果连续疲劳、睡眠差或酸痛明显，第三餐升到K。",
      "训练后先补水，再判断是否需要额外主食。"
    ]
  },
  rest: {
    label: "休息",
    status: "保留赤字",
    water: "2-2.5L 水",
    bananaDefault: false,
    proteinDefault: false,
    lead: "休息日保持简单，不追求高碳水，重点是蛋白质和饮水。",
    actions: [
      "照日常方案F吃，第三餐不要省。",
      "香蕉可不加，保留更大的热量赤字。",
      "主食只吃一份，不启用50g缓冲。",
      "如果饥饿明显，优先加蔬菜或番茄黄瓜。"
    ]
  }
};

const staples = {
  rice: {
    label: "糙米",
    kcal: 1308,
    protein: 108.8,
    carbs: 108,
    fat: 50.0,
    secondMeal: "鸡胸150g + 鸭胸100g · 糙米100g",
    description: "糙米基础日"
  },
  potato: {
    label: "土豆",
    kcal: 1318,
    protein: 108.8,
    carbs: 115,
    fat: 50.0,
    secondMeal: "鸡胸150g + 鸭胸100g · 土豆150g",
    description: "土豆基础日"
  },
  mixed: {
    label: "混搭",
    kcal: 1313,
    protein: 108.8,
    carbs: 112,
    fat: 50.0,
    secondMeal: "鸡胸150g + 鸭胸100g · 主食混搭",
    description: "主食混搭日"
  }
};

const breakfasts = {
  balanced: {
    label: "平衡早餐",
    shortLabel: "平衡",
    meal: "麦片100g + 牛奶125ml + 鸡蛋1个",
    hint: "保留口感和钙，减少牛奶成本。",
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  },
  milk: {
    label: "保留牛奶",
    shortLabel: "牛奶",
    meal: "麦片100g + 牛奶250ml",
    hint: "操作最简单，但蛋白质性价比最低。",
    kcal: 5,
    protein: -2.2,
    carbs: 4.5,
    fat: -1.9
  },
  eggs: {
    label: "不用牛奶",
    shortLabel: "鸡蛋",
    meal: "麦片100g + 鸡蛋2个",
    hint: "更便宜、蛋白更高，但鸡蛋数量增加。",
    kcal: -5,
    protein: 2.2,
    carbs: -4.5,
    fat: 1.9
  }
};

const banana = { kcal: 105, protein: 1.3, carbs: 27, fat: 0.3 };
const buffer = { kcal: 45, protein: 0, carbs: 10, fat: 0 };
const planKDelta = { kcal: 74, protein: 16.8, carbs: -0.5, fat: -1.1 };

const knowledgeItems = [
  {
    id: "plan",
    type: "总表",
    title: "当前总控",
    summary: "日常默认方案F，跑步日先加香蕉，恢复压力大时再升到K。主食保持一份，状态差时才加50g熟重缓冲。",
    facts: [
      ["日常蛋白", "约108.8g，约1.45g/kg"],
      ["跑步日", "香蕉 + 可选K，碳水约142g起"],
      ["主食缓冲", "只在腿沉、训练掉力、跑后疲劳时启用"]
    ],
    note: "来源：总表-v4。页面已把常用结论压缩成执行规则。"
  },
  {
    id: "protein",
    type: "蛋白质",
    title: "F/K 蛋白档",
    summary: "方案F是日常默认，方案K是触发档。牛奶不作为主要蛋白性价比来源，早餐用牛奶125ml + 鸡蛋1个更平衡。",
    facts: [
      ["方案F", "鸡蛋4个，日常够用"],
      ["方案K", "鸡蛋3个 + 鸡胸100g，用于跑步或高疲劳"],
      ["牛奶替换", "综合最优是牛奶125ml + 鸡蛋1个"]
    ],
    note: "来源：蛋白质补充方案、采购价格与替换规则。"
  },
  {
    id: "staple",
    type: "主食",
    title: "主食与混搭",
    summary: "土豆、糙米、紫薯可以混搭，但总量仍按一份主食额度控制。混搭是拆分，不是叠加。",
    facts: [
      ["糙米", "100g熟重约一份"],
      ["土豆", "150g熟重约一份"],
      ["缓冲", "额外50g熟重只在训练状态差时加"]
    ],
    note: "来源：主食健康饮食指南。"
  },
  {
    id: "hydration",
    type: "饮水",
    title: "饮水规则",
    summary: "饮水目标跟当天训练走。跑步日提高到2.5-3L，跑后小口慢饮，不要一次猛灌。",
    facts: [
      ["日常/休息", "2-2.5L"],
      ["力量日", "2.3-2.8L"],
      ["跑步日", "2.5-3L"]
    ],
    note: "来源：每日饮水完整指南。"
  },
  {
    id: "prep",
    type: "备餐",
    title: "鸡鸭胸搭配",
    summary: "每天混搭时用鸡胸150g + 鸭胸100g。若想减少称重，按鸡胸4天、鸭胸3天轮换即可。",
    facts: [
      ["每天混", "鸡胸150g + 鸭胸100g"],
      ["按天轮换", "鸡胸4天 + 鸭胸3天"],
      ["成本", "优化版蛋白食材约8元/天"]
    ],
    note: "来源：采购价格与替换规则。"
  }
];

const state = {
  view: "today",
  day: "daily",
  staple: "potato",
  breakfast: "balanced",
  banana: false,
  buffer: false,
  proteinK: false,
  knowledge: "plan"
};

const els = {
  viewControls: document.querySelector("#viewControls"),
  viewPanels: document.querySelectorAll("[data-view-panel]"),
  settingsSummary: document.querySelector("#settingsSummary"),
  dayControls: document.querySelector("#dayTypeControls"),
  stapleControls: document.querySelector("#stapleControls"),
  breakfastControls: document.querySelector("#breakfastControls"),
  bananaToggle: document.querySelector("#bananaToggle"),
  bufferToggle: document.querySelector("#bufferToggle"),
  proteinToggle: document.querySelector("#proteinToggle"),
  plannerLead: document.querySelector("#plannerLead"),
  waterTarget: document.querySelector("#waterTarget"),
  todayTitle: document.querySelector("#todayTitle"),
  todaySummary: document.querySelector("#todaySummary"),
  statusPill: document.querySelector("#statusPill"),
  kcalValue: document.querySelector("#kcalValue"),
  proteinValue: document.querySelector("#proteinValue"),
  carbValue: document.querySelector("#carbValue"),
  fatValue: document.querySelector("#fatValue"),
  proteinBar: document.querySelector("#proteinBar"),
  carbBar: document.querySelector("#carbBar"),
  proteinRatio: document.querySelector("#proteinRatio"),
  carbRatio: document.querySelector("#carbRatio"),
  firstMealText: document.querySelector("#firstMealText"),
  firstMealHint: document.querySelector("#firstMealHint"),
  secondMealText: document.querySelector("#secondMealText"),
  thirdMealText: document.querySelector("#thirdMealText"),
  thirdMealHint: document.querySelector("#thirdMealHint"),
  actionList: document.querySelector("#actionList"),
  knowledgeTabs: document.querySelector("#knowledgeTabs"),
  knowledgeType: document.querySelector("#knowledgeType"),
  knowledgeTitle: document.querySelector("#knowledgeTitle"),
  knowledgeSummary: document.querySelector("#knowledgeSummary"),
  knowledgeFacts: document.querySelector("#knowledgeFacts"),
  knowledgeNote: document.querySelector("#knowledgeNote")
};

function round(value, digits = 0) {
  return Number(value.toFixed(digits));
}

function formatDecimal(value) {
  return value.toFixed(1);
}

function calculate() {
  const staple = staples[state.staple];
  const breakfast = breakfasts[state.breakfast];
  const total = { ...staple };

  total.kcal += breakfast.kcal;
  total.protein += breakfast.protein;
  total.carbs += breakfast.carbs;
  total.fat += breakfast.fat;

  if (state.banana) {
    total.kcal += banana.kcal;
    total.protein += banana.protein;
    total.carbs += banana.carbs;
    total.fat += banana.fat;
  }

  if (state.buffer) {
    total.kcal += buffer.kcal;
    total.carbs += buffer.carbs;
  }

  if (state.proteinK) {
    total.kcal += planKDelta.kcal;
    total.protein += planKDelta.protein;
    total.carbs += planKDelta.carbs;
    total.fat += planKDelta.fat;
  }

  return total;
}

function setActive(container, attr, value) {
  container.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset[attr] === value);
  });
}

function renderPlanner() {
  const day = dayTypes[state.day];
  const staple = staples[state.staple];
  const breakfast = breakfasts[state.breakfast];
  const total = calculate();
  const proteinRatio = total.protein / PROFILE_WEIGHT_KG;
  const carbRatio = total.carbs / PROFILE_WEIGHT_KG;
  const proteinPercent = Math.min(100, Math.max(18, (proteinRatio / 1.8) * 100));
  const carbPercent = Math.min(100, Math.max(18, (carbRatio / 2.2) * 100));

  els.plannerLead.textContent = day.lead;
  els.waterTarget.textContent = day.water;
  els.todayTitle.textContent = `${day.label} · ${staple.label}主食`;
  els.statusPill.textContent = state.proteinK ? "已启用 K" : day.status;
  els.settingsSummary.textContent = `${day.label} · ${staple.label} · ${breakfast.shortLabel} · ${state.proteinK ? "K" : "F"} · ${state.banana ? "香蕉" : "无香蕉"}${state.buffer ? " · 50g缓冲" : ""}`;
  els.todaySummary.textContent = `${staple.description}，早餐为${breakfast.label}，第三餐${state.proteinK ? "启用K" : "使用F"}，${state.banana ? "已计入香蕉" : "未计入香蕉"}，${state.buffer ? "已加50g主食缓冲" : "未加主食缓冲"}。`;

  els.kcalValue.textContent = round(total.kcal);
  els.proteinValue.textContent = formatDecimal(total.protein);
  els.carbValue.textContent = round(total.carbs);
  els.fatValue.textContent = formatDecimal(total.fat);
  els.proteinRatio.textContent = `${formatDecimal(proteinRatio)} g/kg`;
  els.carbRatio.textContent = `${formatDecimal(carbRatio)} g/kg`;
  els.proteinBar.style.width = `${proteinPercent}%`;
  els.carbBar.style.width = `${carbPercent}%`;
  els.firstMealText.textContent = breakfast.meal;
  els.firstMealHint.textContent = breakfast.hint;
  els.secondMealText.textContent = staple.secondMeal;
  els.thirdMealText.textContent = state.proteinK ? "方案 K：鸡蛋3个 + 鸡胸100g" : "方案 F：鸡蛋4个";
  els.thirdMealHint.textContent = state.proteinK ? "今天属于跑步、高疲劳或恢复压力日。" : "跑步、力量明显累或睡眠差时再升到K。";

  const actions = [...day.actions];
  if (state.day !== "run" && state.banana) {
    actions.unshift("你已手动计入香蕉，把这105 kcal当作计划内加餐。");
  }
  if (state.day === "run" && !state.banana) {
    actions.unshift("跑步日建议打开香蕉，当前碳水会偏紧。");
  }
  if (state.proteinK && state.day === "daily") {
    actions.unshift("日常日通常不需要K；若今天疲劳明显再保留。");
  }
  if (state.buffer) {
    actions.push("50g缓冲已计入。晚上观察饥饿感、腿沉和恢复速度。");
  }

  els.actionList.innerHTML = actions.map((item) => `<li>${item}</li>`).join("");
}

function renderView() {
  els.viewControls.querySelectorAll("button").forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  els.viewPanels.forEach((panel) => {
    const active = panel.dataset.viewPanel === state.view;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderKnowledgeTabs() {
  els.knowledgeTabs.innerHTML = knowledgeItems.map((item) => (
    `<button type="button" data-knowledge="${item.id}">${item.type}</button>`
  )).join("");
}

function renderKnowledge() {
  const item = knowledgeItems.find((entry) => entry.id === state.knowledge) || knowledgeItems[0];
  els.knowledgeTabs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.knowledge === item.id);
  });
  els.knowledgeType.textContent = item.type;
  els.knowledgeTitle.textContent = item.title;
  els.knowledgeSummary.textContent = item.summary;
  els.knowledgeFacts.innerHTML = item.facts.map(([term, detail]) => (
    `<div><dt>${term}</dt><dd>${detail}</dd></div>`
  )).join("");
  els.knowledgeNote.textContent = item.note;
}

els.dayControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-day]");
  if (!button) return;
  const day = dayTypes[button.dataset.day];
  state.day = button.dataset.day;
  state.banana = day.bananaDefault;
  state.proteinK = day.proteinDefault;
  els.bananaToggle.checked = state.banana;
  els.proteinToggle.checked = state.proteinK;
  setActive(els.dayControls, "day", state.day);
  renderPlanner();
});

els.stapleControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-staple]");
  if (!button) return;
  state.staple = button.dataset.staple;
  setActive(els.stapleControls, "staple", state.staple);
  renderPlanner();
});

els.breakfastControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-breakfast]");
  if (!button) return;
  state.breakfast = button.dataset.breakfast;
  setActive(els.breakfastControls, "breakfast", state.breakfast);
  renderPlanner();
});

els.bananaToggle.addEventListener("change", () => {
  state.banana = els.bananaToggle.checked;
  renderPlanner();
});

els.bufferToggle.addEventListener("change", () => {
  state.buffer = els.bufferToggle.checked;
  renderPlanner();
});

els.proteinToggle.addEventListener("change", () => {
  state.proteinK = els.proteinToggle.checked;
  renderPlanner();
});

els.knowledgeTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-knowledge]");
  if (!button) return;
  state.knowledge = button.dataset.knowledge;
  renderKnowledge();
});

els.viewControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  state.view = button.dataset.view;
  renderView();
});

renderKnowledgeTabs();
renderPlanner();
renderKnowledge();
renderView();
