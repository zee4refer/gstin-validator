/**
 * GSTIN validator: format, state code, embedded PAN and the check digit (mod-36 checksum).
 * Offline check only – confirm registration on the GST portal ("Search Taxpayer").
 * MIT licence – https://billingbazaar.in/tools/gstin-validator/
 */
'use strict';

var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var STATES = require('./states.json');
var PAN_TYPES = { P: 'Individual', C: 'Company', F: 'Firm / LLP', H: 'Hindu Undivided Family', A: 'Association of Persons',
  T: 'Trust', B: 'Body of Individuals', L: 'Local authority', J: 'Artificial juridical person', G: 'Government' };

function checkDigit(first14) {
  var sum = 0;
  for (var i = 0; i < 14; i++) {
    var p = CHARS.indexOf(first14[i]) * (i % 2 ? 2 : 1);
    sum += Math.floor(p / 36) + (p % 36);
  }
  return CHARS[(36 - (sum % 36)) % 36];
}

function validateGSTIN(input) {
  var g = String(input || '').toUpperCase().replace(/\s+/g, '');
  var res = { gstin: g, valid: false, errors: [] };
  if (g.length !== 15) { res.errors.push('A GSTIN has 15 characters'); return res; }
  if (!/^[0-9A-Z]{15}$/.test(g)) { res.errors.push('Only letters and digits are allowed'); return res; }
  res.stateCode = g.slice(0, 2);
  res.state = STATES[res.stateCode] || null;
  if (!res.state) res.errors.push('Unknown state code ' + res.stateCode);
  res.pan = g.slice(2, 12);
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(res.pan)) res.errors.push('Characters 3–12 should be a PAN');
  res.panType = PAN_TYPES[res.pan[3]] || null;
  res.entityNumber = g[12];
  if (g[13] !== 'Z') res.errors.push('Character 14 is normally Z');
  res.expectedCheckDigit = checkDigit(g.slice(0, 14));
  if (g[14] !== res.expectedCheckDigit) res.errors.push('Check digit should be ' + res.expectedCheckDigit);
  res.valid = res.errors.length === 0;
  return res;
}

module.exports = { validateGSTIN: validateGSTIN, checkDigit: checkDigit };
