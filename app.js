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
  none: "未选择"
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

const vegetableItems = {
  tomato: { label: "番茄", group: "颜色/椒香", short: "番茄" },
  cabbage: { label: "甘蓝", group: "主体菜", short: "甘蓝" },
  baoCabbage: { label: "包菜", group: "主体菜", short: "包菜" },
  napaCabbage: { label: "大白菜", group: "主体菜", short: "大白菜" },
  cauliflower: { label: "菜花", group: "主体菜", short: "菜花" },
  babyCabbage: { label: "娃娃菜", group: "主体菜", short: "娃娃菜" },
  carrot: { label: "胡萝卜", group: "颜色/椒香", short: "胡萝卜" },
  bellPepper: { label: "彩椒", group: "颜色/椒香", short: "彩椒" },
  greenPepper: { label: "青椒", group: "颜色/椒香", short: "青椒" },
  onion: { label: "洋葱", group: "出汁增香", short: "洋葱" },
  zucchini: { label: "西葫芦", group: "出汁增香", short: "西葫芦" },
  celery: { label: "芹菜", group: "出汁增香", short: "芹菜" },
  kingOysterMushroom: { label: "杏鲍菇", group: "菌菇/软嫩", short: "杏鲍菇" },
  loofah: { label: "丝瓜", group: "菌菇/软嫩", short: "丝瓜" },
  shanghaiGreen: { label: "上海青", group: "深绿叶菜", short: "上海青" },
  spinach: { label: "菠菜", group: "深绿叶菜", short: "菠菜" },
  bokChoy: { label: "小白菜", group: "深绿叶菜", short: "小白菜" },
  romaineLettuce: { label: "油麦菜", group: "深绿叶菜", short: "油麦菜" },
  eggplant: { label: "茄子", group: "口感轮换", short: "茄子" },
  okra: { label: "秋葵", group: "口感轮换", short: "秋葵" },
  garlicScape: { label: "蒜薹", group: "北方家常", short: "蒜薹" },
  greenBeans: { label: "豆角", group: "北方家常", short: "豆角" },
  kidneyBeans: { label: "芸豆", group: "北方家常", short: "芸豆" },
  edamame: { label: "毛豆仁", group: "纤维颗粒补强", short: "毛豆仁" },
  peas: { label: "青豆粒", group: "纤维颗粒补强", short: "青豆粒" },
  mixedVeg: { label: "三色豆", group: "纤维颗粒补强", short: "三色豆" }
};

const vegetableGroups = [
  { id: "main", label: "主体菜", options: ["cabbage", "baoCabbage", "napaCabbage", "cauliflower", "babyCabbage"] },
  { id: "color", label: "颜色/椒香", options: ["tomato", "carrot", "bellPepper", "greenPepper"] },
  { id: "juice", label: "出汁增香", options: ["onion", "zucchini", "celery"] },
  { id: "texture", label: "菌菇/软嫩", options: ["kingOysterMushroom", "loofah", "eggplant", "okra"] },
  { id: "home", label: "北方家常", options: ["garlicScape", "greenBeans", "kidneyBeans"] },
  { id: "leafy", label: "深绿叶菜", options: ["shanghaiGreen", "spinach", "bokChoy", "romaineLettuce"] },
  { id: "boost", label: "纤维颗粒补强", options: ["edamame", "peas", "mixedVeg"] }
];

const validVegetableOptions = Object.keys(vegetableItems);
const validVegetablePanels = vegetableGroups.map((group) => group.id);

const practiceCombos = [
  { level: "A 主力", score: 94, name: "番茄 + 甘蓝 + 胡萝卜 + 洋葱", options: ["tomato", "cabbage", "carrot", "onion"], flavor: "地中海清淡风", note: "十字花科、橙色蔬菜和葱属蔬菜都有，适合高频吃。" },
  { level: "A 主力", score: 93, name: "番茄 + 包菜 + 胡萝卜 + 洋葱", options: ["tomato", "baoCabbage", "carrot", "onion"], flavor: "地中海清淡风 / 中式轻酱香版", note: "包菜更家常耐放，适合作为省心主力。" },
  { level: "A 主力", score: 92, name: "番茄 + 甘蓝 + 胡萝卜 + 彩椒", options: ["tomato", "cabbage", "carrot", "bellPepper"], flavor: "地中海清淡风", note: "颜色、甜味和脆感都比较完整。" },
  { level: "A 主力", score: 91, name: "番茄 + 娃娃菜 + 彩椒 + 胡萝卜", options: ["tomato", "babyCabbage", "bellPepper", "carrot"], flavor: "地中海清淡风", note: "清甜多汁，适合不想吃重口时。" },
  { level: "A 主力", score: 90, name: "番茄 + 甘蓝 + 胡萝卜 + 青椒", options: ["tomato", "cabbage", "carrot", "greenPepper"], flavor: "地中海清淡风 / 川贵微辣风", note: "清爽、有青椒香，想换口时可走川贵微辣。" },
  { level: "A 主力", score: 90, name: "番茄 + 包菜 + 杏鲍菇 + 胡萝卜", options: ["tomato", "baoCabbage", "kingOysterMushroom", "carrot"], flavor: "地中海清淡风 / 中式轻酱香版", note: "包菜做体积，杏鲍菇补鲜味和咬劲。" },
  { level: "A 主力", score: 89, name: "番茄 + 甘蓝 + 青椒 + 洋葱", options: ["tomato", "cabbage", "greenPepper", "onion"], flavor: "地中海清淡风", note: "十字花科、青椒和洋葱兼顾。" },
  { level: "A 主力", score: 88, name: "番茄 + 深绿叶菜 + 西葫芦 + 洋葱", options: ["tomato", "leafy", "zucchini", "onion"], flavor: "地中海清淡风", note: "深绿叶菜补强日，汤底和叶菜都更完整。" },
  { level: "A 主力", score: 88, name: "番茄 + 大白菜 + 油麦菜 + 杏鲍菇", options: ["tomato", "napaCabbage", "romaineLettuce", "kingOysterMushroom"], flavor: "地中海清淡风（控盐执行）", note: "大白菜出水、油麦菜补深绿叶菜、杏鲍菇补鲜味。" },
  { level: "A 主力", score: 86, name: "甘蓝 + 胡萝卜 + 洋葱", options: ["cabbage", "carrot", "onion"], flavor: "地中海无番茄简易版", note: "无番茄时仍有洋葱甜汁支撑。" },
  { level: "B 轮换", score: 85, name: "番茄 + 丝瓜 + 杏鲍菇 + 洋葱", options: ["tomato", "loofah", "kingOysterMushroom", "onion"], flavor: "地中海清淡风 / 中式轻酱香版", note: "丝瓜出水、杏鲍菇吸汁，口感一软一韧。" },
  { level: "B 轮换", score: 84, name: "娃娃菜 + 彩椒 + 胡萝卜", options: ["babyCabbage", "bellPepper", "carrot"], flavor: "地中海无番茄简易版", note: "清甜多汁，适合清淡日。" },
  { level: "B 轮换", score: 83, name: "番茄 + 茄子 + 青椒", options: ["tomato", "eggplant", "greenPepper"], flavor: "川贵微辣风", note: "口味反差强，适合换口味。" },
  { level: "B 轮换", score: 83, name: "包菜 + 蒜薹 + 胡萝卜 + 青椒", options: ["baoCabbage", "garlicScape", "carrot", "greenPepper"], flavor: "中式 / 中西结合风、川贵微辣风", note: "北方家常感强，蒜薹和青椒撑香味。" },
  { level: "B 轮换", score: 82, name: "甘蓝 + 青椒 + 洋葱", options: ["cabbage", "greenPepper", "onion"], flavor: "地中海无番茄简易版", note: "不加番茄也有个性，甘蓝香、青椒爽和洋葱甜比较清楚。" },
  { level: "B 轮换", score: 82, name: "番茄 + 大白菜 + 芹菜 + 胡萝卜", options: ["tomato", "napaCabbage", "celery", "carrot"], flavor: "地中海清淡风（控盐执行） / 中式轻酱香版", note: "大白菜出水，芹菜提清香，适合控盐。" },
  { level: "B 轮换", score: 81, name: "番茄 + 豆角 + 胡萝卜 + 蒜薹", options: ["tomato", "greenBeans", "carrot", "garlicScape"], flavor: "中式 / 中西结合风、川贵微辣风", note: "豆角必须充分熟透，蒜薹补香。" },
  { level: "B 轮换", score: 80, name: "番茄 + 西葫芦 + 茄子 + 青椒", options: ["tomato", "zucchini", "eggplant", "greenPepper"], flavor: "地中海清淡风", note: "质地和颜色丰富，适合作为轮换。" },
  { level: "B 轮换", score: 80, name: "番茄 + 芸豆 + 包菜 + 青椒", options: ["tomato", "kidneyBeans", "baoCabbage", "greenPepper"], flavor: "中式 / 中西结合风、川贵微辣风", note: "芸豆更厚实，必须焖透；包菜和番茄负责汤底与体积。" },
  { level: "B 轮换", score: 79, name: "番茄 + 秋葵 + 茄子", options: ["tomato", "okra", "eggplant"], flavor: "川贵微辣风", note: "秋葵让汤汁更稠，茄子负责绵软口感。" },
  { level: "B 轮换", score: 79, name: "大白菜 + 芹菜 + 杏鲍菇", options: ["napaCabbage", "celery", "kingOysterMushroom"], flavor: "地中海无番茄简易版 / 中式轻酱香版", note: "不加番茄也能靠大白菜出水，杏鲍菇吸汁。" },
  { level: "B 轮换", score: 75, name: "番茄 + 菜花 + 洋葱", options: ["tomato", "cauliflower", "onion"], flavor: "地中海清淡风", note: "菜花吸汁能力强，番茄能改善口感。" },
  { level: "B 轮换", score: 76, name: "番茄 + 丝瓜 + 油麦菜 + 芹菜", options: ["tomato", "loofah", "romaineLettuce", "celery"], flavor: "地中海清淡风（控盐执行）", note: "低负担、出水多，油麦菜最后短焖。" },
  { level: "C 调剂", score: 71, name: "茄子 + 青椒", options: ["eggplant", "greenPepper"], flavor: "中式 / 中西结合风", note: "家常味不错，但容易偏干，建议补番茄或清水。" }
];

const leafyOptions = ["shanghaiGreen", "spinach", "bokChoy", "romaineLettuce"];

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
  vegetableOptions: [],
  vegetableOpenPanels: ["main", "color", "juice", "texture", "home"],
  vegetableStarted: false,
  braiseGarlicBase: "none",
  braiseOptions: [],
  braiseOpenPanels: ["garlic", "soup", "spices"],
  braiseStarted: false
};

function readSavedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return {};

    const next = {};
    if (["today", "vegetables", "braise", "rules"].includes(saved.view)) next.view = saved.view;
    if (saved.view === "knowledge") next.view = "rules";
    if (["settings", "meals", "totals"].includes(saved.mobilePanel)) next.mobilePanel = saved.mobilePanel;
    if (dayTypes[saved.day]) next.day = saved.day;
    if (staples[saved.staple]) next.staple = saved.staple;
    if (breakfasts[saved.breakfast]) next.breakfast = saved.breakfast;
    if (knowledgeItems.some((item) => item.id === saved.knowledge)) next.knowledge = saved.knowledge;
    if (Array.isArray(saved.vegetableOptions)) {
      next.vegetableOptions = saved.vegetableOptions.filter((option) => validVegetableOptions.includes(option));
    }
    if (Array.isArray(saved.vegetableOpenPanels)) {
      const panels = saved.vegetableOpenPanels.filter((panel) => validVegetablePanels.includes(panel));
      next.vegetableOpenPanels = panels;
    }
    if (typeof saved.vegetableStarted === "boolean") next.vegetableStarted = saved.vegetableStarted;
    if (garlicBases[saved.braiseGarlicBase]) next.braiseGarlicBase = saved.braiseGarlicBase;
    if (Array.isArray(saved.braiseOptions)) {
      next.braiseOptions = saved.braiseOptions.filter((option) => validBraiseOptions.includes(option));
    }
    if (Array.isArray(saved.braiseOpenPanels)) {
      const panels = saved.braiseOpenPanels.filter((panel) => ["garlic", "soup", "spices"].includes(panel));
      next.braiseOpenPanels = panels;
    }
    if (typeof saved.braiseStarted === "boolean") next.braiseStarted = saved.braiseStarted;
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
  vegetableGroups: document.querySelector("#vegetableGroups"),
  vegetableStatusPill: document.querySelector("#vegetableStatusPill"),
  vegetableCountPill: document.querySelector("#vegetableCountPill"),
  vegetableFlavorList: document.querySelector("#vegetableFlavorList"),
  vegetableImproveList: document.querySelector("#vegetableImproveList"),
  vegetableResultTitle: document.querySelector("#vegetableResultTitle"),
  vegetableResultSummary: document.querySelector("#vegetableResultSummary"),
  vegetableComboTitle: document.querySelector("#vegetableComboTitle"),
  vegetableComboSummary: document.querySelector("#vegetableComboSummary"),
  vegetablePrepList: document.querySelector("#vegetablePrepList"),
  vegetableCurrentText: document.querySelector("#vegetableCurrentText"),
  vegetableToBraiseButton: document.querySelector("#vegetableToBraiseButton"),
  vegetableSummaryBar: document.querySelector("#vegetableSummaryBar"),
  vegetableSummaryTitle: document.querySelector("#vegetableSummaryTitle"),
  vegetableSummaryMeta: document.querySelector("#vegetableSummaryMeta"),
  vegetableSummaryHint: document.querySelector("#vegetableSummaryHint"),
  braisePanels: document.querySelectorAll("[data-braise-panel]"),
  braisePanelToggles: document.querySelectorAll("[data-braise-panel-toggle]"),
  braiseGarlicBaseControls: document.querySelector("#braiseGarlicBaseControls"),
  braiseSoupControls: document.querySelector("#braiseSoupControls"),
  braiseSpiceControls: document.querySelector("#braiseSpiceControls"),
  braiseGarlicSummary: document.querySelector("#braiseGarlicSummary"),
  braiseSoupSummary: document.querySelector("#braiseSoupSummary"),
  braiseSpiceSummary: document.querySelector("#braiseSpiceSummary"),
  braiseStatusPill: document.querySelector("#braiseStatusPill"),
  braiseCountPill: document.querySelector("#braiseCountPill"),
  braiseFlavorTitle: document.querySelector("#braiseFlavorTitle"),
  braiseFlavorSummary: document.querySelector("#braiseFlavorSummary"),
  braiseVariantTitle: document.querySelector("#braiseVariantTitle"),
  braiseVariantSummary: document.querySelector("#braiseVariantSummary"),
  braiseAddList: document.querySelector("#braiseAddList"),
  braiseFinishList: document.querySelector("#braiseFinishList"),
  braiseAvoidList: document.querySelector("#braiseAvoidList"),
  braiseCurrentText: document.querySelector("#braiseCurrentText"),
  braiseSummaryBar: document.querySelector("#braiseSummaryBar"),
  braiseSummaryAdd: document.querySelector("#braiseSummaryAdd"),
  braiseSummaryMeta: document.querySelector("#braiseSummaryMeta"),
  braiseSummaryAvoid: document.querySelector("#braiseSummaryAvoid")
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
      vegetableOptions: state.vegetableOptions,
      vegetableOpenPanels: state.vegetableOpenPanels,
      vegetableStarted: state.vegetableStarted,
      braiseGarlicBase: state.braiseGarlicBase,
      braiseOptions: state.braiseOptions,
      braiseOpenPanels: state.braiseOpenPanels,
      braiseStarted: state.braiseStarted
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
  syncVegetableOptionButtons();
  syncBraiseOptionButtons();
  els.bananaToggle.checked = state.banana;
  els.bufferToggle.checked = state.buffer;
  els.proteinToggle.checked = state.proteinK;
}

function syncVegetableOptionButtons() {
  if (!els.vegetableGroups) return;
  const selected = new Set(state.vegetableOptions);
  els.vegetableGroups.querySelectorAll("button[data-vegetable-option]").forEach((button) => {
    const active = selected.has(button.dataset.vegetableOption);
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
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

function setBraisePanelOpen(panel, open) {
  const next = new Set(state.braiseOpenPanels);
  if (open) {
    next.add(panel);
  } else {
    next.delete(panel);
  }
  state.braiseOpenPanels = ["garlic", "soup", "spices"].filter((item) => next.has(item));
}

function autoAdvanceBraisePanel(current, next) {
  setBraisePanelOpen(current, false);
  if (next) setBraisePanelOpen(next, true);
}

function renderBraisePanels() {
  const openPanels = new Set(state.braiseOpenPanels);
  els.braisePanels.forEach((panel) => {
    const open = openPanels.has(panel.dataset.braisePanel);
    panel.classList.toggle("collapsed", !open);
  });
  els.braisePanelToggles.forEach((button) => {
    const open = openPanels.has(button.dataset.braisePanelToggle);
    button.setAttribute("aria-expanded", open ? "true" : "false");
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

function hasVegetableOption(key) {
  return state.vegetableOptions.includes(key);
}

function selectedVegetableLabels() {
  return state.vegetableOptions.map((option) => vegetableItems[option].short);
}

function selectedVegetableSet() {
  const selected = new Set(state.vegetableOptions);
  if (leafyOptions.some((option) => selected.has(option))) selected.add("leafy");
  return selected;
}

function comboMatchInfo(combo, selected) {
  const missing = combo.options.filter((option) => !selected.has(option));
  const matched = combo.options.length - missing.length;
  return { combo, missing, matched };
}

function findBestVegetableCombo() {
  const selected = selectedVegetableSet();
  return practiceCombos
    .map((combo) => comboMatchInfo(combo, selected))
    .filter((item) => item.matched > 0)
    .sort((a, b) => {
      if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
      if (b.matched !== a.matched) return b.matched - a.matched;
      return b.combo.score - a.combo.score;
    })[0] || null;
}

function formatMissingVegetables(missing) {
  return missing.map((option) => option === "leafy" ? "上海青/菠菜/小白菜/油麦菜" : vegetableItems[option].short).join("、");
}

function vegetableNeedsTomato(selected) {
  const needs = ["cauliflower", "eggplant", "okra", "zucchini", "loofah", "greenBeans", "kidneyBeans"];
  return needs.some((option) => selected.has(option)) && !selected.has("tomato");
}

function setVegetablePanelOpen(panel, open) {
  const next = new Set(state.vegetableOpenPanels);
  if (open) {
    next.add(panel);
  } else {
    next.delete(panel);
  }
  state.vegetableOpenPanels = validVegetablePanels.filter((item) => next.has(item));
}

function buildPrepOrder(selected) {
  const first = ["carrot", "cauliflower", "cabbage", "baoCabbage", "greenBeans", "kidneyBeans", "kingOysterMushroom", "eggplant"].filter((option) => selected.has(option)).map((option) => vegetableItems[option].short);
  const middle = ["onion", "greenPepper", "bellPepper", "zucchini", "napaCabbage", "babyCabbage", "celery", "garlicScape", "loofah", "okra", "edamame", "peas", "mixedVeg"].filter((option) => selected.has(option)).map((option) => vegetableItems[option].short);
  const last = leafyOptions.filter((option) => selected.has(option)).map((option) => vegetableItems[option].short);
  const rows = [];
  if (first.length) rows.push(`先放：${first.join("、")}，耐熟或吸汁，需要先焖。`);
  if (middle.length) rows.push(`中段：${middle.join("、")}，翻拌后继续焖。`);
  if (last.length) rows.push(`最后：${last.join("、")}，叶菜最后1-2分钟放。`);
  if (!rows.length) rows.push("选择蔬菜后显示备菜顺序。");
  return rows;
}

function buildVegetableRecommendation() {
  const selected = selectedVegetableSet();
  const selectedCount = state.vegetableOptions.length;
  if (!state.vegetableStarted || !selectedCount) {
    return {
      status: "待选择",
      title: "先选蔬菜",
      flavor: "选择后显示",
      summary: "先点今天有的蔬菜，再判断接近哪组实践版组合。",
      comboTitle: "选择后显示",
      comboSummary: "优先参考水油焖菜一周实践版里的主力和轮换组合。",
      soup: "选择后显示焖菜汁建议。",
      improve: [],
      prep: ["选择蔬菜后显示备菜顺序。"],
      carry: { flavor: "mediterranean", soup: null }
    };
  }

  const best = selectedCount >= 2 ? findBestVegetableCombo() : null;
  const exact = best && best.missing.length === 0;
  const near = best && best.missing.length === 1;
  const hasTomato = selected.has("tomato");
  const hasEggplantGreenPepper = selected.has("eggplant") && selected.has("greenPepper");
  const hasOkraEggplant = selected.has("okra") && selected.has("eggplant");
  const needsTomato = vegetableNeedsTomato(selected);

  let flavor = exact ? best.combo.flavor : "地中海清淡风";
  if (!exact && (hasEggplantGreenPepper || hasOkraEggplant)) flavor = "川贵微辣风";
  if (!exact && !hasTomato && (selected.has("cabbage") || selected.has("baoCabbage") || selected.has("napaCabbage") || selected.has("babyCabbage")) && (selected.has("onion") || selected.has("carrot") || selected.has("bellPepper") || selected.has("celery"))) {
    flavor = "地中海无番茄简易版";
  }

  let soup = hasTomato ? "番茄已覆盖酸鲜和汁底，通常不必额外补水。" : "没有番茄，推荐用清水焖菜汁，先补1-3汤匙水。";
  if (!hasTomato && needsTomato) soup = "建议加番茄；不加时走清水焖菜汁，至少补2-3汤匙水。";
  if (!hasTomato && (selected.has("okra") && selected.has("eggplant"))) soup = "强烈建议加番茄；不加时清水焖菜汁要足，秋葵和茄子更需要汁底。";
  if (!hasTomato && selected.has("cauliflower")) soup = "建议加番茄；不加时用清水焖菜汁，菜花吸汁，单靠洋葱容易偏干。";
  if (!hasTomato && (selected.has("greenBeans") || selected.has("kidneyBeans"))) soup = "建议加番茄或清水焖菜汁；豆角/芸豆必须充分焖熟，锅底要有汁。";

  const improve = [];
  if (near) {
    addSuggestion(improve, formatMissingVegetables(best.missing), `补上后接近 ${best.combo.level}：${best.combo.name}。`);
  } else if (!exact && best && best.missing.length <= 2) {
    addSuggestion(improve, formatMissingVegetables(best.missing), `补齐后更接近实践版高分组合：${best.combo.name}。`);
  }
  if (!hasTomato && needsTomato && !improve.some((item) => item.name.includes("番茄"))) {
    addSuggestion(improve, "番茄", "这组菜偏吸水或汁底弱，加番茄能减少干锅和单调感；不加就用清水焖菜汁。");
  }
  if (!selected.has("leafy") && !selected.has("cabbage") && !selected.has("baoCabbage") && !selected.has("napaCabbage") && !selected.has("cauliflower")) {
    addSuggestion(improve, "包菜 / 油麦菜", "如果本周叶菜少，可补一个结构型绿菜；不是每锅必加。");
  }
  if (!selected.has("edamame") && !selected.has("peas") && !selected.has("mixedVeg") && selectedCount <= 3) {
    addSuggestion(improve, "毛豆仁 / 青豆粒", "想增加颗粒感时加30-50g即可，计入全天摄入。");
  }

  const status = exact ? best.combo.level : near ? "接近好组合" : selectedCount >= 3 ? "可优化" : "先补齐";
  const title = exact ? best.combo.level : near ? "差一个菜就很完整" : selectedCount >= 3 ? "当前可用，建议微调" : "先补一个关键菜";
  const comboTitle = best ? `${best.combo.level} · ${best.combo.name}` : "暂无接近组合";
  const comboSummary = exact
    ? best.combo.note
    : near
      ? `当前很接近这组，建议补：${formatMissingVegetables(best.missing)}。`
      : best
        ? `最接近：${best.combo.name}；可按建议补齐，也可以直接做当前组合。`
        : "当前组合不在实践版主力表里，建议补番茄、甘蓝或洋葱这类结构菜。";

  return {
    status,
    title,
    flavor,
    summary: `${soup} 推荐风味：${flavor}。`,
    comboTitle,
    comboSummary,
    soup,
    improve,
    prep: buildPrepOrder(selected),
    carry: {
      flavor: flavor.includes("川贵") ? "sichuan" : flavor.includes("中式") ? "chinese" : "mediterranean",
      soup: hasTomato || needsTomato ? "tomato" : "water"
    }
  };
}

function renderVegetableGroups() {
  const selected = new Set(state.vegetableOptions);
  const openPanels = new Set(state.vegetableOpenPanels);
  els.vegetableGroups.innerHTML = vegetableGroups.map((group, index) => {
    const selectedLabels = group.options.filter((option) => selected.has(option)).map((option) => vegetableItems[option].short);
    const open = openPanels.has(group.id);
    return `<article class="braise-panel vegetable-panel ${open ? "" : "collapsed"}" data-vegetable-panel="${group.id}">
      <button type="button" class="panel-head" data-vegetable-panel-toggle="${group.id}" aria-expanded="${open ? "true" : "false"}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3>${group.label}：</h3>
          <b>${selectedLabels.length ? selectedLabels.join("、") : "未选择"}</b>
        </div>
        <i aria-hidden="true"></i>
      </button>
      <div class="option-grid vegetable-options panel-body">
        ${group.options.map((option) => (
          `<button type="button" data-vegetable-option="${option}">
            <b>${vegetableItems[option].label}</b>
            <small>${vegetableItems[option].group}</small>
          </button>`
        )).join("")}
      </div>
    </article>`;
  }).join("");
}

function renderVegetables() {
  const recommendation = buildVegetableRecommendation();
  const selectedLabels = selectedVegetableLabels();
  const ready = state.vegetableStarted && state.vegetableOptions.length > 0;
  syncVegetableOptionButtons();
  els.vegetableStatusPill.textContent = recommendation.status;
  els.vegetableCountPill.textContent = `${state.vegetableOptions.length} 项`;
  els.vegetableFlavorList.innerHTML = ready
    ? renderAddItems([{ name: recommendation.flavor, detail: recommendation.soup }])
    : listItems(["选择蔬菜后显示推荐风味。"]);
  els.vegetableImproveList.innerHTML = ready
    ? renderAddItems(recommendation.improve.length ? recommendation.improve : [{ name: "可以直接备菜", detail: "当前组合已经够用，不需要为了完整度强行加菜。" }])
    : listItems(["选择蔬菜后显示建议补齐项。"]);
  els.vegetableResultTitle.textContent = recommendation.title;
  els.vegetableResultSummary.textContent = recommendation.summary;
  els.vegetableComboTitle.textContent = recommendation.comboTitle;
  els.vegetableComboSummary.textContent = recommendation.comboSummary;
  els.vegetablePrepList.innerHTML = listItems(recommendation.prep);
  els.vegetableCurrentText.textContent = selectedLabels.length ? selectedLabels.join(" / ") : "未选择";
  els.vegetableSummaryTitle.textContent = recommendation.status;
  els.vegetableSummaryMeta.textContent = recommendation.flavor;
  els.vegetableSummaryHint.textContent = ready ? recommendation.soup : "选择后显示";
  els.vegetableSummaryBar.hidden = !ready;
  els.vegetableToBraiseButton.disabled = !ready;
}

function applyVegetablesToBraise() {
  const recommendation = buildVegetableRecommendation();
  const next = new Set(state.braiseOptions);
  next.delete("tomato");
  next.delete("water");
  if (recommendation.carry.soup === "tomato") next.add("tomato");
  if (recommendation.carry.soup === "water") next.add("water");
  if (recommendation.carry.flavor === "sichuan") {
    next.add("guizhouDip");
    next.add("water");
    ["thyme", "basil", "parsley", "blackPepper"].forEach((option) => next.delete(option));
  } else if (recommendation.carry.flavor === "chinese") {
    next.add("soySauce");
    next.add("water");
  } else {
    next.add("onionPowder");
    next.add("blackPepper");
    next.add("thyme");
  }
  state.braiseOptions = validBraiseOptions.filter((option) => next.has(option));
  state.braiseStarted = true;
  state.braiseOpenPanels = ["garlic", "soup", "spices"];
  state.view = "braise";
  saveState();
  renderBraise();
  renderView();
}

function hasBraiseOption(key) {
  return state.braiseOptions.includes(key);
}

function listItems(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function addSuggestion(list, name, detail) {
  list.push({ name, detail });
}

function renderAddItems(items) {
  return items.map((item) => (
    `<li><strong>${item.name}</strong><span>${item.detail}</span></li>`
  )).join("");
}

function formatAddNames(items) {
  if (!items.length) return "可以直接焖";
  return items.slice(0, 2).map((item) => item.name.split(" / ")[0]).join("、");
}

function formatFinishSummary(items) {
  if (!items.length) return "";
  return `出锅可补：${items.slice(0, 2).map((item) => item.name.split(" / ")[0]).join("、")}`;
}

function hasBraiseSelection() {
  return state.braiseStarted && (state.braiseGarlicBase !== "none" || state.braiseOptions.length > 0);
}

function formatAvoidSummary(items) {
  if (!items.length) return "";
  const text = items[0];
  if (text.includes("油浸蒜")) return "避免：额外橄榄油";
  if (text.includes("盐和欧芹大蒜盐")) return "避免：叠加盐";
  if (text.includes("生抽和蚝油")) return "避免：生抽+蚝油";
  if (text.includes("贵州蘸水")) return "避免：叠加咸味";
  if (text.includes("黑胡椒") || text.includes("欧芹碎")) return "避免：西式香料混入";
  return "避免：风味叠加";
}

function buildBraiseRecommendation() {
  if (!hasBraiseSelection()) {
    return {
      title: "待选择",
      status: "待选择",
      variant: "选择后显示",
      variantSummary: "先选择蒜香、汤底或基础调料。",
      summary: "选择已有调料后，再判断料汁可加什么、出锅是否需要补香。",
      add: [],
      finishAdd: [],
      avoid: []
    };
  }

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
  const hasParsley = hasBraiseOption("parsley");
  const hasThyme = hasBraiseOption("thyme");
  const hasBasil = hasBraiseOption("basil");
  const hasSauceHerb = hasThyme || hasBasil;
  const hasChineseSeasoning = hasSoy || hasOyster || hasGuizhou || hasSesame;
  const hasMediterraneanSeasoning = hasOnionPowder || hasBlackPepper || hasHerb || hasTomato;
  const isMixed = hasGuizhou && (hasHerb || hasBlackPepper) || hasChineseSeasoning && hasHerb && hasParsleyGarlicSalt;

  let title = "地中海清淡风";
  if (isMixed) {
    title = "风味混杂，建议收敛";
  } else if (hasGuizhou) {
    title = "川贵微辣风";
  } else if (hasSoy || hasOyster || hasSesame) {
    title = "中式 / 中西结合风";
  } else if (!hasTomato && hasWater) {
    title = "地中海无番茄简易版";
  }

  const add = [];
  const finishAdd = [];
  const avoid = [];

  if (!hasGarlicBase) {
    addSuggestion(add, "蒜香基底", "橄榄油+蒜粉、橄榄油+鲜蒜或油浸蒜三选一。");
  }

  if (!hasTomato && !hasWater) {
    addSuggestion(add, "番茄 / 清水", "至少补一个汤底，番茄负责酸鲜，清水负责防干锅。");
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

  if (isMixed) {
    addSuggestion(add, "先删减", "保留一条主线：地中海留番茄和百里香；中式留生抽/蚝油；川贵留贵州蘸水。");
    return {
      title,
      status: "需要收敛",
      variant: "收敛重选版",
      variantSummary: "当前同时出现辣香、香草或酱香，先减少冲突项，再按一条路线调味。",
      summary: "风味混在一起时，继续加料通常不会更好吃；先确定今天想吃地中海清淡、轻酱香还是微辣。",
      add,
      finishAdd,
      avoid
    };
  }

  if (title === "川贵微辣风") {
    if (!hasSoy && !hasOyster) addSuggestion(add, "生抽 / 蚝油", "需要酱香时二选一，不超过1茶匙。");
    if (!hasWater && !hasTomato) addSuggestion(add, "清水", "补1-3汤匙，让蘸水和酱香能化开。");
    if (!hasSesame) addSuggestion(finishAdd, "香油", "出锅几滴即可，只做尾香，不做主要油脂。");
    if (hasBlackPepper || hasHerb) avoid.push("川贵微辣风默认不加黑胡椒、欧芹碎、百里香或罗勒。");
    return {
      title,
      status: "微辣路线",
      variant: hasSesame ? "川贵香油收尾版" : "川贵微辣焖菜版",
      variantSummary: hasSesame
        ? "贵州蘸水定主味，香油只放出锅几滴，不做主要油脂。"
        : "贵州蘸水少量化开，咸味来源保持单一，适合想吃微辣时。",
      summary: "当前组合会走向贵州蘸水的糊辣香，重点是少量、化开、不叠盐。",
      add,
      finishAdd,
      avoid
    };
  }

  if (title === "中式 / 中西结合风") {
    if (!hasSoy && !hasOyster) addSuggestion(add, "生抽 / 蚝油", "咸鲜来源二选一，不超过1茶匙。");
    if (!hasBlackPepper) addSuggestion(add, "黑胡椒", "可少量加入，但取低值，避免抢酱香。");
    if (!hasTomato && !hasWater) addSuggestion(add, "少量番茄 / 清水", "补焖制汁底，避免锅底偏干。");
    if (!hasSesame) addSuggestion(finishAdd, "香油", "出锅几滴即可，可选，不需要和橄榄油重复追香。");
    if (hasHerb) avoid.push("欧芹碎、百里香、罗勒在中式酱香里退到可选，不要同时当主角。");
    return {
      title,
      status: "酱香路线",
      variant: hasTomato ? "番茄轻酱香版" : hasSesame ? "香油收尾轻酱版" : "中式轻酱香版",
      variantSummary: hasTomato
        ? "番茄保留一点酸鲜，生抽或蚝油只放少量，适合想要熟悉口味但不重口。"
        : hasSesame
          ? "酱香做主体，香油只负责出锅尾香，不再额外叠盐。"
          : "生抽或蚝油二选一，黑胡椒取低值，做成轻酱香。",
      summary: "当前组合更偏熟悉的中式酱香，控制重点是咸味来源只留一个。",
      add,
      finishAdd,
      avoid
    };
  }

  if (!hasOnionPowder) addSuggestion(add, "洋葱粉", "1/8-1/4茶匙，补甜香和底味。");
  if (!hasBlackPepper) addSuggestion(add, "黑胡椒", "地中海清淡风可取到1/4茶匙。");
  if (!hasSauceHerb) addSuggestion(add, "百里香", "少量进料汁一起焖；比迷迭香柔和，更适合汤底和焖菜。");
  if (!hasTomato && title !== "地中海无番茄简易版") addSuggestion(add, "番茄", "优先用番茄补酸鲜和汁水，味道比清水版更完整。");
  if (!hasParsley) addSuggestion(finishAdd, "欧芹碎", "出锅撒一点即可，可选；不作为料汁里久焖的必需项。");
  if (hasSoy || hasOyster || hasGuizhou || hasSesame) {
    avoid.push("想保持地中海清淡风，就不要加生抽、蚝油、贵州蘸水或香油。");
  }

  let variant = "地中海基础焖菜版";
  let variantSummary = "料汁里优先放番茄、洋葱粉、黑胡椒和百里香；欧芹碎只作为出锅可选。";
  if (state.braiseGarlicBase === "infusedGarlic" && hasTomato) {
    variant = "油浸蒜番茄百里香版";
    variantSummary = "油浸蒜负责浓蒜香，番茄负责酸鲜；百里香适合进料汁一起焖，欧芹碎留到出锅。";
  } else if (hasTomato && hasBasil) {
    variant = "罗勒番茄版";
    variantSummary = "番茄和罗勒搭配清爽，适合彩椒、西葫芦、茄子这类菜；不需要再叠迷迭香。";
  } else if (hasTomato && hasThyme) {
    variant = "地中海番茄香草版";
    variantSummary = "番茄、黑胡椒、洋葱粉和百里香齐了就可以直接焖；欧芹碎只看出锅香气再补。";
  } else if (!hasTomato && hasWater) {
    variant = "地中海无番茄蒜香版";
    variantSummary = "没有番茄时用清水防干锅，料汁更依赖黑胡椒、洋葱粉和百里香撑住味道。";
  } else if (hasMediterraneanSeasoning) {
    variant = "地中海日常版";
    variantSummary = "当前已经在地中海清淡方向上，料汁缺什么就补什么；出锅补香不是必需。";
  }

  return {
    title,
    status: title === "地中海无番茄简易版" ? "清淡备用" : "清淡路线",
    variant,
    variantSummary,
    summary: title === "地中海无番茄简易版"
      ? "当前没有番茄，仍可做清淡版；料汁里用洋葱粉、黑胡椒和百里香补厚度即可。"
      : "当前组合优先走地中海清淡风；料汁里适合用番茄、洋葱粉、黑胡椒和百里香，欧芹碎只作为出锅可选。",
    add,
    finishAdd,
    avoid
  };
}

function renderBraise() {
  const recommendation = buildBraiseRecommendation();
  const finishAdd = recommendation.finishAdd || [];
  const selectedLabels = state.braiseOptions.map((option) => braiseOptionLabels[option]);
  const soupLabels = state.braiseOptions
    .filter((option) => ["tomato", "water"].includes(option))
    .map((option) => braiseOptionLabels[option]);
  const spiceLabels = state.braiseOptions
    .filter((option) => !["tomato", "water"].includes(option))
    .map((option) => braiseOptionLabels[option]);
  const baseLabel = garlicBases[state.braiseGarlicBase];
  const selectedCount = selectedLabels.length + (state.braiseGarlicBase === "none" ? 0 : 1);
  const ready = hasBraiseSelection();

  renderBraisePanels();
  setActive(els.braiseGarlicBaseControls, "garlicBase", state.braiseGarlicBase);
  syncBraiseOptionButtons();
  els.braiseGarlicSummary.textContent = baseLabel;
  els.braiseSoupSummary.textContent = soupLabels.length ? soupLabels.join(" + ") : "未选择";
  els.braiseSpiceSummary.textContent = spiceLabels.length ? spiceLabels.join("、") : "未选择";
  els.braiseStatusPill.textContent = recommendation.status;
  els.braiseCountPill.textContent = `${selectedCount} 项`;
  els.braiseFlavorTitle.textContent = recommendation.title;
  els.braiseFlavorSummary.textContent = recommendation.summary;
  els.braiseVariantTitle.textContent = recommendation.variant;
  els.braiseVariantSummary.textContent = recommendation.variantSummary;
  els.braiseAddList.innerHTML = ready
    ? renderAddItems(recommendation.add.length ? recommendation.add : [{ name: "可以直接焖", detail: "料汁结构已经够用，盖上小火焖，出锅前尝味即可。" }])
    : listItems(["选择调料后显示料汁可加项。"]);
  els.braiseFinishList.innerHTML = ready
    ? renderAddItems(finishAdd.length ? finishAdd : [{ name: "可不补香", detail: "补香不是必须；香气够时直接出锅。" }])
    : listItems(["选择调料后显示出锅可补项。"]);
  els.braiseAvoidList.innerHTML = ready
    ? listItems(recommendation.avoid.length ? recommendation.avoid : ["暂无明显冲突，注意不要继续叠加咸味来源。"])
    : listItems(["选择调料后显示避免项。"]);
  els.braiseCurrentText.textContent = ready ? [baseLabel, ...selectedLabels].join(" / ") : "未选择";
  els.braiseSummaryAdd.textContent = formatAddNames(recommendation.add);
  els.braiseSummaryMeta.textContent = `路线：${recommendation.title}`;
  els.braiseSummaryAvoid.textContent = formatAvoidSummary(recommendation.avoid) || formatFinishSummary(finishAdd);
  els.braiseSummaryBar.classList.toggle("no-avoid", !recommendation.avoid.length && !finishAdd.length);
  els.braiseSummaryBar.hidden = !ready;
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

els.vegetableGroups.addEventListener("click", (event) => {
  const toggle = event.target.closest("button[data-vegetable-panel-toggle]");
  if (toggle) {
    const panel = toggle.dataset.vegetablePanelToggle;
    setVegetablePanelOpen(panel, !state.vegetableOpenPanels.includes(panel));
    saveState();
    renderVegetableGroups();
    syncVegetableOptionButtons();
    return;
  }

  const button = event.target.closest("button[data-vegetable-option]");
  if (!button) return;
  const option = button.dataset.vegetableOption;
  const selected = new Set(state.vegetableOptions);
  if (selected.has(option)) {
    selected.delete(option);
  } else {
    selected.add(option);
  }
  state.vegetableOptions = validVegetableOptions.filter((item) => selected.has(item));
  state.vegetableStarted = true;
  saveState();
  renderVegetables();
});

els.vegetableSummaryBar.addEventListener("click", () => {
  document.querySelector(".vegetable-result").scrollIntoView({ behavior: "smooth", block: "start" });
});

els.vegetableToBraiseButton.addEventListener("click", () => {
  applyVegetablesToBraise();
});

els.braisePanelToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const panel = toggle.dataset.braisePanelToggle;
    setBraisePanelOpen(panel, !state.braiseOpenPanels.includes(panel));
    saveState();
    renderBraisePanels();
  });
});

els.braiseGarlicBaseControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-garlic-base]");
  if (!button) return;
  state.braiseGarlicBase = button.dataset.garlicBase;
  state.braiseStarted = true;
  autoAdvanceBraisePanel("garlic", "soup");
  saveState();
  renderBraise();
});

els.braiseSoupControls.addEventListener("click", (event) => {
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
  state.braiseStarted = true;
  autoAdvanceBraisePanel("soup", "spices");
  saveState();
  renderBraise();
});

els.braiseSpiceControls.addEventListener("click", (event) => {
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
  state.braiseStarted = true;
  setBraisePanelOpen("garlic", false);
  setBraisePanelOpen("soup", false);
  setBraisePanelOpen("spices", true);
  saveState();
  renderBraise();
});

els.braiseSummaryBar.addEventListener("click", () => {
  document.querySelector(".braise-result").scrollIntoView({ behavior: "smooth", block: "start" });
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
renderVegetableGroups();
syncControls();
renderPlanner();
renderVegetables();
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
