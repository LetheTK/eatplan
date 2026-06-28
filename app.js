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
    status: "按状态补碳",
    water: "2.5-3L 水",
    bananaDefault: false,
    proteinDefault: false,
    lead: "5km 慢跑不固定加碳水；空腹、间隔久、恢复慢时再补。",
    actions: [
      "状态正常的5km慢跑，不必固定加香蕉。",
      "空腹跑、距上一餐超过4小时、跑后1小时仍腿沉时，再补碳。",
      "补碳可选香蕉1根，或土豆100g、糙米饭75-100g、紫薯80-100g。",
      "跑后或力量后正好吃饭时，可用1个玉米馒头替代本餐主食。",
      "第三餐先按方案F；当天还做力量或连续疲劳时再升到K。",
      "第二餐仍只吃一份主食，不把土豆和米饭完整叠加。"
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
      "训练日吃1个玉米馒头可以，但把它当本餐主食，不再叠加米饭或土豆。",
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
    secondMeal: "鸡胸150g + 鸭胸100g · 蔬菜200g · 糙米100g · 橄榄油1汤匙",
    description: "糙米基础日"
  },
  potato: {
    label: "土豆",
    kcal: 1318,
    protein: 108.8,
    carbs: 115,
    fat: 50.0,
    secondMeal: "鸡胸150g + 鸭胸100g · 蔬菜200g · 土豆150g · 橄榄油1汤匙",
    description: "土豆基础日"
  },
  mixed: {
    label: "混搭",
    kcal: 1313,
    protein: 108.8,
    carbs: 112,
    fat: 50.0,
    secondMeal: "鸡胸150g + 鸭胸100g · 蔬菜200g · 主食混搭 · 橄榄油1汤匙",
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
const STORAGE_KEY = "eatplan.dashboard.state.v1";

const garlicBases = {
  olivePowder: "橄榄油 + 蒜粉",
  oliveFresh: "橄榄油 + 鲜蒜",
  infusedGarlic: "油浸蒜",
  none: "暂不选蒜香基底"
};

const braiseOptionLabels = {
  tomato: "番茄",
  water: "清水",
  salt: "盐",
  parsleyGarlicSalt: "欧芹大蒜盐",
  blackPepper: "黑胡椒",
  onionPowder: "洋葱粉",
  parsley: "欧芹碎",
  thyme: "百里香",
  basil: "罗勒",
  soySauce: "生抽",
  oysterSauce: "蚝油",
  guizhouDip: "贵州蘸水",
  sesameOil: "香油"
};

const validBraiseOptions = Object.keys(braiseOptionLabels);

const knowledgeItems = [
  {
    id: "plan",
    type: "总表",
    title: "当前总控",
    summary: "日常默认方案F，5km慢跑不固定加碳水；空腹、距上一餐久、跑后恢复慢或叠加力量时再补。主食保持一份，额外补碳单独计入。",
    facts: [
      ["日常蛋白", "约108.8g，约1.45g/kg"],
      ["补碳触发", "空腹、间隔超过4小时、跑后1小时仍腿沉、叠加力量"],
      ["换算", "香蕉1根 ≈ 土豆100g / 糙米饭75-100g / 紫薯80-100g"],
      ["玉米馒头", "训练日可用1个替代正餐主食，不和米饭土豆叠加"]
    ],
    note: "来源：总表-v4。页面已把常用结论压缩成执行规则。"
  },
  {
    id: "protein",
    type: "蛋白质",
    title: "F/K 蛋白档",
    summary: "方案F是日常默认，方案K是触发档。跑步日先看是否需要补碳，不默认靠K解决；早餐用牛奶125ml + 鸡蛋1个更平衡。",
    facts: [
      ["方案F", "鸡蛋4个，日常够用"],
      ["方案K", "鸡蛋3个 + 鸡胸100g，用于跑步叠加力量或高疲劳"],
      ["牛奶替换", "综合最优是牛奶125ml + 鸡蛋1个"]
    ],
    note: "来源：蛋白质补充方案、采购价格与替换规则。"
  },
  {
    id: "staple",
    type: "主食",
    title: "主食与混搭",
    summary: "土豆、糙米、紫薯可以混搭。混搭相当于把轮换放进同一餐，兼顾营养互补、肠道菌群多样性和执行口感。",
    facts: [
      ["糙米", "100g熟重约一份"],
      ["土豆", "150g熟重约一份"],
      ["玉米馒头", "1个约75g、196 kcal、40g碳水，算一份偏大主食"],
      ["混搭", "在一份主食额度内拆分，不是叠加"],
      ["轮换价值", "营养互补 + 肠道菌群多样性 + 减少厌倦"],
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

const defaultState = {
  view: "today",
  mobilePanel: "settings",
  day: "daily",
  staple: "potato",
  breakfast: "balanced",
  banana: false,
  buffer: false,
  proteinK: false,
  knowledge: "plan",
  braiseGarlicBase: "olivePowder",
  braiseOptions: []
};

function readSavedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return {};

    const next = {};
    if (["today", "braise", "rules"].includes(saved.view)) next.view = saved.view;
    if (saved.view === "knowledge") next.view = "rules";
    if (["settings", "meals", "totals"].includes(saved.mobilePanel)) next.mobilePanel = saved.mobilePanel;
    if (dayTypes[saved.day]) next.day = saved.day;
    if (staples[saved.staple]) next.staple = saved.staple;
    if (breakfasts[saved.breakfast]) next.breakfast = saved.breakfast;
    if (knowledgeItems.some((item) => item.id === saved.knowledge)) next.knowledge = saved.knowledge;
    if (garlicBases[saved.braiseGarlicBase]) next.braiseGarlicBase = saved.braiseGarlicBase;
    if (Array.isArray(saved.braiseOptions)) {
      next.braiseOptions = saved.braiseOptions.filter((option) => validBraiseOptions.includes(option));
    }
    ["banana", "buffer", "proteinK"].forEach((key) => {
      if (typeof saved[key] === "boolean") next[key] = saved[key];
    });
    return next;
  } catch {
    return {};
  }
}

const state = {
  ...defaultState,
  ...readSavedState()
};

const els = {
  viewControls: document.querySelector("#viewControls"),
  viewPanels: document.querySelectorAll("[data-view-panel]"),
  mobileBottomNav: document.querySelector("#mobileBottomNav"),
  mobileSectionTabs: document.querySelector("#mobileSectionTabs"),
  mobilePanels: document.querySelectorAll("[data-mobile-panel-content]"),
  mobileDietHint: document.querySelector("#mobileDietHint"),
  mobileTotalHint: document.querySelector("#mobileTotalHint"),
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
  dailyTipTitle: document.querySelector("#dailyTipTitle"),
  dailyTipText: document.querySelector("#dailyTipText"),
  statusPill: document.querySelector("#statusPill"),
  nutritionList: document.querySelector("#nutritionList"),
  proteinRatioBar: document.querySelector("#proteinRatioBar"),
  carbRatioBar: document.querySelector("#carbRatioBar"),
  proteinRatio: document.querySelector("#proteinRatio"),
  carbRatio: document.querySelector("#carbRatio"),
  firstMealText: document.querySelector("#firstMealText"),
  firstMealHint: document.querySelector("#firstMealHint"),
  firstMealMeta: document.querySelector("#firstMealMeta"),
  secondMealText: document.querySelector("#secondMealText"),
  secondMealMeta: document.querySelector("#secondMealMeta"),
  thirdMealText: document.querySelector("#thirdMealText"),
  thirdMealHint: document.querySelector("#thirdMealHint"),
  thirdMealMeta: document.querySelector("#thirdMealMeta"),
  knowledgeTabs: document.querySelector("#knowledgeTabs"),
  knowledgeType: document.querySelector("#knowledgeType"),
  knowledgeTitle: document.querySelector("#knowledgeTitle"),
  knowledgeSummary: document.querySelector("#knowledgeSummary"),
  knowledgeFacts: document.querySelector("#knowledgeFacts"),
  knowledgeNote: document.querySelector("#knowledgeNote"),
  braiseGarlicBaseControls: document.querySelector("#braiseGarlicBaseControls"),
  braiseSoupControls: document.querySelector("#braiseSoupControls"),
  braiseSpiceControls: document.querySelector("#braiseSpiceControls"),
  braiseStatusPill: document.querySelector("#braiseStatusPill"),
  braiseCountPill: document.querySelector("#braiseCountPill"),
  braiseFlavorTitle: document.querySelector("#braiseFlavorTitle"),
  braiseFlavorSummary: document.querySelector("#braiseFlavorSummary"),
  braiseAddList: document.querySelector("#braiseAddList"),
  braiseAvoidList: document.querySelector("#braiseAvoidList"),
  braiseCurrentText: document.querySelector("#braiseCurrentText")
};

function round(value, digits = 0) {
  return Number(value.toFixed(digits));
}

function formatDecimal(value) {
  return value.toFixed(1);
}

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      view: state.view,
      mobilePanel: state.mobilePanel,
      day: state.day,
      staple: state.staple,
      breakfast: state.breakfast,
      banana: state.banana,
      buffer: state.buffer,
      proteinK: state.proteinK,
      knowledge: state.knowledge,
      braiseGarlicBase: state.braiseGarlicBase,
      braiseOptions: state.braiseOptions
    }));
  } catch {
    // localStorage may be unavailable in restricted browser modes.
  }
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

function syncControls() {
  setActive(els.dayControls, "day", state.day);
  setActive(els.stapleControls, "staple", state.staple);
  setActive(els.breakfastControls, "breakfast", state.breakfast);
  setActive(els.braiseGarlicBaseControls, "garlicBase", state.braiseGarlicBase);
  syncBraiseOptionButtons();
  els.bananaToggle.checked = state.banana;
  els.bufferToggle.checked = state.buffer;
  els.proteinToggle.checked = state.proteinK;
}

function syncBraiseOptionButtons() {
  const selected = new Set(state.braiseOptions);
  [els.braiseSoupControls, els.braiseSpiceControls].forEach((container) => {
    container.querySelectorAll("button[data-braise-option]").forEach((button) => {
      const active = selected.has(button.dataset.braiseOption);
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  });
}

function assessmentClass(status) {
  if (status === "偏低") return "warn";
  if (status === "偏高") return "caution";
  return "good";
}

function buildMacroAssessment(total, proteinRatio, carbRatio) {
  const mixedLowCarbHint = state.staple === "mixed"
    ? "混搭本身没问题；训练状态差时加50g熟重缓冲。"
    : null;
  const protein = proteinRatio < 1.3
    ? ["偏低", "低于减脂保肌下限，优先开K或加蛋白。"]
    : proteinRatio > 1.7
      ? ["偏高", "已到高活动上沿，日常不用再加蛋白。"]
      : ["合理", "落在减脂保肌推荐区间。"];

  let carb;
  if (state.day === "run") {
    carb = carbRatio < 1.4
      ? ["偏低", mixedLowCarbHint || "跑步日碳水偏紧，建议补香蕉或一点主食。"]
      : carbRatio > 2.3
        ? ["偏高", "跑步日也不必继续加主食。"]
        : ["合理", "5km慢跑可用；空腹、间隔久或跑后恢复慢时再补碳。"];
  } else if (state.day === "strength") {
    carb = carbRatio < 1.5
      ? ["偏低", mixedLowCarbHint || "力量日可能影响训练状态，掉力时加50g主食。"]
      : carbRatio > 2.2
        ? ["偏高", "若非高疲劳日，可取消香蕉或缓冲。"]
        : ["合理", "能覆盖日常力量训练。"];
  } else {
    carb = carbRatio < 1.4
      ? ["偏低", mixedLowCarbHint || "日常减脂可接受；若饿或脑雾再加50g主食缓冲。"]
      : carbRatio > 2.0
        ? ["偏高", "休息/日常日不需要继续加碳水。"]
        : ["合理", state.staple === "mixed" ? "混搭可长期用，按一份主食额度执行。" : "适合休息或日常减脂。"];
  }

  const fatRatio = total.fat / PROFILE_WEIGHT_KG;
  const fat = fatRatio < 0.45
    ? ["偏低", "长期过低不利于激素和饱腹感。"]
    : fatRatio > 0.85
      ? ["偏高", "今天少加油、少鸭皮和坚果。"]
      : ["合理", "处在减脂期可持续范围。"];

  return { protein, carb, fat };
}

function renderNutritionRows(total, assessment, proteinRatio, carbRatio) {
  const rows = [
    {
      name: "热量",
      value: `${round(total.kcal)}`,
      unit: "kcal",
      status: "计划内",
      note: "含第二餐蔬菜"
    },
    {
      name: "蛋白质",
      value: formatDecimal(total.protein),
      unit: "g",
      status: assessment.protein[0],
      note: `${formatDecimal(proteinRatio)} g/kg`
    },
    {
      name: "碳水",
      value: `${round(total.carbs)}`,
      unit: "g",
      status: assessment.carb[0],
      note: `${formatDecimal(carbRatio)} g/kg`
    },
    {
      name: "脂肪",
      value: formatDecimal(total.fat),
      unit: "g",
      status: assessment.fat[0],
      note: assessment.fat[0] === "合理" ? "减脂期可持续" : assessment.fat[1]
    }
  ];

  els.nutritionList.innerHTML = rows.map((row) => (
    `<div class="nutrition-row ${assessmentClass(row.status)}">
      <span>${row.name}</span>
      <strong>${row.value}<small>${row.unit}</small></strong>
      <em>${row.status}</em>
      <p>${row.note}</p>
    </div>`
  )).join("");
}

function setNutritionAlert(hasAlert) {
  const todayButton = els.viewControls.querySelector('[data-view="today"]');
  const totalButton = els.mobileSectionTabs.querySelector('[data-mobile-panel="totals"]');
  const nutritionButton = els.mobileBottomNav.querySelector('[data-mobile-panel="totals"]');
  todayButton.classList.toggle("has-alert", hasAlert);
  totalButton.classList.toggle("has-alert", hasAlert);
  nutritionButton.classList.toggle("has-alert", hasAlert);
}

function renderPlanner() {
  const day = dayTypes[state.day];
  const staple = staples[state.staple];
  const breakfast = breakfasts[state.breakfast];
  const total = calculate();
  const proteinRatio = total.protein / PROFILE_WEIGHT_KG;
  const carbRatio = total.carbs / PROFILE_WEIGHT_KG;
  const assessment = buildMacroAssessment(total, proteinRatio, carbRatio);
  const macroIssue = [assessment.protein, assessment.carb, assessment.fat].find(([status]) => status !== "合理");

  els.plannerLead.textContent = day.lead;
  els.waterTarget.textContent = day.water;
  els.todayTitle.textContent = `${day.label} · ${staple.label}主食`;
  els.statusPill.textContent = state.proteinK ? "已启用 K" : day.status;
  els.dailyTipTitle.textContent = macroIssue ? `营养提醒：${macroIssue[0]}` : (state.proteinK ? "恢复压力大时保留 K" : day.lead);
  els.dailyTipText.textContent = macroIssue ? macroIssue[1] : `碳水 ${round(total.carbs)}g · 脂肪 ${formatDecimal(total.fat)}g · 蛋白 ${formatDecimal(proteinRatio)}g/kg`;
  els.settingsSummary.textContent = `${day.label} · ${staple.label} · ${breakfast.shortLabel} · ${state.proteinK ? "K" : "F"} · ${state.banana ? "香蕉" : "无香蕉"}${state.buffer ? " · 50g缓冲" : ""}`;
  els.mobileDietHint.textContent = `${day.label} · ${staple.label} · ${breakfast.shortLabel}`;
  els.mobileTotalHint.textContent = `${round(total.kcal)} kcal · ${formatDecimal(total.protein)}g蛋白`;
  els.todaySummary.textContent = `${staple.description}，第二餐蔬菜约200g已计入，早餐为${breakfast.label}，第三餐${state.proteinK ? "启用K" : "使用F"}，${state.banana ? "已计入香蕉" : "未计入香蕉"}，${state.buffer ? "已加50g主食缓冲" : "未加主食缓冲"}。`;
  setNutritionAlert(Boolean(macroIssue));
  renderNutritionRows(total, assessment, proteinRatio, carbRatio);
  els.proteinRatio.textContent = `${formatDecimal(proteinRatio)} g/kg`;
  els.carbRatio.textContent = `${formatDecimal(carbRatio)} g/kg`;
  els.proteinRatioBar.style.width = `${Math.min(100, Math.max(8, (proteinRatio / 1.8) * 100))}%`;
  els.carbRatioBar.style.width = `${Math.min(100, Math.max(8, (carbRatio / 2.2) * 100))}%`;

  els.firstMealText.textContent = breakfast.meal;
  els.firstMealHint.textContent = breakfast.hint;
  els.secondMealText.textContent = staple.secondMeal;
  els.thirdMealText.textContent = state.proteinK ? "方案 K：鸡蛋3个 + 鸡胸100g" : "方案 F：鸡蛋4个";
  els.thirdMealHint.textContent = state.proteinK ? "今天属于跑步+力量、高疲劳或恢复压力日。" : "力量明显累、跑步叠加力量或睡眠差时再升到K。";
  els.firstMealMeta.textContent = `约 ${round(380 + breakfast.kcal)} kcal · 蛋白 ${formatDecimal(22 + breakfast.protein)}g`;
  els.secondMealMeta.textContent = `约 ${state.staple === "rice" ? 550 : state.staple === "potato" ? 560 : 555} kcal · 蛋白 60.5g · 含蔬菜`;
  els.thirdMealMeta.textContent = state.proteinK ? "约 432 kcal · 蛋白 41g" : "约 358 kcal · 蛋白 24g";
}

function renderMobilePanel() {
  els.mobileSectionTabs.querySelectorAll("button").forEach((button) => {
    const active = button.dataset.mobilePanel === state.mobilePanel;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "true" : "false");
  });
  els.mobilePanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.mobilePanelContent === state.mobilePanel);
  });
  renderMobileBottomNav();
}

function renderMobileBottomNav() {
  els.mobileBottomNav.querySelectorAll("button").forEach((button) => {
    const targetView = button.dataset.view;
    const active = targetView === "today"
      ? state.view === "today" && button.dataset.mobilePanel === state.mobilePanel
      : state.view === targetView;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
}

function renderView() {
  document.body.dataset.view = state.view;
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
  renderMobileBottomNav();
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

function hasBraiseOption(key) {
  return state.braiseOptions.includes(key);
}

function listItems(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function buildBraiseRecommendation() {
  const hasTomato = hasBraiseOption("tomato");
  const hasWater = hasBraiseOption("water");
  const hasSalt = hasBraiseOption("salt");
  const hasParsleyGarlicSalt = hasBraiseOption("parsleyGarlicSalt");
  const hasBlackPepper = hasBraiseOption("blackPepper");
  const hasOnionPowder = hasBraiseOption("onionPowder");
  const hasHerb = ["parsley", "thyme", "basil"].some(hasBraiseOption);
  const hasSoy = hasBraiseOption("soySauce");
  const hasOyster = hasBraiseOption("oysterSauce");
  const hasGuizhou = hasBraiseOption("guizhouDip");
  const hasSesame = hasBraiseOption("sesameOil");
  const hasGarlicBase = state.braiseGarlicBase !== "none";

  let title = "地中海清淡风";
  if (hasGuizhou) {
    title = "川贵微辣风";
  } else if (hasSoy || hasOyster || hasSesame) {
    title = "中式 / 中西结合风";
  } else if (!hasTomato && hasWater) {
    title = "地中海无番茄简易版";
  }

  const add = [];
  const avoid = [];

  if (!hasGarlicBase) {
    add.push("先定一个蒜香基底：橄榄油+蒜粉、橄榄油+鲜蒜或油浸蒜三选一。");
  }

  if (!hasTomato && !hasWater) {
    add.push("补番茄或清水做汤底，避免锅底太干。");
  }

  if (state.braiseGarlicBase === "infusedGarlic") {
    avoid.push("油浸蒜已经是油脂+蒜香基底，不再额外叠加橄榄油；连油带蒜计入本餐约10g总油量。");
  }

  if (hasSalt && hasParsleyGarlicSalt) {
    avoid.push("盐和欧芹大蒜盐不要叠加，保留一个咸味来源即可。");
  }

  if ((hasSoy || hasOyster || hasGuizhou) && (hasSalt || hasParsleyGarlicSalt)) {
    avoid.push("用了生抽、蚝油或贵州蘸水时，不再额外加盐或欧芹大蒜盐。");
  }

  if (hasSoy && hasOyster) {
    avoid.push("生抽和蚝油二选一，避免酱香和钠都偏重。");
  }

  if (title === "川贵微辣风") {
    if (!hasSoy && !hasOyster) add.push("需要酱香时，生抽或蚝油二选一，不超过1茶匙。");
    if (!hasWater && !hasTomato) add.push("补1-3汤匙清水，让蘸水和酱香能化开。");
    if (hasBlackPepper || hasHerb) avoid.push("川贵微辣风默认不加黑胡椒、欧芹碎、百里香或罗勒。");
    return {
      title,
      status: "微辣路线",
      summary: "当前组合会走向贵州蘸水的糊辣香，重点是少量、化开、不叠盐。",
      add,
      avoid
    };
  }

  if (title === "中式 / 中西结合风") {
    if (!hasSoy && !hasOyster) add.push("咸鲜来源建议生抽或蚝油二选一，不超过1茶匙。");
    if (!hasBlackPepper) add.push("可加少量黑胡椒，但取低值，避免抢酱香。");
    if (!hasTomato && !hasWater) add.push("补少量番茄或清水做焖制汁底。");
    if (hasHerb) avoid.push("欧芹碎、百里香、罗勒在中式酱香里退到可选，不要同时当主角。");
    return {
      title,
      status: "酱香路线",
      summary: "当前组合更偏熟悉的中式酱香，控制重点是咸味来源只留一个。",
      add,
      avoid
    };
  }

  if (!hasOnionPowder) add.push("加洋葱粉 1/8-1/4 茶匙，补甜香和底味。");
  if (!hasBlackPepper) add.push("加黑胡椒，地中海清淡风可取到 1/4 茶匙。");
  if (!hasHerb) add.push("欧芹碎、百里香或罗勒至少选一种，建议百里香/欧芹碎优先。");
  if (!hasTomato && title !== "地中海无番茄简易版") add.push("有番茄时优先加番茄，酸鲜和汁水会更完整。");
  if (hasSoy || hasOyster || hasGuizhou || hasSesame) {
    avoid.push("想保持地中海清淡风，就不要加生抽、蚝油、贵州蘸水或香油。");
  }

  return {
    title,
    status: title === "地中海无番茄简易版" ? "清淡备用" : "清淡路线",
    summary: title === "地中海无番茄简易版"
      ? "当前没有番茄，仍可做清淡版，但需要洋葱粉、黑胡椒和草本香补厚度。"
      : "当前组合优先走地中海清淡风，番茄、洋葱粉、黑胡椒和草本香越齐，味道越完整。",
    add,
    avoid
  };
}

function renderBraise() {
  const recommendation = buildBraiseRecommendation();
  const selectedLabels = state.braiseOptions.map((option) => braiseOptionLabels[option]);
  const baseLabel = garlicBases[state.braiseGarlicBase];
  const selectedCount = selectedLabels.length + (state.braiseGarlicBase === "none" ? 0 : 1);

  setActive(els.braiseGarlicBaseControls, "garlicBase", state.braiseGarlicBase);
  syncBraiseOptionButtons();
  els.braiseStatusPill.textContent = recommendation.status;
  els.braiseCountPill.textContent = `${selectedCount} 项`;
  els.braiseFlavorTitle.textContent = recommendation.title;
  els.braiseFlavorSummary.textContent = recommendation.summary;
  els.braiseAddList.innerHTML = listItems(recommendation.add.length ? recommendation.add : ["当前香气结构基本够用，出锅前尝味再微调。"]);
  els.braiseAvoidList.innerHTML = listItems(recommendation.avoid.length ? recommendation.avoid : ["暂无明显冲突，注意不要继续叠加咸味来源。"]);
  els.braiseCurrentText.textContent = [baseLabel, ...selectedLabels].join(" / ");
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
  saveState();
  renderPlanner();
});

els.stapleControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-staple]");
  if (!button) return;
  state.staple = button.dataset.staple;
  setActive(els.stapleControls, "staple", state.staple);
  saveState();
  renderPlanner();
});

els.breakfastControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-breakfast]");
  if (!button) return;
  state.breakfast = button.dataset.breakfast;
  setActive(els.breakfastControls, "breakfast", state.breakfast);
  saveState();
  renderPlanner();
});

els.bananaToggle.addEventListener("change", () => {
  state.banana = els.bananaToggle.checked;
  saveState();
  renderPlanner();
});

els.bufferToggle.addEventListener("change", () => {
  state.buffer = els.bufferToggle.checked;
  saveState();
  renderPlanner();
});

els.proteinToggle.addEventListener("change", () => {
  state.proteinK = els.proteinToggle.checked;
  saveState();
  renderPlanner();
});

els.knowledgeTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-knowledge]");
  if (!button) return;
  state.knowledge = button.dataset.knowledge;
  saveState();
  renderKnowledge();
});

els.braiseGarlicBaseControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-garlic-base]");
  if (!button) return;
  state.braiseGarlicBase = button.dataset.garlicBase;
  saveState();
  renderBraise();
});

[els.braiseSoupControls, els.braiseSpiceControls].forEach((container) => {
  container.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-braise-option]");
    if (!button) return;
    const option = button.dataset.braiseOption;
    const selected = new Set(state.braiseOptions);
    if (selected.has(option)) {
      selected.delete(option);
    } else {
      selected.add(option);
    }
    state.braiseOptions = validBraiseOptions.filter((item) => selected.has(item));
    saveState();
    renderBraise();
  });
});

els.viewControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  state.view = button.dataset.view;
  saveState();
  renderView();
});

els.mobileSectionTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-mobile-panel]");
  if (!button) return;
  state.mobilePanel = button.dataset.mobilePanel;
  saveState();
  renderMobilePanel();
});

els.mobileBottomNav.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  state.view = button.dataset.view;
  if (button.dataset.mobilePanel) {
    state.mobilePanel = button.dataset.mobilePanel;
  }
  saveState();
  renderView();
  renderMobilePanel();
});

renderKnowledgeTabs();
syncControls();
renderPlanner();
renderBraise();
renderMobilePanel();
renderKnowledge();
renderView();

if ("serviceWorker" in navigator && ["https:", "http:"].includes(window.location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The page still works normally if installation support is unavailable.
    });
  });
}
