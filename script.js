
function calculateTaxForIncome(income) {
  const slabs = [
    { minIncome: 0, maxIncome: 600000, fixedTax: 0, rate: 0.0 },
    { minIncome: 600001, maxIncome: 1200000, fixedTax: 0, rate: 0.01 },
    { minIncome: 1200001, maxIncome: 2200000, fixedTax: 6000, rate: 0.11 },
    { minIncome: 2200001, maxIncome: 3200000, fixedTax: 116000, rate: 0.23 },
    { minIncome: 3200001, maxIncome: 4100000, fixedTax: 346000, rate: 0.30 },
    { minIncome: 4100001, maxIncome: 1e18, fixedTax: 616000, rate: 0.35 },
  ];

  for (let slab of slabs) {
    if (income <= slab.maxIncome) {
      let tax = slab.fixedTax + (income - slab.minIncome) * slab.rate;
      return Math.round(tax);
    }
  }

  const last = slabs[slabs.length - 1];
  return Math.round(last.fixedTax + (income - last.minIncome) * last.rate);
}

function calculateTax() {
  const totalIncome = parseFloat(document.getElementById('income').value);
  const people = parseInt(document.getElementById('individuals').value);

  if (isNaN(totalIncome) || isNaN(people) || totalIncome <= 0 || people <= 0) {
    showResult('Please enter valid income and number of individuals.');
    return;
  }

  let shares = Array(people).fill(0);
  let remaining = totalIncome;

  // 1st round: 600k tax-free
  for (let i = 0; i < people && remaining > 0; i++) {
    let assign = Math.min(600000, remaining);
    shares[i] += assign;
    remaining -= assign;
  }

  // 2nd round: next 600k
  for (let i = 0; i < people && remaining > 0; i++) {
    let assign = Math.min(600000, remaining);
    shares[i] += assign;
    remaining -= assign;
  }

  // Further: up to 1 million per person
  while (remaining > 0) {
    for (let i = 0; i < people && remaining > 0; i++) {
      let assign = Math.min(1000000, remaining);
      shares[i] += assign;
      remaining -= assign;
    }
  }

  let resultText = '';
  let optimizedTax = 0;
  shares.forEach((share, i) => {
    let tax = calculateTaxForIncome(share);
    resultText += `👤 Person ${i + 1}:\n- Income: PKR ${share.toLocaleString()}\n- Tax: PKR ${tax.toLocaleString()}\n\n`;
    optimizedTax += tax;
  });

  let onePersonTax = calculateTaxForIncome(totalIncome);
  resultText += `🧮 Total Tax (One Person): PKR ${onePersonTax.toLocaleString()}\n`;
  resultText += `💡 Total Tax (Optimized): PKR ${optimizedTax.toLocaleString()}\n`;
  resultText += `🎉 Tax Saved: PKR ${(onePersonTax - optimizedTax).toLocaleString()}`;

  showResult(resultText);
}

function showResult(text) {
  const resultCard = document.getElementById('result');
  const output = document.getElementById('output');
  
  output.textContent = text;
  resultCard.classList.remove('hidden');

  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function restart() {
  document.getElementById('income').value = '';
  document.getElementById('individuals').value = '';
  document.getElementById('result').classList.add('hidden');
  document.getElementById('output').textContent = '';
}

document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        calculateTax();
      }
    });
  });
});