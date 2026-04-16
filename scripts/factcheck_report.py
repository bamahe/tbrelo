#!/usr/bin/env python3
"""Stage 3: Turn verified CSV into FACTCHECK_REPORT.md."""
import csv
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent
INPUT_CSV = ROOT / "factcheck_verified.csv"
OUTPUT_MD = ROOT / "FACTCHECK_REPORT.md"

SEVERITY = {"CLOSED":(0,"🔴 CRITICAL"),"DOES_NOT_EXIST":(0,"🔴 CRITICAL"),"WRONG_ADDRESS":(1,"🟠 HIGH"),"UNKNOWN":(2,"🟡 REVIEW"),"ERROR":(2,"🟡 REVIEW"),"VERIFIED":(3,"🟢 OK"),"SKIP":(4,"⚪ SKIP")}

def main():
    if not INPUT_CSV.exists(): print("Run factcheck_verify.py first"); return
    by_file = defaultdict(list); counts = defaultdict(int)
    for r in csv.DictReader(INPUT_CSV.open()):
        by_file[r["file"]].append(r); counts[r.get("verdict","UNKNOWN")] += 1
    lines = ["# tbrelo.com Fact-Check Report\n","## Summary\n",f"- Total checked: **{sum(counts.values())}**"]
    for v,c in sorted(counts.items(), key=lambda x:SEVERITY.get(x[0],(9,))[0]):
        lines.append(f"- {SEVERITY.get(v,(9,v))[1]}: **{c}**")
    lines += ["","---\n","## Issues by File\n","Only files with CRITICAL, HIGH, or REVIEW issues shown.\n"]
    def sev(claims): return min(SEVERITY.get(c.get("verdict","UNKNOWN"),(9,))[0] for c in claims)
    shown = False
    for fp, claims in sorted(by_file.items(), key=lambda kv:(sev(kv[1]),kv[0])):
        issues = [c for c in claims if c.get("verdict") not in ("VERIFIED","SKIP")]
        if not issues: continue
        shown = True
        lines.append(f"### `{fp}`\n")
        for c in issues:
            v = c.get("verdict","UNKNOWN"); _,label = SEVERITY.get(v,(9,v))
            lines.append(f"- {label} — **{c['place']}** @ `{c['location']}`")
            if c.get("sentence","").strip(): lines.append(f"  > {c['sentence'][:250]}")
            if c.get("notes","").strip():    lines.append(f"  - **Notes**: {c['notes']}")
            if c.get("correct","").strip():  lines.append(f"  - **Correct**: `{c['correct']}`")
            lines.append("")
    if not shown: lines.append("✅ No issues found.\n")
    OUTPUT_MD.write_text("\n".join(lines),encoding="utf-8")
    print(f"✅ {OUTPUT_MD}")
    for v,c in sorted(counts.items(), key=lambda x:SEVERITY.get(x[0],(9,))[0]):
        print(f"   {SEVERITY.get(v,(9,v))[1]}: {c}")

if __name__=="__main__": main()
