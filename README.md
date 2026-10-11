# GSTIN validator (JavaScript + Python)

Check an Indian **GST number (GSTIN)** offline: 15-character format, **state code**, the **PAN** inside it and its holder type, and the **check digit** (the GSTN mod-36 checksum). No API key, no network calls.

Try it online, no install: **[billingbazaar.in/tools/gstin-validator/](https://billingbazaar.in/tools/gstin-validator/)**

## Usage

```js
const { validateGSTIN } = require('./gstin');
validateGSTIN('27AAPFU0939F1ZV');
// { valid: true, state: 'Maharashtra', stateCode: '27', pan: 'AAPFU0939F', panType: 'Firm / LLP', ... }
validateGSTIN('27AAPFU0939F1ZW').errors;   // ['Check digit should be V']
```

```python
from gstin import validate_gstin
validate_gstin("27AAPFU0939F1ZV")["valid"]   # True
```

```bash
python3 gstin.py 27AAPFU0939F1ZV 29AAACB1234C1ZB
```

## What a GSTIN contains

| Characters | Meaning |
|---|---|
| 1–2 | State code (27 = Maharashtra, 24 = Gujarat, 29 = Karnataka …) – see `states.json` |
| 3–12 | PAN of the business (4th letter: P person, C company, F firm, H HUF, T trust …) |
| 13 | Registration number for that PAN in the state (1–9, then A–Z) |
| 14 | `Z` by default |
| 15 | Check digit |

### The check digit

Each of the first 14 characters is mapped to 0–35 (`0-9` then `A-Z`), multiplied alternately by 1 and 2, and the product is split as `floor(p/36) + p%36`. The check digit is `(36 − sum % 36) % 36`, mapped back to a character.

> A valid format does **not** mean the business is registered or active. Confirm on the GST portal under *Search Taxpayer*.

## Tests

```bash
node test.js
```

## GSTIN checks while you add customers

When you save a customer or supplier with their GSTIN, the first two digits decide the state and therefore CGST + SGST
or IGST on every invoice to them. In **Vyapar**, entering a party's GSTIN fills in the state for you and the invoice uses
the right tax type automatically ([adding customers and suppliers in Vyapar](https://billingbazaar.in/guides/how-to-add-customers-and-suppliers-in-vyapar/)).

Starting with Vyapar? Sign up with referral code **`NXW3QY`** as a new user, or get it set up for you with a [free demo and installation](https://billingbazaar.in/vyapar-referral-code/) in Hindi or English.

---

Made by [Billing Bazaar](https://billingbazaar.in) – billing software demos, setup and free GST tools for Indian shops and traders.
[All free tools](https://billingbazaar.in/tools/) · [Vyapar guides](https://billingbazaar.in/guides/)

*Not affiliated with the GST Network (GSTN), CBIC or NPCI. Vyapar is a trademark of Simply Vyapar Apps Pvt. Ltd.;
Billing Bazaar is a Vyapar partner. Always confirm GST rates and rules on the official GST portal.*
