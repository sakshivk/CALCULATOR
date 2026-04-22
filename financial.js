function getNumeric(id) {
  return Number(document.getElementById(id).value);
}

function toMoney(value) {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function showResult(id, text) {
  document.getElementById(id).textContent = text;
}

document.getElementById("si-calc").addEventListener("click", () => {
  const principal = getNumeric("si-principal");
  const rate = getNumeric("si-rate");
  const time = getNumeric("si-time");

  if (![principal, rate, time].every((v) => Number.isFinite(v) && v >= 0)) {
    showResult("si-output", "Result: Please enter valid non-negative values.");
    return;
  }

  const interest = (principal * rate * time) / 100;
  const amount = principal + interest;
  showResult("si-output", `Result: SI = ${toMoney(interest)}, Total = ${toMoney(amount)}`);
});

document.getElementById("ci-calc").addEventListener("click", () => {
  const principal = getNumeric("ci-principal");
  const rate = getNumeric("ci-rate");
  const time = getNumeric("ci-time");
  const n = getNumeric("ci-frequency");

  if (![principal, rate, time, n].every((v) => Number.isFinite(v) && v >= 0) || n === 0) {
    showResult("ci-output", "Result: Enter valid values and n > 0.");
    return;
  }

  const amount = principal * (1 + rate / (100 * n)) ** (n * time);
  const interest = amount - principal;
  showResult("ci-output", `Result: Amount = ${toMoney(amount)}, Interest = ${toMoney(interest)}`);
});

document.getElementById("emi-calc").addEventListener("click", () => {
  const principal = getNumeric("emi-principal");
  const annualRate = getNumeric("emi-rate");
  const years = getNumeric("emi-years");

  if (![principal, annualRate, years].every((v) => Number.isFinite(v) && v >= 0)) {
    showResult("emi-output", "Result: Please enter valid non-negative values.");
    return;
  }

  const monthlyRate = annualRate / 1200;
  const months = years * 12;

  if (months === 0) {
    showResult("emi-output", "Result: Tenure must be greater than 0.");
    return;
  }

  let emi = 0;
  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    const factor = (1 + monthlyRate) ** months;
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalPaid = emi * months;
  const totalInterest = totalPaid - principal;

  showResult(
    "emi-output",
    `Result: EMI = ${toMoney(emi)} per month, Total Interest = ${toMoney(totalInterest)}`
  );
});
