#!/usr/bin/env python3
"""tbrelo.com fact-check extractor — extracts Business+Location claims."""
import re, csv
from pathlib import Path
from collections import Counter

CONTENT_ROOT = Path(__file__).resolve().parent.parent / "content"
OUTPUT_CSV   = Path(__file__).resolve().parent.parent / "factcheck_claims_final.csv"

ROAD_WORDS = r"(?:Road|Rd\.?|Street|St\.?|Avenue|Ave\.?|Boulevard|Blvd\.?|Drive|Dr\.?|Lane|Ln\.?|Way|Highway|Hwy\.?|Loop|Parkway|Pkwy\.?|Trail|Trl\.?|Circle|Cir\.?|Court|Ct\.?|Place|Pl\.?|Causeway|Cswy\.?|Turnpike|Pike|Route)"

PATTERNS = [
    ("on_road",     rf"\bon\s+([A-Z][a-zA-Z\.]+(?:\s+[A-Z][a-zA-Z\.]+){{0,4}}\s+{ROAD_WORDS})\b"),
    ("at_address",  rf"\bat\s+(\d{{2,6}}\s+[A-Z][a-zA-Z\.]+(?:\s+[A-Z][a-zA-Z\.&]+){{0,5}}(?:\s+{ROAD_WORDS})?)\b"),
    ("located_at",  rf"\bLocated\s+at\s+(\d{{2,6}}\s+[A-Z][a-zA-Z\.]+(?:\s+[A-Z][a-zA-Z\.&]+){{0,5}})"),
    ("tucked_on",   rf"\btucked\s+(?:away\s+)?(?:on|in|into|behind)\s+([A-Z][a-zA-Z\.]+(?:\s+[A-Z][a-zA-Z\.]+){{0,3}}(?:\s+{ROAD_WORDS})?)\b"),
    ("sits_on",     rf"\bsits\s+on\s+([A-Z][a-zA-Z\.]+(?:\s+[A-Z][a-zA-Z\.]+){{0,3}}\s+{ROAD_WORDS})\b"),
    ("off_road",    rf"\boff\s+(?:of\s+|the\s+)?([A-Z][a-zA-Z\.]+(?:\s+[A-Z][a-zA-Z\.]+){{0,3}}\s+{ROAD_WORDS})\b"),
]

SKIP_NAMES = {"The","This","That","These","Those","There","Here","When","Where","While","After","Before","Most","Both","Some","Any","All","Every","Each","Other","Florida","Tampa","Bay","Tampa Bay","South Tampa","North Tampa","Hillsborough","Pinellas","Pasco","Polk","Manatee","Sarasota","Citrus","Hernando","I","My","His","Her","Their","Our","Your","You","A","An","And","But","Or","For","With","Without","Located","Nearby","Local","Regional","January","February","March","April","May","June","July","August","September","October","November","December","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Hours","Open","Closed","Free","Paid","Spring","Summer","Fall","Winter","Starting","Ending","Beginning","Finishing","Asleep","Awake","Quiet","Loud","Busy","Focus","Budget","Premium","Them"}

def clean_md(s):
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    s = re.sub(r"\*([^*]+)\*", r"\1", s)
    return re.sub(r"`([^`]+)`", r"\1", s)

def strip_frontmatter(c):
    if c.startswith("---"):
        p = c.split("---", 2)
        if len(p) >= 3: return p[2]
    return c

def find_business_name(before_text):
    cands = re.findall(r"\b((?:The\s+)?[A-Z][a-zA-Z'&\.\-]+(?:\s+[A-Z][a-zA-Z'&\.\-]+){0,5})\b", before_text)
    good = [c for c in cands if c not in SKIP_NAMES and c.strip("The ") not in SKIP_NAMES and len(c) > 2 and not c.isupper()]
    return good[-1] if good else ""

def is_time_of_day(loc):
    return bool(re.fullmatch(r"\d{1,2}\s*(?:AM|PM|am|pm)", loc.strip()))

def extract(fp):
    try: body = clean_md(strip_frontmatter(fp.read_text(encoding="utf-8")))
    except: return []
    claims = []
    for sent in re.split(r"(?<=[.!?])\s+(?=[A-Z])", body):
        sent = sent.strip()
        if len(sent) > 600 or len(sent) < 15 or sent.startswith(("|","- **")): continue
        for pname, pat in PATTERNS:
            for m in re.finditer(pat, sent):
                loc = m.group(1).rstrip('.,;:')
                if is_time_of_day(loc): continue
                if re.fullmatch(r"\d{1,2}\s+[A-Z][a-z]+", loc) and loc.split()[-1] in ("AM","PM"): continue
                biz = find_business_name(sent[:m.start()])
                if not biz or len(biz) < 4: continue
                claims.append({"pattern":pname,"place":biz,"location":loc,"sentence":sent[:400]})
    return claims

def main():
    files = []
    for sd in ["blog","cities","counties","moving-from","pages","pillar","questions"]:
        d = CONTENT_ROOT / sd
        if d.exists(): files.extend(d.rglob("*.md"))
    print(f"Scanning {len(files)} markdown files...")
    rows = []
    for fp in sorted(files):
        for c in extract(fp):
            rows.append({"file":str(fp.relative_to(CONTENT_ROOT)),**c})
    with OUTPUT_CSV.open("w",newline="",encoding="utf-8") as f:
        w = csv.DictWriter(f,fieldnames=["file","place","location","pattern","sentence"],quoting=csv.QUOTE_ALL)
        w.writeheader(); w.writerows(rows)
    counts = Counter(r["file"] for r in rows)
    print(f"✅ Total claims: {len(rows)}")
    print(f"   Files with claims: {len(counts)}")
    print(f"   Output: {OUTPUT_CSV}\n")
    print("Top 25 files:")
    for fn, n in counts.most_common(25): print(f"  {n:3d}  {fn}")

if __name__ == "__main__": main()
