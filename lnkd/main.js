// get all slider and output elements
let range_tc = document.getElementById("range_tc");
let out_tc = document.getElementById("tc-out");
//out_tc.innerHTML = range_tc.value
out_tc.innerHTML = '&nbsp;'

let range1 = document.getElementById("range1");
let output1 = document.getElementById("r1-out");
output1.innerHTML = range1.value;

let range2 = document.getElementById("range2");
let output2 = document.getElementById("r2-out");
output2.innerHTML = range2.value;

let range3 = document.getElementById("range3");
let output3 = document.getElementById("r3-out");
output3.innerHTML = range3.value;

// get TC text input
let textInput = document.getElementById("text-input");

// execute calculation when text input value is changed
textInput.oninput = function() {
  // Update TC range slider if user inputs value in to text box
  parsed = parseInt(textInput.value.replace(/,/g, '').replace(/ /g, '').replace(/\$/g, ''));
  range_tc.value = parsed;

  calculate();
}

range_tc.oninput = function () {
  //tc_out.innerHTML = this.value
  textInput.value = dfr(this.value)
  calculate();
}

range1.oninput = function() {
    output1.innerHTML = this.value;
    calculate();
}

range2.oninput = function() {
    output2.innerHTML = this.value;
    calculate();
}

range3.oninput = function() {
    output3.innerHTML = this.value;
    calculate();
}

t_bonus.oninput = function() {
    calculate();
}

vesting.oninput = function() {
    calculate();
}

amortize.oninput = function() {
    calculate();
}

// calculate and display results
let result = document.getElementById("result");
let tc_res = document.getElementById("tc-result");

let td_salary = document.getElementById("td_salary");
let td_perfbonus = document.getElementById("td_perfbonus");
let td_equity_vest = document.getElementById("td_equity_vest");
let td_sign_on_amort = document.getElementById("td_sign_on_amort");
let td_tc = document.getElementById("td_tc");
let td_target = document.getElementById("td_target");
let td_gap = document.getElementById("td_gap");
let td_gap_label = document.getElementById("td_gap_label")

function calculate() {
  // TC input: strip commas, spaces, and dollar symbol before converting to number
  target = parseInt(textInput.value.replace(/,/g, '').replace(/ /g, '').replace(/\$/g, ''));

  // Read range sliders
  salary = parseInt(range1.value);
  equity = parseInt(range2.value);
  sign_on = parseInt(range3.value);

  // Read text box inputs
  target_bonus_mult = parseFloat(t_bonus.value)/100.0;   // Scale from percent
  if (isNaN(target_bonus_mult)) { target_bonus_mult = 0.0; }

  equity_period = parseFloat(vesting.value);      // 4.0
  sign_on_period = parseInt(amortize.value);      // 2.0

  // Calculate components
  perf_bonus = salary*target_bonus_mult
  vesting_equity = equity/equity_period
  sign_on_amortized = sign_on/sign_on_period

  //total = (salary*(1 + target_bonus_mult) + equity/equity_period + sign_on/sign_on_period)
  total = (salary + perf_bonus + vesting_equity + sign_on_amortized)

  // Update document
  tc_res.innerHTML = 'Sum: ' + dollarFormatRegex(total)    // TC bold text
  tc_res.style.fontWeight = 'bold'

  dec = 2
  td_salary.innerText = dollarFormatRegex(salary, dec);
  td_perfbonus.innerText = dollarFormatRegex(perf_bonus, dec);
  td_equity_vest.innerText = dollarFormatRegex(vesting_equity, dec);
  td_sign_on_amort.innerText = dollarFormatRegex(sign_on_amortized, dec);

  td_tc.innerText = dollarFormatRegex(total, dec);
  td_target.innerText = dollarFormatRegex(target, dec);

  gap = total - target

  //label = (gap < 0 ? 'Shortfall: ' : 'Surplus: ')
  epsilon = 100.0
  if (Math.abs(gap) <= epsilon) { label = 'Target met! '}
  else if (gap < 0) { label = 'Shortfall: ' }
  else           { label = 'Surplus: ' }
  result.innerHTML = label + dollarFormatRegex(gap)   // orig shortfall text
  td_gap_label.innerHTML = label;
  td_gap.innerHTML = dollarFormatRegex(gap, dec);

  /*
    // No surplus/shortfall if compensation target is exact match
    epsilon = 1.0
    if (Math.abs(gap) < epsilon) {
      entry = '&nbsp;'
    } else {
      if (gap < 0) { label='Shortfall: ' }
      else           { label = 'Surplus: ' }

      entry = label + dollarFormatRegex(gap)
    }
    result.innerHTML = entry
  */

  epsilon = 100.0
  if (Math.abs(gap) <= epsilon) {
    result.innerHTML = 'Target met!';
    result.style.color = '#0077B5'
    td_gap_label.style.color = '#0077B5'
    td_gap.style.color = '#0077B5'
  }
  else if (gap < 0) {
      result.style.color = 'red'      // orig shortfall text
      td_gap_label.style.color = 'red'
      td_gap.style.color = 'red'
  }
  else {
      result.style.color = 'green'    // orig shortfall text
      td_gap_label.style.color = 'green'
      td_gap.style.color = 'green'
  }

  result.style.fontWeight = 'bold'    // orig shortfall text
  td_gap_label.style.fontWeight = 'bold'
  td_gap.style.fontWeight = 'bold'
}

function dollarFormatRegex(n, decimals=2) {
    /* Formats number in dollar format (43824.327 -> '$43,824.33') */

    neg = '';
    if (n < 0) { neg = '-'; }

    s = neg + '$' + Math.abs(n).toFixed(decimals).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    return s
}

function dfr(n) {
    /* Adds comma every 3 digits; no decimal places */

    s = Math.abs(n).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    return s
}

// run calculate function on page load so 'shortfall' is computed without having
// to touch the slider
window.onload = calculate;
//document.getElementById("result-text").innerHTML = "whatever";
