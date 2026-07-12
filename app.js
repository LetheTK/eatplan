const PROFILE_WEIGHT_KG = 75;

// 当前真实作息以根目录《个人作息与三餐时间安排》为准（2026-07-08）。
// 集中在这里渲染，避免 HTML 初始内容和运行时展示再次出现餐时漂移。
const mealTimes = {
  first: "约 17:30",
  second: "约 22:00",
  third: "约 01:30–02:00"
};

const dayTypes = {
  daily: {
    label: "日常",
    status: "日常方案 F",
    water: "2-2.5L 水",
    bananaDefault: false,
    thirdMealDefault: "eggF",
    lead: "按优化版基础饮食执行，不主动加香蕉和主食缓冲。",
    actions: [
      "早餐吃麦片100g + 牛奶125ml + 鸡蛋1个。",
      "第二餐肉类按约55g蛋白折算；可单选鸡胸/鸭胸/牛瘦肉/猪瘦肉，也可多选按蛋白均分。",
      "第三餐默认按方案F吃鸡蛋4个（约200g）；想减少鸡蛋时可换等蛋白鸡胸1份约110g或去皮鸭胸1份约125g。",
      "今天不主动加香蕉，不主动加50g主食缓冲。"
    ]
  },
  run: {
    label: "跑步",
    status: "按状态补碳",
    water: "2.5-3L 水",
    bananaDefault: false,
    thirdMealDefault: "eggF",
    lead: "5km 慢跑不固定加碳水；空腹、间隔久、恢复慢时再补。",
    actions: [
      "状态正常的5km慢跑，不必固定加香蕉。",
      "空腹跑、距上一餐超过4小时、跑后1小时仍腿沉时，再补碳。",
      "补碳可选香蕉1根，或土豆100g、糙米饭75-100g、紫薯80-100g。",
      "跑后或力量后正好吃饭时，可用1个玉米馒头替代本餐主食。",
      "第三餐先按方案F；当天还做力量或连续疲劳时再选K。",
      "第二餐仍只吃一份主食，不把土豆和米饭完整叠加。"
    ]
  },
  strength: {
    label: "力量",
    status: "看训练状态",
    water: "2.3-2.8L 水",
    bananaDefault: false,
    thirdMealDefault: "eggF",
    lead: "力量日先用方案 F；训练掉力或恢复差时再开 K 和主食缓冲。",
    actions: [
      "先按方案F执行，蛋白质已经覆盖日常保肌。",
      "如果今天训练明显掉力，打开50g主食缓冲。",
      "训练日吃1个玉米馒头可以，但把它当本餐主食，不再叠加米饭或土豆。",
      "如果连续疲劳、睡眠差或酸痛明显，第三餐选K。",
      "训练后先补水，再判断是否需要额外主食。"
    ]
  },
  rest: {
    label: "休息",
    status: "保留赤字",
    water: "2-2.5L 水",
    bananaDefault: false,
    thirdMealDefault: "eggF",
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
    secondMeal: "第二餐肉类按约55g蛋白折算 · 蔬菜200g · 糙米100g · 橄榄油1汤匙",
    description: "糙米基础日"
  },
  potato: {
    label: "土豆",
    kcal: 1318,
    protein: 108.8,
    carbs: 115,
    fat: 50.0,
    secondMeal: "第二餐肉类按约55g蛋白折算 · 蔬菜200g · 土豆150g · 橄榄油1汤匙",
    description: "土豆基础日"
  },
  mixed: {
    label: "混搭",
    kcal: 1313,
    protein: 108.8,
    carbs: 112,
    fat: 50.0,
    secondMeal: "第二餐肉类按约55g蛋白折算 · 蔬菜200g · 主食混搭 · 橄榄油1汤匙",
    description: "主食混搭日"
  }
};

const breakfasts = {
  balanced: {
    label: "平衡早餐",
    shortLabel: "平衡",
    meal: "麦片100g + 牛奶125ml + 鸡蛋1个",
    hint: "保留口感和钙，减少牛奶成本。",
    mealKcal: 506,
    mealProtein: 23.5,
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
    mealKcal: 510,
    mealProtein: 21.3,
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
    mealKcal: 501,
    mealProtein: 25.6,
    kcal: -5,
    protein: 2.2,
    carbs: -4.5,
    fat: 1.9
  },
  egg4: {
    label: "高蛋白早餐",
    shortLabel: "4蛋麦片",
    meal: "麦片100g + 鸡蛋4个",
    hint: "早餐已是高蛋白高脂；第三餐自动降为轻补蛋白，不再默认叠加F鸡蛋4个。",
    mealKcal: 627,
    mealProtein: 38.2,
    kcal: 122,
    protein: 14.8,
    carbs: -3.5,
    fat: 10.7
  }
};

const banana = { kcal: 105, protein: 1.3, carbs: 27, fat: 0.3 };
const buffer = { kcal: 45, protein: 0, carbs: 10, fat: 0 };
const SECOND_MEAT_TARGET_PROTEIN = 55;
const SECOND_MEAT_BASELINE = { kcal: 290, protein: 55, fat: 6 };
const secondMeats = {
  chicken: {
    label: "鸡胸",
    shortLabel: "鸡",
    proteinPer100: 23.1,
    kcalPer100: 116,
    fatPer100: 2.4
  },
  duck: {
    label: "去皮鸭胸",
    shortLabel: "鸭",
    proteinPer100: 20,
    kcalPer100: 124,
    fatPer100: 4.8
  },
  beef: {
    label: "牛瘦肉",
    shortLabel: "牛",
    proteinPer100: 22,
    kcalPer100: 140,
    fatPer100: 5
  },
  pork: {
    label: "猪瘦肉",
    shortLabel: "猪",
    proteinPer100: 20.3,
    kcalPer100: 143,
    fatPer100: 6.2
  }
};
const validSecondMeats = Object.keys(secondMeats);
const standardThirdMealIds = ["eggF", "chickenF", "duckF", "beefF", "porkF", "k"];
const egg4ThirdMealIds = ["lightChicken", "lightDuck", "lightBeef", "lightPork", "lightEggs"];
const lightThirdMealIds = ["lightChicken", "lightDuck", "lightBeef", "lightPork", "lightEggs"];
const thirdMealButtonText = {
  lightChicken: ["轻鸡胸", "70-80g"],
  lightDuck: ["轻鸭胸", "约85g"],
  lightBeef: ["轻牛瘦肉", "约80g"],
  lightPork: ["轻猪瘦肉", "约85g"],
  lightEggs: ["轻鸡蛋", "2个 / 约100g"],
  eggF: ["F鸡蛋", "4个 / 约200g"],
  chickenF: ["F鸡胸", "1份 / 约110g"],
  duckF: ["F鸭胸", "1份 / 约125g"],
  beefF: ["F牛瘦肉", "1份 / 约115g"],
  porkF: ["F猪瘦肉", "1份 / 约125g"],
  k: ["K", "3蛋约150g<br>鸡胸100g"]
};
const thirdMeals = {
  lightChicken: {
    label: "轻补蛋白：鸡胸70-80g",
    shortLabel: "轻鸡胸75g",
    kcal: -165,
    protein: -7.9,
    carbs: -2,
    fat: -15.8,
    hint: "早餐已吃4个鸡蛋时的首选第三餐；保住蛋白，同时避免全天8个全蛋和脂肪集中。",
    meta: "约 87 kcal · 蛋白 17g"
  },
  lightDuck: {
    label: "轻补蛋白：去皮鸭胸约85g",
    shortLabel: "轻鸭胸85g",
    kcal: -147,
    protein: -8.2,
    carbs: -2,
    fat: -13.5,
    hint: "早餐4蛋日的换口味轻补选项；只按去皮瘦鸭胸计算，带皮鸭胸不作为默认。",
    meta: "约 105 kcal · 蛋白 17g"
  },
  lightBeef: {
    label: "轻补蛋白：牛瘦肉约80g",
    shortLabel: "轻牛瘦肉80g",
    kcal: -140,
    protein: -7.6,
    carbs: -2,
    fat: -13.6,
    hint: "早餐4蛋日的红肉轻补选项；更适合晚餐偏早时吃，临睡前仍优先鸡胸或鸡蛋。",
    meta: "约 112 kcal · 蛋白 17.6g"
  },
  lightPork: {
    label: "轻补蛋白：猪瘦肉约85g",
    shortLabel: "轻猪瘦肉85g",
    kcal: -130,
    protein: -7.9,
    carbs: -2,
    fat: -12.3,
    hint: "早餐4蛋日的红肉轻补选项；选择纯瘦肉，避开肥肉和五花。",
    meta: "约 122 kcal · 蛋白 17.3g"
  },
  lightEggs: {
    label: "轻补蛋白：鸡蛋2个（约100g）",
    shortLabel: "轻鸡蛋2个",
    kcal: -126,
    protein: -12.6,
    carbs: -1,
    fat: -8.8,
    hint: "没有备肉时使用；早餐4蛋日这样全天约6个鸡蛋，比叠加F更稳。",
    meta: "约 126 kcal · 蛋白 12.6g"
  },
  eggF: {
    label: "方案 F：鸡蛋4个（约200g）",
    shortLabel: "F鸡蛋4个/200g",
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    hint: "日常默认，鸡蛋按约50g/个估算；早餐用平衡版时全天约5个鸡蛋。若早餐已4蛋，优先改轻鸡胸。",
    meta: "约 252 kcal · 蛋白 25.2g"
  },
  chickenF: {
    label: "F替换：鸡胸1份（约110g）",
    shortLabel: "F鸡胸110g",
    kcal: -124,
    protein: 0.2,
    carbs: -2,
    fat: -15,
    hint: "等蛋白替代4个鸡蛋，热量和脂肪更低，但需要提前备餐。",
    meta: "约 128 kcal · 蛋白 25g"
  },
  duckF: {
    label: "F替换：去皮鸭胸1份（约125g）",
    shortLabel: "F鸭胸125g",
    kcal: -97,
    protein: -0.2,
    carbs: -2,
    fat: -11.6,
    hint: "适合换口味；只按去皮瘦鸭胸计算，带皮鸭胸不作为第三餐默认。",
    meta: "约 155 kcal · 蛋白 25g"
  },
  beefF: {
    label: "F替换：牛瘦肉1份（约115g）",
    shortLabel: "F牛瘦肉115g",
    kcal: -91,
    protein: 0.1,
    carbs: -2,
    fat: -11.8,
    hint: "按瘦牛肉约22g蛋白/100g估算；更适合白天或晚餐偏早时吃。",
    meta: "约 161 kcal · 蛋白 25.3g"
  },
  porkF: {
    label: "F替换：猪瘦肉1份（约125g）",
    shortLabel: "F猪瘦肉125g",
    kcal: -73,
    protein: 0.2,
    carbs: -2,
    fat: -9.8,
    hint: "按猪瘦肉约20g蛋白/100g估算；选择纯瘦肉，避开肥肉和五花。",
    meta: "约 179 kcal · 蛋白 25.4g"
  },
  k: {
    label: "方案 K：鸡蛋3个（约150g）+ 鸡胸100g",
    shortLabel: "K 3蛋150g+鸡胸100g",
    kcal: 74,
    protein: 16.8,
    carbs: -0.5,
    fat: -1.1,
    hint: "用于跑步叠加力量、高疲劳、睡眠差或恢复压力大的日子。",
    meta: "约 326 kcal · 蛋白 42g"
  }
};
const STORAGE_KEY = "eatplan.dashboard.state.v1";
const RECORD_STORAGE_KEY = "eatplan.dashboard.records.v1";
const BRAISE_PANEL_STATE_VERSION = 2;

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
const validDietPanels = ["day", "staple", "breakfast", "secondMeat", "thirdMeal", "adjust"];

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
  loofah: { label: "丝瓜", group: "出汁增香", short: "丝瓜" },
  garlicScape: { label: "蒜薹", group: "出汁增香", short: "蒜薹" },
  kingOysterMushroom: { label: "杏鲍菇", group: "主体菜", short: "杏鲍菇" },
  shanghaiGreen: { label: "上海青", group: "深绿叶菜", short: "上海青" },
  spinach: { label: "菠菜", group: "深绿叶菜", short: "菠菜" },
  bokChoy: { label: "小白菜", group: "深绿叶菜", short: "小白菜" },
  milkCabbage: { label: "奶白菜", group: "叶菜 · 可作主体", short: "奶白菜" },
  romaineLettuce: { label: "油麦菜", group: "深绿叶菜", short: "油麦菜" },
  eggplant: { label: "茄子", group: "主体菜", short: "茄子" },
  greenBeans: { label: "豆角", group: "主体菜", short: "豆角" },
  kidneyBeans: { label: "芸豆", group: "主体菜", short: "芸豆" },
  okra: { label: "秋葵", group: "补强菜", short: "秋葵" },
  edamame: { label: "毛豆仁", group: "补强菜", short: "毛豆仁" },
  peas: { label: "青豆粒", group: "补强菜", short: "青豆粒" },
  mixedVeg: { label: "三色豆", group: "补强菜", short: "三色豆" }
};

const vegetableGroups = [
  { id: "main", label: "主体菜 / 叶菜", options: ["cabbage", "baoCabbage", "napaCabbage", "cauliflower", "babyCabbage", "eggplant", "kingOysterMushroom", "greenBeans", "kidneyBeans", "shanghaiGreen", "spinach", "bokChoy", "milkCabbage", "romaineLettuce"] },
  { id: "color", label: "颜色/椒香", options: ["tomato", "carrot", "bellPepper", "greenPepper"] },
  { id: "juice", label: "出汁增香", options: ["onion", "zucchini", "celery", "loofah", "garlicScape"] },
  { id: "boost", label: "补强菜", options: ["okra", "edamame", "peas", "mixedVeg"] }
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
  { level: "B 轮换", score: 83, name: "番茄 + 茄子 + 青椒", options: ["tomato", "eggplant", "greenPepper"], flavor: "中式 / 中西结合风、川贵微辣风", note: "下饭感强；地中海清淡风也能做，但要靠番茄、黑胡椒和香草拉清爽。" },
  { level: "B 轮换", score: 83, name: "包菜 + 蒜薹 + 胡萝卜 + 青椒", options: ["baoCabbage", "garlicScape", "carrot", "greenPepper"], flavor: "中式 / 中西结合风、川贵微辣风", note: "家常香气明显，蒜薹和青椒撑味。" },
  { level: "B 轮换", score: 82, name: "甘蓝 + 青椒 + 洋葱", options: ["cabbage", "greenPepper", "onion"], flavor: "地中海无番茄简易版", note: "不加番茄也有个性，甘蓝香、青椒爽和洋葱甜比较清楚。" },
  { level: "B 轮换", score: 82, name: "番茄 + 大白菜 + 芹菜 + 胡萝卜", options: ["tomato", "napaCabbage", "celery", "carrot"], flavor: "地中海清淡风（控盐执行） / 中式轻酱香版", note: "大白菜出水，芹菜提清香，适合控盐。" },
  { level: "B 轮换", score: 81, name: "番茄 + 豆角 + 胡萝卜 + 蒜薹", options: ["tomato", "greenBeans", "carrot", "garlicScape"], flavor: "中式 / 中西结合风、川贵微辣风", note: "豆角必须充分熟透，蒜薹补香。" },
  { level: "B 轮换", score: 80, name: "番茄 + 西葫芦 + 茄子 + 青椒", options: ["tomato", "zucchini", "eggplant", "greenPepper"], flavor: "地中海清淡风 / 中式轻酱香版", note: "质地和颜色丰富；想更下饭时可转中式或川贵微辣。" },
  { level: "B 轮换", score: 80, name: "番茄 + 芸豆 + 包菜 + 青椒", options: ["tomato", "kidneyBeans", "baoCabbage", "greenPepper"], flavor: "中式 / 中西结合风、川贵微辣风", note: "芸豆更厚实，必须焖透；包菜和番茄负责汤底与体积。" },
  { level: "B 轮换", score: 79, name: "番茄 + 秋葵 + 茄子", options: ["tomato", "okra", "eggplant"], flavor: "地中海清淡风 / 川贵微辣风", note: "秋葵让汤汁更稠；清淡版靠番茄和香草，重口版走川贵。" },
  { level: "B 轮换", score: 79, name: "大白菜 + 芹菜 + 杏鲍菇", options: ["napaCabbage", "celery", "kingOysterMushroom"], flavor: "地中海无番茄简易版 / 中式轻酱香版", note: "不加番茄也能靠大白菜出水，杏鲍菇吸汁。" },
  { level: "B 轮换", score: 75, name: "番茄 + 菜花 + 洋葱", options: ["tomato", "cauliflower", "onion"], flavor: "地中海清淡风", note: "菜花吸汁能力强，番茄能改善口感。" },
  { level: "B 轮换", score: 76, name: "番茄 + 丝瓜 + 油麦菜 + 芹菜", options: ["tomato", "loofah", "romaineLettuce", "celery"], flavor: "地中海清淡风（控盐执行）", note: "低负担、出水多，油麦菜最后短焖。" },
  { level: "C 调剂", score: 71, name: "茄子 + 青椒", options: ["eggplant", "greenPepper"], flavor: "中式 / 中西结合风、川贵微辣风", note: "家常味不错，但容易偏干，建议补番茄或清水。" }
];

const leafyOptions = ["shanghaiGreen", "spinach", "bokChoy", "milkCabbage", "romaineLettuce"];

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
    summary: "方案F是日常默认，F的4个鸡蛋可用等蛋白瘦肉替换，方案K仍是触发档。跑步日先看是否需要补碳，不默认靠K解决；早餐用牛奶125ml + 鸡蛋1个更平衡。",
    facts: [
      ["方案F", "鸡蛋4个（约200g），日常够用，操作最低"],
      ["F肉类替换", "鸡胸约110g、去皮鸭胸约125g、牛瘦肉约115g、猪瘦肉约125g，蛋白都接近25g"],
      ["方案K", "鸡蛋3个（约150g）+ 鸡胸100g，用于跑步叠加力量或高疲劳"],
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
    title: "第二餐肉类搭配",
    summary: "第二餐肉类以约55g蛋白为目标。单选时一种肉承担目标；多选时按蛋白均分，再反推每种肉重量。",
    facts: [
      ["目标", "肉类约55g蛋白"],
      ["多选", "按蛋白均分，不按重量均分"],
      ["可选", "鸡胸、去皮鸭胸、牛瘦肉、猪瘦肉"],
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
  secondMeats: ["chicken", "duck"],
  thirdMeal: "eggF",
  dietOpenPanels: ["day"],
  banana: false,
  buffer: false,
  knowledge: "plan",
  vegetableOptions: [],
  vegetableOpenPanels: ["main", "color", "juice"],
  vegetableStarted: false,
  braiseGarlicBase: "none",
  braiseOptions: [],
  braiseOpenPanels: [],
  braiseStarted: false
};

function readSavedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return {};

    const next = {};
    if (["today", "vegetables", "braise", "record", "rules"].includes(saved.view)) next.view = saved.view;
    if (saved.view === "knowledge") next.view = "rules";
    if (["settings", "meals"].includes(saved.mobilePanel)) next.mobilePanel = saved.mobilePanel;
    if (saved.mobilePanel === "totals") next.mobilePanel = "meals";
    if (dayTypes[saved.day]) next.day = saved.day;
    if (staples[saved.staple]) next.staple = saved.staple;
    if (breakfasts[saved.breakfast]) next.breakfast = saved.breakfast;
    if (Array.isArray(saved.secondMeats)) {
      const meats = saved.secondMeats.filter((meat) => validSecondMeats.includes(meat));
      if (meats.length) next.secondMeats = [...new Set(meats)];
    }
    if (thirdMeals[saved.thirdMeal]) next.thirdMeal = saved.thirdMeal;
    if (!saved.thirdMeal && saved.proteinK === true) next.thirdMeal = "k";
    if (Array.isArray(saved.dietOpenPanels)) {
      const panels = saved.dietOpenPanels.filter((panel) => validDietPanels.includes(panel));
      next.dietOpenPanels = panels;
    }
    if (knowledgeItems.some((item) => item.id === saved.knowledge)) next.knowledge = saved.knowledge;
    if (Array.isArray(saved.vegetableOptions)) {
      next.vegetableOptions = saved.vegetableOptions.filter((option) => validVegetableOptions.includes(option));
    }
    if (Array.isArray(saved.vegetableOpenPanels)) {
      const panels = saved.vegetableOpenPanels
        .map((panel) => panel === "leafy" ? "main" : panel)
        .filter((panel) => validVegetablePanels.includes(panel));
      next.vegetableOpenPanels = panels;
    }
    if (typeof saved.vegetableStarted === "boolean") next.vegetableStarted = saved.vegetableStarted;
    if (garlicBases[saved.braiseGarlicBase]) next.braiseGarlicBase = saved.braiseGarlicBase;
    if (Array.isArray(saved.braiseOptions)) {
      next.braiseOptions = saved.braiseOptions.filter((option) => validBraiseOptions.includes(option));
    }
    if (saved.braisePanelStateVersion === BRAISE_PANEL_STATE_VERSION && Array.isArray(saved.braiseOpenPanels)) {
      const panels = saved.braiseOpenPanels.filter((panel) => ["garlic", "soup", "spices"].includes(panel));
      next.braiseOpenPanels = panels;
    }
    if (typeof saved.braiseStarted === "boolean") next.braiseStarted = saved.braiseStarted;
    ["banana", "buffer"].forEach((key) => {
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
state.thirdMeal = recommendedThirdMealForBreakfast(state.breakfast, state.thirdMeal);

const els = {
  viewControls: document.querySelector("#viewControls"),
  viewPanels: document.querySelectorAll("[data-view-panel]"),
  mobileBottomNav: document.querySelector("#mobileBottomNav"),
  mobileSectionTabs: document.querySelector("#mobileSectionTabs"),
  mobilePanels: document.querySelectorAll("[data-mobile-panel-content]"),
  mealEditCards: document.querySelectorAll("[data-meal-edit]"),
  mobileDietHint: document.querySelector("#mobileDietHint"),
  mobileTotalHint: document.querySelector("#mobileTotalHint"),
  todayDate: document.querySelector("#todayDate"),
  plannerTitle: document.querySelector("#planner-title"),
  quickDayControls: document.querySelector("#quickDayControls"),
  executionCalories: document.querySelector("#executionCalories"),
  executionProtein: document.querySelector("#executionProtein"),
  executionWater: document.querySelector("#executionWater"),
  openSettingsButton: document.querySelector("#openSettingsButton"),
  settingsPanel: document.querySelector("#settingsPanel"),
  mealEditorTitle: document.querySelector("#mealEditorTitle"),
  closeMealEditorButton: document.querySelector("#closeMealEditorButton"),
  mealEditorBackdrop: document.querySelector("#mealEditorBackdrop"),
  mealTotalSummary: document.querySelector("#mealTotalSummary"),
  settingsSummary: document.querySelector("#settingsSummary"),
  dayControls: document.querySelector("#dayTypeControls"),
  stapleControls: document.querySelector("#stapleControls"),
  breakfastControls: document.querySelector("#breakfastControls"),
  secondMeatControls: document.querySelector("#secondMeatControls"),
  thirdMealControls: document.querySelector("#thirdMealControls"),
  dietPanels: document.querySelectorAll("[data-diet-panel]"),
  dietPanelToggles: document.querySelectorAll("[data-diet-panel-toggle]"),
  dietDaySummary: document.querySelector("#dietDaySummary"),
  dietStapleSummary: document.querySelector("#dietStapleSummary"),
  dietBreakfastSummary: document.querySelector("#dietBreakfastSummary"),
  dietSecondMeatSummary: document.querySelector("#dietSecondMeatSummary"),
  dietThirdMealSummary: document.querySelector("#dietThirdMealSummary"),
  dietAdjustSummary: document.querySelector("#dietAdjustSummary"),
  bananaToggle: document.querySelector("#bananaToggle"),
  bufferToggle: document.querySelector("#bufferToggle"),
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
  firstMealTime: document.querySelector("#firstMealTime"),
  firstMealHint: document.querySelector("#firstMealHint"),
  firstMealMeta: document.querySelector("#firstMealMeta"),
  secondMealText: document.querySelector("#secondMealText"),
  secondMealTime: document.querySelector("#secondMealTime"),
  secondMealHint: document.querySelector("#secondMealHint"),
  secondMealMeta: document.querySelector("#secondMealMeta"),
  thirdMealText: document.querySelector("#thirdMealText"),
  thirdMealTime: document.querySelector("#thirdMealTime"),
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
  vegetableHandoffActions: document.querySelector("#vegetableHandoffActions"),
  vegetableSummaryBar: document.querySelector("#vegetableSummaryBar"),
  vegetableSummaryStatus: document.querySelector("#vegetableSummaryStatus"),
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
  braiseSummaryAvoid: document.querySelector("#braiseSummaryAvoid"),
  prepViewButtons: document.querySelectorAll("[data-prep-view]"),
  viewLinkButtons: document.querySelectorAll("[data-view-link]"),
  recordDate: document.querySelector("#recordDate"),
  recordPlanTitle: document.querySelector("#recordPlanTitle"),
  recordPlanSummary: document.querySelector("#recordPlanSummary"),
  saveRecordButton: document.querySelector("#saveRecordButton"),
  recordFeedback: document.querySelector("#recordFeedback"),
  recordList: document.querySelector("#recordList")
};

function round(value, digits = 0) {
  return Number(value.toFixed(digits));
}

function formatDecimal(value) {
  return value.toFixed(1);
}

function roundToFive(value) {
  return Math.round(value / 5) * 5;
}

function getSelectedSecondMeats() {
  const selected = Array.isArray(state.secondMeats) ? state.secondMeats : defaultState.secondMeats;
  const valid = selected.filter((meat) => validSecondMeats.includes(meat));
  return valid.length ? [...new Set(valid)] : [...defaultState.secondMeats];
}

function calculateSecondMeatPlan() {
  const selected = getSelectedSecondMeats();
  const proteinShare = SECOND_MEAT_TARGET_PROTEIN / selected.length;
  const items = selected.map((id) => {
    const meat = secondMeats[id];
    const grams = proteinShare / (meat.proteinPer100 / 100);
    return {
      id,
      label: meat.label,
      grams,
      kcal: grams * meat.kcalPer100 / 100,
      protein: proteinShare,
      fat: grams * meat.fatPer100 / 100
    };
  });
  const totals = items.reduce((sum, item) => {
    sum.kcal += item.kcal;
    sum.protein += item.protein;
    sum.fat += item.fat;
    return sum;
  }, { kcal: 0, protein: 0, fat: 0 });

  return {
    items,
    totals,
    delta: {
      kcal: totals.kcal - SECOND_MEAT_BASELINE.kcal,
      protein: totals.protein - SECOND_MEAT_BASELINE.protein,
      fat: totals.fat - SECOND_MEAT_BASELINE.fat
    }
  };
}

function formatSecondMeatItems(items) {
  return items.map((item) => `${item.label}约${roundToFive(item.grams)}g`).join(" + ");
}

function secondMeatShortLabel(items) {
  return `二餐${items.map((item) => secondMeats[item.id].shortLabel).join("")}`;
}

function secondMealStapleText(stapleKey) {
  if (stapleKey === "rice") return "糙米100g";
  if (stapleKey === "potato") return "土豆150g";
  return "主食混搭";
}

function secondMealBaseKcal(stapleKey) {
  if (stapleKey === "rice") return 550;
  if (stapleKey === "potato") return 560;
  return 555;
}

function thirdMealOptionsForBreakfast(breakfastKey) {
  return breakfastKey === "egg4" ? egg4ThirdMealIds : standardThirdMealIds;
}

function recommendedThirdMealForBreakfast(breakfastKey, currentThirdMeal) {
  const options = thirdMealOptionsForBreakfast(breakfastKey);
  if (breakfastKey === "egg4") {
    if (currentThirdMeal === "eggF") return "lightChicken";
    return options.includes(currentThirdMeal) ? currentThirdMeal : "lightChicken";
  }
  if (lightThirdMealIds.includes(currentThirdMeal)) return "eggF";
  return currentThirdMeal;
}

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      view: state.view,
      mobilePanel: state.mobilePanel,
      day: state.day,
      staple: state.staple,
      breakfast: state.breakfast,
      secondMeats: state.secondMeats,
      thirdMeal: state.thirdMeal,
      dietOpenPanels: state.dietOpenPanels,
      banana: state.banana,
      buffer: state.buffer,
      knowledge: state.knowledge,
      vegetableOptions: state.vegetableOptions,
      vegetableOpenPanels: state.vegetableOpenPanels,
      vegetableStarted: state.vegetableStarted,
      braiseGarlicBase: state.braiseGarlicBase,
      braiseOptions: state.braiseOptions,
      braiseOpenPanels: state.braiseOpenPanels,
      braisePanelStateVersion: BRAISE_PANEL_STATE_VERSION,
      braiseStarted: state.braiseStarted
    }));
  } catch {
    // localStorage may be unavailable in restricted browser modes.
  }
}

function todayLabel(includeWeekday = false) {
  const now = new Date();
  const date = `${now.getMonth() + 1}月${now.getDate()}日`;
  if (!includeWeekday) return date;
  return `${date} 周${"日一二三四五六"[now.getDay()]}`;
}

function dateKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function readRecords() {
  try {
    const records = JSON.parse(window.localStorage.getItem(RECORD_STORAGE_KEY) || "[]");
    return Array.isArray(records) ? records.slice(0, 14) : [];
  } catch {
    return [];
  }
}

let records = readRecords();

function renderRecords() {
  const day = dayTypes[state.day];
  const total = calculate();
  const planCode = state.thirdMeal === "k" ? "K" : "F";
  els.recordDate.textContent = todayLabel();
  els.recordPlanTitle.textContent = `${day.label} · 方案 ${planCode}`;
  els.recordPlanSummary.textContent = `${round(total.kcal)} kcal · 蛋白 ${formatDecimal(total.protein)}g · ${day.water} · ${mealTimes.first} / ${mealTimes.second} / ${mealTimes.third}`;
  els.recordList.innerHTML = records.length
    ? records.map((record) => `<article class="record-item"><time>${record.dateLabel}</time><div><b>${record.title}</b><p>${record.summary}</p></div></article>`).join("")
    : '<p class="record-empty">还没有记录。执行完今天的方案后，在这里留一条即可。</p>';
}

function saveTodayRecord() {
  const day = dayTypes[state.day];
  const total = calculate();
  const planCode = state.thirdMeal === "k" ? "K" : "F";
  const record = {
    key: dateKey(),
    dateLabel: todayLabel(),
    title: `${day.label} · 方案 ${planCode}`,
    summary: `${round(total.kcal)} kcal · 蛋白 ${formatDecimal(total.protein)}g · ${day.water}`
  };
  records = [record, ...records.filter((item) => item.key !== record.key)].slice(0, 14);
  try {
    window.localStorage.setItem(RECORD_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Keep the current-session record visible when storage is restricted.
  }
  els.recordFeedback.textContent = "已记录今天的执行方案。当天再次保存会更新这条记录。";
  renderRecords();
}

function calculate() {
  const staple = staples[state.staple];
  const breakfast = breakfasts[state.breakfast];
  const secondMeatPlan = calculateSecondMeatPlan();
  const total = { ...staple };

  total.kcal += secondMeatPlan.delta.kcal;
  total.protein += secondMeatPlan.delta.protein;
  total.fat += secondMeatPlan.delta.fat;

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

  const thirdMeal = thirdMeals[state.thirdMeal] || thirdMeals.eggF;
  total.kcal += thirdMeal.kcal;
  total.protein += thirdMeal.protein;
  total.carbs += thirdMeal.carbs;
  total.fat += thirdMeal.fat;

  return total;
}

function setActive(container, attr, value) {
  container.querySelectorAll("button").forEach((button) => {
    const active = button.dataset[attr] === value;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function renderSecondMeatControls() {
  const selected = getSelectedSecondMeats();
  state.secondMeats = selected;
  els.secondMeatControls.querySelectorAll("button[data-second-meat]").forEach((button) => {
    const active = selected.includes(button.dataset.secondMeat);
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function renderThirdMealControls() {
  const optionIds = thirdMealOptionsForBreakfast(state.breakfast);
  if (!optionIds.includes(state.thirdMeal)) {
    state.thirdMeal = recommendedThirdMealForBreakfast(state.breakfast, state.thirdMeal);
  }
  els.thirdMealControls.dataset.mode = state.breakfast === "egg4" ? "light" : "standard";
  els.thirdMealControls.innerHTML = optionIds.map((id) => {
    const [title, detail] = thirdMealButtonText[id];
    const active = state.thirdMeal === id;
    return `<button type="button" data-third-meal="${id}" class="${active ? "active" : ""}" aria-pressed="${active ? "true" : "false"}"><strong>${title}</strong><small>${detail}</small></button>`;
  }).join("");
}

function setDietPanelOpen(panel, open) {
  const next = new Set(state.dietOpenPanels);
  if (open) {
    next.add(panel);
  } else {
    next.delete(panel);
  }
  state.dietOpenPanels = validDietPanels.filter((item) => next.has(item));
}

function renderDietPanels() {
  const openPanels = new Set(state.dietOpenPanels);
  els.dietPanels.forEach((panel) => {
    const open = openPanels.has(panel.dataset.dietPanel);
    panel.classList.toggle("collapsed", !open);
  });
  els.dietPanelToggles.forEach((button) => {
    const open = openPanels.has(button.dataset.dietPanelToggle);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function syncControls() {
  setActive(els.dayControls, "day", state.day);
  setActive(els.stapleControls, "staple", state.staple);
  setActive(els.breakfastControls, "breakfast", state.breakfast);
  renderSecondMeatControls();
  renderThirdMealControls();
  renderDietPanels();
  setActive(els.braiseGarlicBaseControls, "garlicBase", state.braiseGarlicBase);
  syncVegetableOptionButtons();
  syncBraiseOptionButtons();
  els.bananaToggle.checked = state.banana;
  els.bufferToggle.checked = state.buffer;
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
  if (status === "下限以下" || status === "偏低") return "warn";
  if (["赤字偏大", "偏低边缘", "偏高", "参考上限"].includes(status)) return "caution";
  return "good";
}

function buildMacroAssessment(total, proteinRatio, carbRatio) {
  const calorie = total.kcal < 1200
    ? [
        "赤字偏大",
        state.day === "run" || state.day === "strength"
          ? "训练日热量偏低；若头晕、掉力、持续饥饿、睡眠差或恢复差，优先加50g熟主食或香蕉。"
          : "减脂期可接受；若头晕、持续饥饿、睡眠变差、怕冷或第二天恢复差，再加50g熟主食或换回F鸡蛋。"
      ]
    : total.kcal < 1450
      ? ["减脂赤字", "处在计划内赤字；没有明显不适时可以保持。"]
      : total.kcal < 1650
        ? ["训练友好", "更适合跑步、力量或恢复压力较大的日子。"]
        : ["偏高", "若非高活动日，优先取消香蕉或主食缓冲。"];
  const mixedLowCarbHint = state.staple === "mixed"
    ? "混搭本身没问题；训练状态差时加50g熟重缓冲。"
    : null;
  let protein;
  if (proteinRatio < 1.3) {
    protein = ["下限以下", "低于减脂保肌下限，优先选F或加蛋白。"];
  } else if (proteinRatio < 1.4) {
    protein = ["下限档", "减脂期可接受；训练日建议升到稳妥档。"];
  } else if (proteinRatio < 1.55) {
    protein = ["稳妥档", "减脂保肌日常首选区间。"];
  } else if (proteinRatio < 1.6) {
    protein = ["稳妥上沿", "仍可执行，日常不必继续加蛋白。"];
  } else if (proteinRatio <= 1.7) {
    protein = ["参考上限", "适合跑步+力量、高疲劳或恢复压力大的日子。"];
  } else {
    protein = ["偏高", "已超过当前计划参考上沿，日常不用再加蛋白。"];
  }

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
    : fatRatio < 0.55
      ? ["偏低边缘", "偶尔可以；若怕冷、睡眠差或饥饿强，换回F鸡蛋或加少量油脂。"]
    : fatRatio > 0.85
      ? ["偏高", "今天少加油、少鸭皮和坚果。"]
      : ["合理", "处在减脂期可持续范围。"];

  return { calorie, protein, carb, fat };
}

function proteinSummary(status) {
  if (status === "稳妥档" || status === "稳妥上沿") return "蛋白稳妥";
  if (status === "参考上限") return "蛋白参考上限";
  if (status === "下限档") return "蛋白下限";
  return `蛋白${status}`;
}

function macroIssueSummary(issue) {
  if (!issue) return "";
  if (issue.kind === "calorie") return issue.status === "偏高" ? "热量偏高" : issue.status;
  if (issue.kind === "protein") return proteinSummary(issue.status);
  if (issue.kind === "carb") return `碳水${issue.status}`;
  if (issue.kind === "fat") return `脂肪${issue.status}`;
  return issue.status;
}

function buildMealAlertSummary(issues) {
  return issues.map(macroIssueSummary).join(" · ");
}

function renderNutritionRows(total, assessment, proteinRatio, carbRatio) {
  const rows = [
    {
      name: "热量",
      value: `${round(total.kcal)}`,
      unit: "kcal",
      status: assessment.calorie[0],
      note: assessment.calorie[1]
    },
    {
      name: "蛋白质",
      value: formatDecimal(total.protein),
      unit: "g",
      status: assessment.protein[0],
      note: `${formatDecimal(proteinRatio)} g/kg · ${assessment.protein[1]}`
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
  const totalButton = els.mobileSectionTabs.querySelector('[data-mobile-panel="meals"]');
  const nutritionButton = els.mobileBottomNav.querySelector('[data-view="today"]');
  todayButton?.classList.toggle("has-alert", hasAlert);
  totalButton?.classList.toggle("has-alert", hasAlert);
  nutritionButton?.classList.toggle("has-alert", hasAlert);
}

function renderPlanner() {
  const day = dayTypes[state.day];
  const staple = staples[state.staple];
  const breakfast = breakfasts[state.breakfast];
  const thirdMeal = thirdMeals[state.thirdMeal] || thirdMeals.eggF;
  const breakfastLinked = state.breakfast === "egg4";
  const secondMeatPlan = calculateSecondMeatPlan();
  const total = calculate();
  const proteinRatio = total.protein / PROFILE_WEIGHT_KG;
  const carbRatio = total.carbs / PROFILE_WEIGHT_KG;
  const assessment = buildMacroAssessment(total, proteinRatio, carbRatio);
  const alertStatuses = new Set(["赤字偏大", "下限以下", "偏低", "偏低边缘", "偏高"]);
  const macroChecks = [
    { kind: "calorie", status: assessment.calorie[0], text: assessment.calorie[1] },
    { kind: "protein", status: assessment.protein[0], text: assessment.protein[1] },
    { kind: "carb", status: assessment.carb[0], text: assessment.carb[1] },
    { kind: "fat", status: assessment.fat[0], text: assessment.fat[1] }
  ];
  const macroIssues = macroChecks.filter((item) => alertStatuses.has(item.status));
  const macroIssue = macroIssues[0];
  const planCode = state.thirdMeal === "k" ? "K" : "F";
  const calorieLow = Math.floor(total.kcal / 100) * 100;
  const calorieHigh = Math.ceil(total.kcal / 100) * 100;
  const proteinLow = Math.floor(total.protein / 5) * 5;
  const proteinHigh = Math.ceil(total.protein / 5) * 5;

  els.todayDate.textContent = todayLabel(true);
  els.plannerTitle.textContent = `今天按${day.label}方案 ${planCode}`;
  els.plannerLead.textContent = day.lead;
  els.waterTarget.textContent = day.water;
  els.todayTitle.textContent = `${day.label} · ${staple.label}主食`;
  els.statusPill.textContent = state.thirdMeal === "k" ? "已选择 K" : (breakfastLinked ? "早餐4蛋 · 第三餐轻补" : day.status);
  els.dailyTipTitle.textContent = macroIssue ? `营养提醒：${macroIssue.status}` : (breakfastLinked ? "早餐4蛋日，第三餐轻补" : (state.thirdMeal === "k" ? "恢复压力大时保留 K" : day.lead));
  els.dailyTipText.textContent = macroIssue ? macroIssue.text : (breakfastLinked ? "第三餐用轻补：鸡胸优先，也可换轻鸭/轻牛/轻猪；无备肉再选轻鸡蛋2个。" : `碳水 ${round(total.carbs)}g · 脂肪 ${formatDecimal(total.fat)}g · 蛋白 ${formatDecimal(proteinRatio)}g/kg`);
  els.settingsSummary.textContent = `${day.label} · ${staple.label} · ${breakfast.shortLabel} · ${secondMeatShortLabel(secondMeatPlan.items)} · ${thirdMeal.shortLabel} · ${state.banana ? "香蕉" : "无香蕉"}${state.buffer ? " · 50g缓冲" : ""}`;
  els.dietDaySummary.textContent = day.label;
  els.dietStapleSummary.textContent = staple.label;
  els.dietBreakfastSummary.textContent = breakfast.shortLabel;
  els.dietSecondMeatSummary.textContent = secondMeatPlan.items.map((item) => secondMeats[item.id].shortLabel).join("、");
  els.dietThirdMealSummary.textContent = thirdMeal.shortLabel;
  els.dietAdjustSummary.textContent = [state.banana ? "香蕉" : "", state.buffer ? "50g缓冲" : ""].filter(Boolean).join("、") || "无调整";
  els.mobileDietHint.textContent = `${day.label} · ${staple.label} · ${breakfast.shortLabel}`;
  els.mobileTotalHint.textContent = `${round(total.kcal)} kcal · ${formatDecimal(total.protein)}g蛋白`;
  els.executionCalories.textContent = `约 ${calorieLow.toLocaleString("zh-CN")}–${calorieHigh.toLocaleString("zh-CN")}`;
  els.executionProtein.textContent = `${proteinLow}–${proteinHigh}g`;
  els.executionWater.textContent = day.water.replace(" 水", "");
  els.mealTotalSummary.textContent = buildMealAlertSummary(macroIssues);
  els.mealTotalSummary.parentElement.hidden = macroIssues.length === 0;
  els.mealTotalSummary.parentElement.classList.toggle("has-alert", macroIssues.length > 0);
  els.todaySummary.textContent = `${staple.description}，第二餐肉类按${formatSecondMeatItems(secondMeatPlan.items)}执行，蔬菜约200g已计入，早餐为${breakfast.label}，第三餐为${thirdMeal.shortLabel}${breakfastLinked ? "（早餐4蛋日使用轻补，不叠加F整份）" : ""}，${state.banana ? "已计入香蕉" : "未计入香蕉"}，${state.buffer ? "已加50g主食缓冲" : "未加主食缓冲"}。`;
  setNutritionAlert(Boolean(macroIssue));
  renderNutritionRows(total, assessment, proteinRatio, carbRatio);
  els.proteinRatio.textContent = `${formatDecimal(proteinRatio)} g/kg`;
  els.carbRatio.textContent = `${formatDecimal(carbRatio)} g/kg`;
  els.proteinRatioBar.style.width = `${Math.min(100, Math.max(8, (proteinRatio / 1.8) * 100))}%`;
  els.carbRatioBar.style.width = `${Math.min(100, Math.max(8, (carbRatio / 2.2) * 100))}%`;

  els.firstMealText.textContent = breakfast.meal;
  els.firstMealTime.textContent = mealTimes.first;
  els.firstMealHint.textContent = breakfast.hint;
  els.secondMealText.textContent = `${formatSecondMeatItems(secondMeatPlan.items)} · 蔬菜200g · ${secondMealStapleText(state.staple)} · 橄榄油1汤匙`;
  els.secondMealTime.textContent = mealTimes.second;
  els.secondMealHint.textContent = secondMeatPlan.items.length === 1
    ? "单选时由这一种肉承担第二餐肉类蛋白目标。"
    : `多选时按蛋白均分，每种约${formatDecimal(SECOND_MEAT_TARGET_PROTEIN / secondMeatPlan.items.length)}g蛋白。`;
  els.thirdMealText.textContent = thirdMeal.label;
  els.thirdMealTime.textContent = mealTimes.third;
  els.thirdMealHint.textContent = thirdMeal.hint;
  els.firstMealMeta.textContent = `约 ${round(breakfast.mealKcal)} kcal · 蛋白 ${formatDecimal(breakfast.mealProtein)}g`;
  els.secondMealMeta.textContent = `约 ${round(secondMealBaseKcal(state.staple) + secondMeatPlan.delta.kcal)} kcal · 蛋白 60.5g · 含蔬菜`;
  els.thirdMealMeta.textContent = thirdMeal.meta;
  setActive(els.quickDayControls, "dayQuick", state.day);
  renderRecords();
}

function renderMobilePanel() {
  els.mobileSectionTabs.querySelectorAll("button").forEach((button) => {
    const active = button.dataset.mobilePanel === state.mobilePanel;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "true" : "false");
  });
  els.mobilePanels.forEach((panel) => {
    panel.classList.add("active");
  });
  renderMobileBottomNav();
}

function renderMobileBottomNav() {
  els.mobileBottomNav.querySelectorAll("button").forEach((button) => {
    const targetView = button.dataset.view;
    const active = button.dataset.viewGroup === "prep"
      ? ["vegetables", "braise"].includes(state.view)
      : state.view === targetView;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
}

function renderView() {
  document.body.dataset.view = state.view;
  els.viewControls.querySelectorAll("button").forEach((button) => {
    const active = button.dataset.viewGroup === "prep"
      ? ["vegetables", "braise"].includes(state.view)
      : button.dataset.view === state.view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  els.prepViewButtons.forEach((button) => {
    const active = button.dataset.prepView === state.view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "step" : "false");
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
  return missing.map((option) => option === "leafy" ? "上海青/菠菜/小白菜/奶白菜/油麦菜" : vegetableItems[option].short).join("、");
}

function vegetableNeedsTomato(selected) {
  const needs = ["cauliflower", "eggplant", "okra", "zucchini", "loofah", "greenBeans", "kidneyBeans"];
  return needs.some((option) => selected.has(option)) && !selected.has("tomato");
}

const carryFlavorLabels = {
  mediterranean: "地中海",
  chinese: "中式",
  sichuan: "川贵"
};

function carryFlavorOptionsFromLabel(flavor) {
  const candidates = [
    { flavor: "mediterranean", patterns: ["地中海", "清淡"] },
    { flavor: "chinese", patterns: ["中式", "中西", "轻酱香"] },
    { flavor: "sichuan", patterns: ["川贵"] }
  ];
  const matches = candidates
    .map((candidate) => {
      const indexes = candidate.patterns
        .map((pattern) => flavor.indexOf(pattern))
        .filter((index) => index >= 0);
      return indexes.length ? { flavor: candidate.flavor, index: Math.min(...indexes) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.flavor);
  return matches.length ? [...new Set(matches)] : ["mediterranean"];
}

function carryFlavorFromLabel(flavor) {
  return carryFlavorOptionsFromLabel(flavor)[0];
}

function buildBraiseCarryOptions(recommendation, flavorOverride) {
  const carryFlavor = flavorOverride || recommendation.carry.flavor;
  const options = new Set();
  if (recommendation.carry.soup === "tomato") options.add("tomato");
  if (recommendation.carry.soup === "water") options.add("water");
  if (carryFlavor === "sichuan") {
    options.add("guizhouDip");
    if (!options.has("tomato")) options.add("water");
  } else if (carryFlavor === "chinese") {
    options.add("soySauce");
    if (!options.has("tomato")) options.add("water");
  } else {
    options.add("onionPowder");
    options.add("blackPepper");
    options.add("thyme");
  }
  return validBraiseOptions.filter((option) => options.has(option));
}

function buildVegetableSaucePreview(recommendation) {
  const carryFlavor = recommendation.carry.flavor;
  const options = buildBraiseCarryOptions(recommendation, carryFlavor);
  const hasTomato = options.includes("tomato");
  const status = recommendation.carry.soup === "tomato" && !hasVegetableOption("tomato")
    ? "建议补番茄"
    : recommendation.carry.soup === "water"
      ? "建议补水"
      : "可直接做";
  const title = carryFlavor === "sichuan"
    ? "川贵微辣汁"
    : carryFlavor === "chinese"
      ? "中式轻酱汁"
      : hasTomato
        ? "番茄香草汁"
        : "清水香草汁";
  const garlic = state.braiseGarlicBase !== "none" ? garlicBases[state.braiseGarlicBase] : "蒜香进入后选";
  return {
    status,
    title,
    components: options.map((option) => braiseOptionLabels[option]).join(" · "),
    note: `${garlic} · 查看做法`,
    carryFlavor
  };
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
  const last = leafyOptions.filter((option) => option !== "milkCabbage" && selected.has(option)).map((option) => vegetableItems[option].short);
  const rows = [];
  if (first.length) rows.push(`先放：${first.join("、")}，耐熟或吸汁，需要先焖。`);
  if (middle.length) rows.push(`中段：${middle.join("、")}，翻拌后继续焖。`);
  if (selected.has("milkCabbage")) rows.push("分开放：奶白菜菜帮随中段入锅，菜叶最后1–2分钟放。");
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
      carry: { flavor: "mediterranean", flavors: ["mediterranean"], soup: null }
    };
  }

  const best = selectedCount >= 2 ? findBestVegetableCombo() : null;
  const exact = best && best.missing.length === 0;
  const near = best && best.missing.length === 1;
  const hasTomato = selected.has("tomato");
  const milkCabbageIsBase = selected.has("milkCabbage");
  const hasEggplantGreenPepper = selected.has("eggplant") && selected.has("greenPepper");
  const hasOkraEggplant = selected.has("okra") && selected.has("eggplant");
  const needsTomato = vegetableNeedsTomato(selected);

  let flavor = exact ? best.combo.flavor : "地中海清淡风";
  if (!exact && hasEggplantGreenPepper) flavor = "中式 / 中西结合风、川贵微辣风";
  if (!exact && hasOkraEggplant) flavor = hasTomato ? "地中海清淡风 / 川贵微辣风" : "中式 / 中西结合风、川贵微辣风";
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
  if (milkCabbageIsBase && selectedCount === 1) {
    addSuggestion(improve, "番茄 / 胡萝卜（可选）", "奶白菜约250–350g时已经可以独立承担蔬菜主体；想补颜色和风味时再加50–100g即可。");
  }
  if (!milkCabbageIsBase && !selected.has("edamame") && !selected.has("peas") && !selected.has("mixedVeg") && selectedCount <= 3) {
    addSuggestion(improve, "毛豆仁 / 青豆粒", "想增加颗粒感时加30-50g即可，计入全天摄入。");
  }

  const status = exact ? best.combo.level : near ? "接近好组合" : milkCabbageIsBase ? "可直接做" : selectedCount >= 3 ? "可优化" : "先补齐";
  const title = exact ? best.combo.level : near ? "差一个菜就很完整" : milkCabbageIsBase ? "奶白菜可作本餐主体" : selectedCount >= 3 ? "当前可用，建议微调" : "先补一个关键菜";
  const comboTitle = best ? `${best.combo.level} · ${best.combo.name}` : milkCabbageIsBase ? "奶白菜主体方案" : "暂无接近组合";
  const comboSummary = exact
    ? best.combo.note
    : near
      ? `当前很接近这组，建议补：${formatMissingVegetables(best.missing)}。`
      : best
        ? `最接近：${best.combo.name}；可按建议补齐，也可以直接做当前组合。`
        : milkCabbageIsBase
          ? "奶白菜约250–350g时不必再强制添加主体菜；份量较少时，再补包菜、菜花或杏鲍菇。"
          : "当前组合不在实践版主力表里，建议补番茄、甘蓝或洋葱这类结构菜。";

  const baseSummary = milkCabbageIsBase
    ? "奶白菜约250–350g时可独立承担蔬菜主体；菜帮先放，菜叶最后1–2分钟放。"
    : "";

  return {
    status,
    title,
    flavor,
    summary: `${baseSummary}${soup} 推荐风味：${flavor}。`,
    comboTitle,
    comboSummary,
    soup,
    improve,
    prep: buildPrepOrder(selected),
    carry: {
      flavor: carryFlavorFromLabel(flavor),
      flavors: carryFlavorOptionsFromLabel(flavor),
      soup: hasTomato || needsTomato ? "tomato" : "water"
    }
  };
}

function renderVegetableHandoff(recommendation, ready) {
  if (!ready) {
    return `<button type="button" class="handoff-button" disabled>查看焖菜做法</button>`;
  }
  const flavors = recommendation.carry.flavors || [recommendation.carry.flavor];
  if (flavors.length === 1) {
    return `<button type="button" class="handoff-button" data-vegetable-carry="${flavors[0]}">查看焖菜做法</button>`;
  }
  return `<span class="handoff-label">选择焖菜风味</span>
    <div class="handoff-options">
      ${flavors.map((flavor) => (
        `<button type="button" class="handoff-button handoff-choice" data-vegetable-carry="${flavor}">${carryFlavorLabels[flavor]}</button>`
      )).join("")}
    </div>`;
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
  const saucePreview = buildVegetableSaucePreview(recommendation);
  const selectedLabels = selectedVegetableLabels();
  const ready = state.vegetableStarted && state.vegetableOptions.length > 0;
  renderVegetableGroups();
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
  els.vegetableSummaryStatus.textContent = saucePreview.status;
  els.vegetableSummaryTitle.textContent = saucePreview.title;
  els.vegetableSummaryMeta.textContent = saucePreview.components;
  els.vegetableSummaryHint.textContent = ready ? saucePreview.note : "选择后显示";
  els.vegetableSummaryBar.dataset.vegetableCarry = ready ? saucePreview.carryFlavor : "";
  els.vegetableSummaryBar.setAttribute("aria-label", ready ? `${saucePreview.status}，${saucePreview.title}：${saucePreview.components}。查看详细做法` : "选择蔬菜后进入焖菜");
  els.vegetableSummaryBar.title = ready ? "带入当前料汁并查看详细做法" : "";
  els.vegetableSummaryBar.hidden = !ready;
  els.vegetableHandoffActions.innerHTML = renderVegetableHandoff(recommendation, ready);
}

function applyVegetablesToBraise(flavorOverride) {
  const recommendation = buildVegetableRecommendation();
  const next = new Set(state.braiseOptions);
  validBraiseOptions.forEach((option) => next.delete(option));
  buildBraiseCarryOptions(recommendation, flavorOverride).forEach((option) => next.add(option));
  state.braiseOptions = validBraiseOptions.filter((option) => next.has(option));
  state.braiseStarted = true;
  state.braiseOpenPanels = [];
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
  const hasSaltySource = hasSalt || hasParsleyGarlicSalt || hasSoy || hasOyster || hasGuizhou;
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

  if (!hasSaltySource) {
    addSuggestion(add, "少量盐", "可进料汁，从1/8茶匙起步；有生抽、蚝油或贵州蘸水时不要再加。");
    addSuggestion(finishAdd, "欧芹大蒜盐", "可少量进料汁，也可以吃的时候再撒；和盐、生抽、蚝油、贵州蘸水不要叠加。");
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

function selectDay(dayKey) {
  const day = dayTypes[dayKey];
  if (!day) return;
  state.day = dayKey;
  state.banana = day.bananaDefault;
  state.thirdMeal = recommendedThirdMealForBreakfast(state.breakfast, day.thirdMealDefault);
  els.bananaToggle.checked = state.banana;
  setActive(els.dayControls, "day", state.day);
  renderThirdMealControls();
  saveState();
  renderPlanner();
}

els.dayControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-day]");
  if (!button) return;
  selectDay(button.dataset.day);
});

els.quickDayControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-day-quick]");
  if (!button) return;
  selectDay(button.dataset.dayQuick);
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
  state.thirdMeal = recommendedThirdMealForBreakfast(state.breakfast, state.thirdMeal);
  setActive(els.breakfastControls, "breakfast", state.breakfast);
  renderThirdMealControls();
  saveState();
  renderPlanner();
});

els.secondMeatControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-second-meat]");
  if (!button) return;
  const meat = button.dataset.secondMeat;
  if (!validSecondMeats.includes(meat)) return;
  const selected = getSelectedSecondMeats();
  const next = selected.includes(meat)
    ? selected.filter((item) => item !== meat)
    : [...selected, meat];
  if (!next.length) return;
  state.secondMeats = next;
  renderSecondMeatControls();
  saveState();
  renderPlanner();
});

els.thirdMealControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-third-meal]");
  if (!button) return;
  state.thirdMeal = button.dataset.thirdMeal;
  setActive(els.thirdMealControls, "thirdMeal", state.thirdMeal);
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
  if (!state.vegetableStarted || !state.vegetableOptions.length) return;
  applyVegetablesToBraise(els.vegetableSummaryBar.dataset.vegetableCarry);
});

els.vegetableHandoffActions.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-vegetable-carry]");
  if (!button) return;
  applyVegetablesToBraise(button.dataset.vegetableCarry);
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

els.dietPanelToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const panel = toggle.dataset.dietPanelToggle;
    setDietPanelOpen(panel, !state.dietOpenPanels.includes(panel));
    saveState();
    renderDietPanels();
  });
});

els.viewControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  state.view = button.dataset.view;
  saveState();
  renderView();
});

els.prepViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.prepView;
    saveState();
    renderView();
  });
});

els.viewLinkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.viewLink;
    saveState();
    renderView();
  });
});

let activeMealEditorCard = null;

function closeMealEditor(restoreFocus = true) {
  const previousCard = activeMealEditorCard;
  activeMealEditorCard = null;
  document.body.classList.remove("meal-editor-open");
  els.settingsPanel.classList.remove("meal-context-editor");
  els.settingsPanel.removeAttribute("role");
  els.settingsPanel.removeAttribute("aria-modal");
  els.settingsPanel.removeAttribute("aria-labelledby");
  els.settingsPanel.open = false;
  els.mealEditorBackdrop.hidden = true;
  if (restoreFocus) previousCard?.focus({ preventScroll: true });
}

els.openSettingsButton.addEventListener("click", () => {
  closeMealEditor(false);
  els.settingsPanel.open = true;
  els.settingsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

function openMealEditor(panel, sourceCard) {
  if (!validDietPanels.includes(panel)) return;
  const editorTitles = {
    breakfast: "调整第一餐",
    secondMeat: "调整第二餐肉类",
    thirdMeal: "调整第三餐"
  };
  state.view = "today";
  state.mobilePanel = "settings";
  state.dietOpenPanels = [panel];
  activeMealEditorCard = sourceCard || null;
  document.body.classList.add("meal-editor-open");
  els.settingsPanel.classList.add("meal-context-editor");
  els.settingsPanel.setAttribute("role", "dialog");
  els.settingsPanel.setAttribute("aria-modal", "true");
  els.settingsPanel.setAttribute("aria-labelledby", "mealEditorTitle");
  els.mealEditorTitle.textContent = editorTitles[panel] || "调整餐次";
  els.settingsPanel.open = true;
  els.mealEditorBackdrop.hidden = false;
  renderMobilePanel();
  renderDietPanels();
  saveState();
  window.requestAnimationFrame(() => {
    const target = document.querySelector(`[data-diet-panel="${panel}"]`);
    target?.querySelector(".panel-body button, .panel-body input")?.focus({ preventScroll: true });
  });
}

els.mealEditCards.forEach((card) => {
  card.addEventListener("click", () => openMealEditor(card.dataset.mealEdit, card));
  card.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    openMealEditor(card.dataset.mealEdit, card);
  });
});

els.closeMealEditorButton.addEventListener("click", () => closeMealEditor());
els.mealEditorBackdrop.addEventListener("click", () => closeMealEditor());
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("meal-editor-open")) {
    closeMealEditor();
  }
});

els.saveRecordButton.addEventListener("click", saveTodayRecord);

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
renderRecords();
renderView();

if ("serviceWorker" in navigator && ["https:", "http:"].includes(window.location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The page still works normally if installation support is unavailable.
    });
  });
}
