const PROFILE_WEIGHT_KG = 75;

const dayTypes = {
  rest: {
    label: "休息日",
    status: "基础份",
    water: "2-2.5L",
    actions: [
      "早餐按牛奶 125ml + 鸡蛋 1 个，第三餐默认方案 F。",
      "第二餐肉类按鸡胸 150g + 鸭胸 100g；想省事可按天轮换。",
      "第二餐只吃一份主食额度，不主动加 50g 缓冲。",
      "香蕉可不加，保留更大的热量赤字。"
    ]
  },
  recovery: {
    label: "恢复日",
    status: "稳住赤字",
    water: "2-2.5L",
    actions: [
      "早餐维持牛奶 125ml + 鸡蛋 1 个，别把牛奶作为主要蛋白来源。",
      "按基础份吃，主食可选土豆或土豆紫薯混搭提高饱腹感。",
      "如果只是轻微疲劳，先补水和睡眠，不急着加主食。",
      "第三餐按方案 F 执行，操作简单且蛋白质够用。"
    ]
  },
  strength: {
    label: "力量日",
    status: "看训练状态",
    water: "2.3-2.8L",
    actions: [
      "基础碳水略紧但可用，训练掉力时再加 50g 熟重主食。",
      "日常方案 F 蛋白已经足够；疲劳明显时再从方案 F 升到方案 K。",
      "训练后先补水，再判断是否需要主食缓冲。"
    ]
  },
  run: {
    label: "5km 跑步日",
    status: "跑前香蕉",
    water: "2.5-3L",
    actions: [
      "跑前 30-60 分钟吃 1 根香蕉。",
      "第三餐可从 F 升到 K；如果当天状态很好，也可以继续 F。",
      "第二餐仍按一份主食额度执行，不把土豆和米饭完整叠加。",
      "跑后超过 1 小时仍腿沉时，再加 50g 熟重主食。"
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
    description: "糙米基础日（优化早餐 + 方案 F）"
  },
  potato: {
    label: "土豆",
    kcal: 1318,
    protein: 108.8,
    carbs: 115,
    fat: 50.0,
    secondMeal: "鸡胸150g + 鸭胸100g · 土豆150g",
    description: "土豆基础日（优化早餐 + 方案 F）"
  },
  mixed: {
    label: "混搭",
    kcal: 1313,
    protein: 108.8,
    carbs: 112,
    fat: 50.0,
    secondMeal: "鸡胸150g + 鸭胸100g · 主食混搭",
    description: "主食混搭日（优化早餐 + 方案 F）"
  }
};

const banana = { kcal: 105, protein: 1.3, carbs: 27, fat: 0.3 };
const buffer = { kcal: 45, protein: 0, carbs: 10, fat: 0 };

const state = {
  day: "run",
  staple: "potato",
  banana: true,
  buffer: false
};

const els = {
  dayControls: document.querySelector("#dayTypeControls"),
  stapleControls: document.querySelector("#stapleControls"),
  bananaToggle: document.querySelector("#bananaToggle"),
  bufferToggle: document.querySelector("#bufferToggle"),
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
  secondMealText: document.querySelector("#secondMealText"),
  actionList: document.querySelector("#actionList")
};

function round(value, digits = 0) {
  return Number(value.toFixed(digits));
}

function formatDecimal(value) {
  return value.toFixed(1);
}

function calculate() {
  const staple = staples[state.staple];
  const total = { ...staple };

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

  return total;
}

function setActive(container, attr, value) {
  container.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset[attr] === value);
  });
}

function render() {
  const day = dayTypes[state.day];
  const staple = staples[state.staple];
  const total = calculate();
  const proteinRatio = total.protein / PROFILE_WEIGHT_KG;
  const carbRatio = total.carbs / PROFILE_WEIGHT_KG;
  const proteinPercent = Math.min(100, Math.max(18, (proteinRatio / 1.8) * 100));
  const carbPercent = Math.min(100, Math.max(18, (carbRatio / 2.2) * 100));

  els.todayTitle.textContent = `${day.label} · ${staple.label}主食`;
  els.statusPill.textContent = state.buffer ? "已加 50g 缓冲" : day.status;
  els.todaySummary.textContent = `${staple.description}，早餐按牛奶125ml+鸡蛋1个，${state.banana ? "已计入跑步日香蕉" : "未计入香蕉"}，${state.buffer ? "已启用训练状态缓冲" : "未启用主食缓冲"}。饮水目标 ${day.water}。`;

  els.kcalValue.textContent = round(total.kcal);
  els.proteinValue.textContent = formatDecimal(total.protein);
  els.carbValue.textContent = round(total.carbs);
  els.fatValue.textContent = formatDecimal(total.fat);
  els.proteinRatio.textContent = `${formatDecimal(proteinRatio)} g/kg`;
  els.carbRatio.textContent = `${formatDecimal(carbRatio)} g/kg`;
  els.proteinBar.style.width = `${proteinPercent}%`;
  els.carbBar.style.width = `${carbPercent}%`;
  els.secondMealText.textContent = staple.secondMeal;

  const actions = [...day.actions];
  if (state.day !== "run" && state.banana) {
    actions.unshift("你已手动计入香蕉，记得把这 105 kcal 当作计划内加餐。");
  }
  if (state.day === "run" && !state.banana) {
    actions.unshift("跑步日建议打开香蕉开关，当前碳水会偏紧。");
  }
  if (state.buffer) {
    actions.push("50g 缓冲已经计入。今天结束后观察饥饿感、腿沉和恢复速度。");
  }

  els.actionList.innerHTML = actions.map((item) => `<li>${item}</li>`).join("");
}

els.dayControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-day]");
  if (!button) return;
  state.day = button.dataset.day;
  state.banana = state.day === "run";
  els.bananaToggle.checked = state.banana;
  setActive(els.dayControls, "day", state.day);
  render();
});

els.stapleControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-staple]");
  if (!button) return;
  state.staple = button.dataset.staple;
  setActive(els.stapleControls, "staple", state.staple);
  render();
});

els.bananaToggle.addEventListener("change", () => {
  state.banana = els.bananaToggle.checked;
  render();
});

els.bufferToggle.addEventListener("change", () => {
  state.buffer = els.bufferToggle.checked;
  render();
});

render();
