const builtins = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  log: Math.log10,
  ln: Math.log,
  sqrt: Math.sqrt,
  abs: Math.abs,
  pow: Math.pow,
  pi: Math.PI,
  e: Math.E
};

function parseVariables(input) {
  const variables = {};
  const lines = input.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
    if (!match) {
      throw new Error(`Invalid variable line: ${line}`);
    }

    const name = match[1];
    const expression = match[2];
    variables[name] = evaluateExpression(expression, variables);
  }

  return variables;
}

function normalizeExpression(expression) {
  return expression.replace(/\^/g, "**");
}

function ensureAllowedTokens(expression, scopeKeys) {
  if (!/^[0-9+\-*/%^().,\sA-Za-z_]+$/.test(expression)) {
    throw new Error("Expression has unsupported symbols.");
  }

  const words = expression.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];
  const allowed = new Set(scopeKeys);

  for (const token of words) {
    if (!allowed.has(token)) {
      throw new Error(`Unknown symbol: ${token}`);
    }
  }
}

function evaluateExpression(rawExpression, vars = {}) {
  const expression = normalizeExpression(rawExpression);
  const scope = { ...builtins, ...vars };
  const keys = Object.keys(scope);

  ensureAllowedTokens(expression, keys);

  const values = keys.map((key) => scope[key]);
  const result = Function(...keys, `"use strict"; return (${expression});`)(...values);

  if (!Number.isFinite(result)) {
    throw new Error("Result is not finite.");
  }

  return Number(result);
}

function evaluateFromUi() {
  const varInput = document.getElementById("var-input").value;
  const expression = document.getElementById("expr-input").value.trim();
  const output = document.getElementById("expr-output");

  try {
    const vars = parseVariables(varInput);
    const result = evaluateExpression(expression, vars);
    output.textContent = `Result: ${result}`;
  } catch (error) {
    output.textContent = `Result: Error - ${error.message}`;
  }
}

function runProgram() {
  const varInput = document.getElementById("var-input").value;
  const program = document.getElementById("program-input").value;
  const output = document.getElementById("program-output");

  try {
    const vars = parseVariables(varInput);
    const lines = program.split(/\r?\n/);
    const prints = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        continue;
      }

      if (line.toUpperCase() === "CLEAR") {
        Object.keys(vars).forEach((key) => delete vars[key]);
        continue;
      }

      const setMatch = line.match(/^SET\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/i);
      if (setMatch) {
        const [, name, expression] = setMatch;
        vars[name] = evaluateExpression(expression, vars);
        continue;
      }

      const printMatch = line.match(/^PRINT\s+(.+)$/i);
      if (printMatch) {
        const value = evaluateExpression(printMatch[1], vars);
        prints.push(value);
        continue;
      }

      throw new Error(`Unknown command: ${line}`);
    }

    output.textContent = `Output:\n${prints.length ? prints.join("\n") : "(no PRINT output)"}`;
  } catch (error) {
    output.textContent = `Output:\nError - ${error.message}`;
  }
}

document.getElementById("eval-expr").addEventListener("click", evaluateFromUi);
document.getElementById("run-program").addEventListener("click", runProgram);
