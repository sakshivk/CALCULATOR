const simpleDisplay = document.getElementById("simple-display");
let simpleExpression = "";

function updateSimpleDisplay(value) {
  simpleDisplay.textContent = value || "0";
}

function appendSimpleValue(value) {
  if (simpleExpression === "0" && value !== ".") {
    simpleExpression = value;
  } else {
    simpleExpression += value;
  }
  updateSimpleDisplay(simpleExpression);
}

function clearSimple() {
  simpleExpression = "";
  updateSimpleDisplay(simpleExpression);
}

function deleteSimple() {
  simpleExpression = simpleExpression.slice(0, -1);
  updateSimpleDisplay(simpleExpression);
}

function runSimpleCalculation() {
  if (!simpleExpression.trim()) {
    return;
  }

  if (!/^[0-9+\-*/%.()\s]+$/.test(simpleExpression)) {
    updateSimpleDisplay("Error");
    simpleExpression = "";
    return;
  }

  try {
    const result = Function(`"use strict"; return (${simpleExpression})`)();
    if (!Number.isFinite(result)) {
      throw new Error("Bad result");
    }
    simpleExpression = String(result);
    updateSimpleDisplay(simpleExpression);
  } catch {
    updateSimpleDisplay("Error");
    simpleExpression = "";
  }
}

document.querySelector(".grid").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  if (button.dataset.value) {
    appendSimpleValue(button.dataset.value);
    return;
  }

  if (button.dataset.action === "clear") clearSimple();
  if (button.dataset.action === "delete") deleteSimple();
  if (button.dataset.action === "equals") runSimpleCalculation();
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9+\-*/%.]$/.test(event.key)) {
    appendSimpleValue(event.key);
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    runSimpleCalculation();
  }

  if (event.key === "Backspace") deleteSimple();
  if (event.key === "Escape") clearSimple();
});

updateSimpleDisplay(simpleExpression);
