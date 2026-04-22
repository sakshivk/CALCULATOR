const display = document.getElementById("display");
const angleModeButton = document.getElementById("angle-mode");
const memoryIndicator = document.getElementById("memory-indicator");
const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history");
let expression = "";
let lastAnswer = 0;
let angleMode = "DEG";
let memoryValue = 0;
const historyEntries = [];

function formatValue(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }
  if (Math.abs(value) > 1e12 || (Math.abs(value) < 1e-8 && value !== 0)) {
    return value.toExponential(8).replace(/\.0+e/, "e");
  }
  return String(Number(value.toFixed(10)));
}

function updateMemoryIndicator() {
  memoryIndicator.textContent = `M: ${formatValue(memoryValue)}`;
}

function renderHistory() {
  historyList.innerHTML = "";

  if (!historyEntries.length) {
    const emptyRow = document.createElement("li");
    emptyRow.className = "history-empty";
    emptyRow.textContent = "No calculations yet";
    historyList.appendChild(emptyRow);
    return;
  }

  historyEntries.forEach((entry) => {
    const row = document.createElement("li");
    row.textContent = `${entry.expression} = ${entry.result}`;
    historyList.appendChild(row);
  });
}

function pushHistory(rawExpression, result) {
  historyEntries.unshift({
    expression: rawExpression,
    result: formatValue(result)
  });

  if (historyEntries.length > 8) {
    historyEntries.pop();
  }

  renderHistory();
}

function clearHistory() {
  historyEntries.length = 0;
  renderHistory();
}

function updateDisplay(value) {
  display.textContent = value || "0";
}

function appendValue(value) {
  if (expression === "0" && value !== ".") {
    expression = value;
  } else {
    expression += value;
  }
  updateDisplay(expression);
}

function clearAll() {
  expression = "";
  updateDisplay(expression);
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay(expression);
}

function toggleSign() {
  if (!expression) {
    expression = "-";
  } else if (expression.startsWith("-")) {
    expression = expression.slice(1);
  } else {
    expression = `-${expression}`;
  }
  updateDisplay(expression);
}

function useAnswer() {
  appendValue(String(lastAnswer));
}

function toggleAngleMode() {
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  angleModeButton.textContent = angleMode;
}

function canEvaluate(text) {
  if (!/^[0-9+\-*/%^().,\sA-Za-z]+$/.test(text)) {
    return false;
  }

  const allowedWords = new Set(["sin", "cos", "tan", "log", "ln", "sqrt", "pi", "e", "abs"]);
  const words = text.match(/[A-Za-z]+/g) || [];
  return words.every((word) => allowedWords.has(word));
}

function toRadians(angle) {
  return angleMode === "DEG" ? (angle * Math.PI) / 180 : angle;
}

function prepareExpression(input) {
  return input
    .replace(/\^/g, "**")
    .replace(/\bpi\b/g, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\blog\s*\(/g, "Math.log10(")
    .replace(/\bln\s*\(/g, "Math.log(")
    .replace(/\bsqrt\s*\(/g, "Math.sqrt(")
    .replace(/\babs\s*\(/g, "Math.abs(")
    .replace(/\bsin\s*\(/g, "trig.sin(")
    .replace(/\bcos\s*\(/g, "trig.cos(")
    .replace(/\btan\s*\(/g, "trig.tan(");
}

function evaluateExpression(rawExpression) {
  if (!canEvaluate(rawExpression)) {
    throw new Error("Invalid expression");
  }

  const prepared = prepareExpression(rawExpression);
  const trig = {
    sin: (value) => Math.sin(toRadians(value)),
    cos: (value) => Math.cos(toRadians(value)),
    tan: (value) => Math.tan(toRadians(value))
  };
  const result = Function("trig", `"use strict"; return (${prepared})`)(trig);
  if (!Number.isFinite(result)) {
    throw new Error("Invalid result");
  }

  return Number(result);
}

function getMemoryOperand() {
  if (expression.trim()) {
    return evaluateExpression(expression);
  }
  return Number(display.textContent) || 0;
}

function memoryClear() {
  memoryValue = 0;
  updateMemoryIndicator();
}

function memoryRecall() {
  appendValue(formatValue(memoryValue));
}

function memoryAdd() {
  try {
    memoryValue += getMemoryOperand();
    updateMemoryIndicator();
  } catch {
    updateDisplay("Error");
    expression = "";
  }
}

function memorySubtract() {
  try {
    memoryValue -= getMemoryOperand();
    updateMemoryIndicator();
  } catch {
    updateDisplay("Error");
    expression = "";
  }
}

function calculateResult() {
  if (!expression.trim()) {
    return;
  }

  try {
    const inputExpression = expression;
    const result = evaluateExpression(inputExpression);
    lastAnswer = result;
    expression = formatValue(result);
    updateDisplay(expression);
    pushHistory(inputExpression, result);
  } catch {
    updateDisplay("Error");
    expression = "";
  }
}

document.querySelector(".buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value) {
    appendValue(value);
    return;
  }

  if (action === "clear") clearAll();
  if (action === "delete") deleteLast();
  if (action === "toggle-sign") toggleSign();
  if (action === "use-answer") useAnswer();
  if (action === "toggle-angle") toggleAngleMode();
  if (action === "memory-clear") memoryClear();
  if (action === "memory-recall") memoryRecall();
  if (action === "memory-add") memoryAdd();
  if (action === "memory-subtract") memorySubtract();
  if (action === "equals") calculateResult();
});

clearHistoryButton.addEventListener("click", clearHistory);

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  const key = event.key;
  const lowerKey = key.toLowerCase();

  if (/^[0-9+\-*/%^().]$/.test(key)) {
    appendValue(key);
    return;
  }

  if (lowerKey === "s") appendValue("sin(");
  if (lowerKey === "c") appendValue("cos(");
  if (lowerKey === "t") appendValue("tan(");
  if (lowerKey === "l") appendValue("log(");
  if (lowerKey === "n") appendValue("ln(");
  if (lowerKey === "q") appendValue("sqrt(");
  if (lowerKey === "a") appendValue("abs(");
  if (lowerKey === "p") appendValue("pi");
  if (lowerKey === "r") useAnswer();
  if (lowerKey === "d") toggleAngleMode();
  if (lowerKey === "m") memoryRecall();

  if (key === "Enter") {
    event.preventDefault();
    calculateResult();
  }

  if (key === "Backspace") deleteLast();
  if (key === "Escape") clearAll();
});

angleModeButton.textContent = angleMode;
updateMemoryIndicator();
renderHistory();
updateDisplay(expression);
