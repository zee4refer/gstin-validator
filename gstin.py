"""GSTIN validator (format, state, PAN, mod-36 check digit). Offline check only. MIT licence.

https://billingbazaar.in/tools/gstin-validator/
"""
import json
import re
from pathlib import Path

CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
STATES = json.loads((Path(__file__).parent / "states.json").read_text(encoding="utf-8"))
PAN_TYPES = {"P": "Individual", "C": "Company", "F": "Firm / LLP", "H": "Hindu Undivided Family",
             "A": "Association of Persons", "T": "Trust", "B": "Body of Individuals", "L": "Local authority",
             "J": "Artificial juridical person", "G": "Government"}


def check_digit(first14: str) -> str:
    total = 0
    for i, ch in enumerate(first14[:14]):
        p = CHARS.index(ch) * (2 if i % 2 else 1)
        total += p // 36 + p % 36
    return CHARS[(36 - total % 36) % 36]


def validate_gstin(value: str) -> dict:
    g = re.sub(r"\s+", "", str(value or "")).upper()
    res = {"gstin": g, "valid": False, "errors": []}
    if len(g) != 15:
        res["errors"].append("A GSTIN has 15 characters")
        return res
    if not re.fullmatch(r"[0-9A-Z]{15}", g):
        res["errors"].append("Only letters and digits are allowed")
        return res
    res["state_code"], res["pan"], res["entity_number"] = g[:2], g[2:12], g[12]
    res["state"] = STATES.get(g[:2])
    if not res["state"]:
        res["errors"].append(f"Unknown state code {g[:2]}")
    if not re.fullmatch(r"[A-Z]{5}[0-9]{4}[A-Z]", res["pan"]):
        res["errors"].append("Characters 3-12 should be a PAN")
    res["pan_type"] = PAN_TYPES.get(res["pan"][3])
    if g[13] != "Z":
        res["errors"].append("Character 14 is normally Z")
    res["expected_check_digit"] = check_digit(g)
    if g[14] != res["expected_check_digit"]:
        res["errors"].append(f"Check digit should be {res['expected_check_digit']}")
    res["valid"] = not res["errors"]
    return res


if __name__ == "__main__":
    import sys
    for arg in sys.argv[1:] or ["27AAPFU0939F1ZV"]:
        print(validate_gstin(arg))
