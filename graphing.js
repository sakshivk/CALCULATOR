const graphExpressionInput = document.getElementById("graph-expression");
const graphRangeInput = document.getElementById("graph-range");
const graphCanvas = document.getElementById("graph-canvas");
const graphMessage = document.getElementById("graph-message");
const plotButton = document.getElementById("plot-btn");
const resetButton = document.getElementById("reset-btn");
const graphCtx = graphCanvas.getContext("2d");

function normalizeGraphExpression(expression) {
  return expression
    .replace(/\^/g, "**")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bsin\s*\(/gi, "Math.sin(")
    .replace(/\bcos\s*\(/gi, "Math.cos(")
    .replace(/\btan\s*\(/gi, "Math.tan(")
    .replace(/\blog\s*\(/gi, "Math.log10(")
    .replace(/\bln\s*\(/gi, "Math.log(")
    .replace(/\bsqrt\s*\(/gi, "Math.sqrt(")
    .replace(/\babs\s*\(/gi, "Math.abs(");
}

function validateGraphExpression(expression) {
  if (!/^[0-9+\-*/%^().,\sA-Za-z]+$/.test(expression)) {
    return false;
  }

  const allowedWords = new Set(["x", "sin", "cos", "tan", "log", "ln", "sqrt", "abs", "pi", "e"]);
  const words = expression.match(/[A-Za-z]+/g) || [];
  return words.every((word) => allowedWords.has(word.toLowerCase()));
}

function toCanvasX(x, xMin, xMax) {
  return ((x - xMin) / (xMax - xMin)) * graphCanvas.width;
}

function toCanvasY(y, yMin, yMax) {
  return graphCanvas.height - ((y - yMin) / (yMax - yMin)) * graphCanvas.height;
}

function drawAxes(xMin, xMax, yMin, yMax) {
  graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

  graphCtx.lineWidth = 1;
  graphCtx.strokeStyle = "#cbd5e1";

  for (let i = 0; i <= 10; i += 1) {
    const gx = (i / 10) * graphCanvas.width;
    const gy = (i / 10) * graphCanvas.height;

    graphCtx.beginPath();
    graphCtx.moveTo(gx, 0);
    graphCtx.lineTo(gx, graphCanvas.height);
    graphCtx.stroke();

    graphCtx.beginPath();
    graphCtx.moveTo(0, gy);
    graphCtx.lineTo(graphCanvas.width, gy);
    graphCtx.stroke();
  }

  graphCtx.strokeStyle = "#0f172a";
  graphCtx.lineWidth = 2;

  const xAxisY = toCanvasY(0, yMin, yMax);
  if (xAxisY >= 0 && xAxisY <= graphCanvas.height) {
    graphCtx.beginPath();
    graphCtx.moveTo(0, xAxisY);
    graphCtx.lineTo(graphCanvas.width, xAxisY);
    graphCtx.stroke();
  }

  const yAxisX = toCanvasX(0, xMin, xMax);
  if (yAxisX >= 0 && yAxisX <= graphCanvas.width) {
    graphCtx.beginPath();
    graphCtx.moveTo(yAxisX, 0);
    graphCtx.lineTo(yAxisX, graphCanvas.height);
    graphCtx.stroke();
  }
}

function plotGraph() {
  const rawExpression = graphExpressionInput.value.trim();
  const rangeValue = Number(graphRangeInput.value);

  if (!rawExpression) {
    graphMessage.textContent = "Enter an expression first.";
    return;
  }

  if (!Number.isFinite(rangeValue) || rangeValue <= 0) {
    graphMessage.textContent = "Range must be a positive number.";
    return;
  }

  if (!validateGraphExpression(rawExpression)) {
    graphMessage.textContent = "Expression contains unsupported symbols.";
    return;
  }

  const preparedExpression = normalizeGraphExpression(rawExpression);
  const xMin = -Math.abs(rangeValue);
  const xMax = Math.abs(rangeValue);
  const points = [];
  let yMin = Infinity;
  let yMax = -Infinity;

  try {
    const evaluator = Function("x", `"use strict"; return (${preparedExpression});`);
    const sampleCount = 700;

    for (let i = 0; i <= sampleCount; i += 1) {
      const x = xMin + (i / sampleCount) * (xMax - xMin);
      const y = Number(evaluator(x));

      if (Number.isFinite(y)) {
        points.push({ x, y });
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
      }
    }
  } catch {
    graphMessage.textContent = "Could not parse this expression.";
    return;
  }

  if (!points.length) {
    graphMessage.textContent = "No drawable points found in this range.";
    return;
  }

  const ySpread = yMax - yMin;
  if (ySpread === 0) {
    yMin -= 1;
    yMax += 1;
  } else {
    yMin -= ySpread * 0.15;
    yMax += ySpread * 0.15;
  }

  drawAxes(xMin, xMax, yMin, yMax);

  graphCtx.strokeStyle = "#0ea5e9";
  graphCtx.lineWidth = 2.5;
  graphCtx.beginPath();

  let started = false;
  for (const point of points) {
    const px = toCanvasX(point.x, xMin, xMax);
    const py = toCanvasY(point.y, yMin, yMax);

    if (!started) {
      graphCtx.moveTo(px, py);
      started = true;
    } else {
      graphCtx.lineTo(px, py);
    }
  }

  graphCtx.stroke();
  graphMessage.textContent = `Plotted y = ${rawExpression} for x in [${xMin}, ${xMax}]`;
}

plotButton.addEventListener("click", plotGraph);

resetButton.addEventListener("click", () => {
  graphExpressionInput.value = "sin(x)";
  graphRangeInput.value = "10";
  graphMessage.textContent = "";
  drawAxes(-10, 10, -10, 10);
});

drawAxes(-10, 10, -10, 10);
