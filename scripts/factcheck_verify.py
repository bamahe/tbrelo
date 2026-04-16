#!/usr/bin/env python3
"""Stage 2: Verify each claim via Anthropic API + web search."""
import csv, json, os, sys, time
from pathlib import Path
try:
    from anthropic import Anthropic
except ImportError:
    print("ERROR: Run: pip3 install anthropic"); sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
INPUT_CSV  = ROOT / "factcheck_claims_final.csv"
OUTPUT_CSV = ROOT / "factcheck_verified.csv"
MODEL = "claude-sonnet-4-5"

SYSTEM = """You verify Tampa Bay business+location claims. Use web_search FIRST. Output ONLY a JSON object on one line:
{"verdict": "VERIFIED"|"WRONG_ADDRESS"|"CLOSED"|"DOES_NOT_EXIST"|"UNKNOWN"|"SKIP", "notes": "...", "correct": "..."}
- VERIFIED: place real, at that location, open now.
- WRONG_ADDRESS: place real+open but different address. Put correct address in "correct".
- CLOSED: permanently closed. Year closed in "notes" if known.
- DOES_NOT_EXIST: no such business at this location anywhere.
- UNKNOWN: searches inconclusive.
- SKIP: garbage input (e.g. place is "Your" or "Some").
Keep notes under 25 words."""

def load_done():
    if not OUTPUT_CSV.exists(): return {}
    return {(r["file"],r["place"],r["location"]):r for r in csv.DictReader(OUTPUT_CSV.open())}

def verify(client, place, location, sentence):
    try:
        resp = client.messages.create(
            model=MODEL, max_tokens=600, system=SYSTEM,
            tools=[{"type":"web_search_20250305","name":"web_search","max_uses":3}],
            messages=[{"role":"user","content":f'PLACE: {place}\nCLAIMED LOCATION: {location}\nSOURCE: "{sentence[:300]}"\n\nVerify. JSON only.'}])
        text = "".join(b.text for b in resp.content if getattr(b,"type","")=="text")
        s, e = text.rfind("{"), text.rfind("}")
        if s==-1 or e==-1: return {"verdict":"UNKNOWN","notes":"no JSON","correct":""}
        d = json.loads(text[s:e+1])
        return {"verdict":d.get("verdict","UNKNOWN"),"notes":d.get("notes","")[:200],"correct":d.get("correct","")[:200]}
    except Exception as x:
        return {"verdict":"ERROR","notes":f"api: {str(x)[:120]}","correct":""}

def main():
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("ERROR: export ANTHROPIC_API_KEY=sk-ant-..."); sys.exit(1)
    if not INPUT_CSV.exists():
        print("ERROR: run factcheck_extract.py first"); sys.exit(1)
    client = Anthropic()
    done = load_done()
    rows = list(csv.DictReader(INPUT_CSV.open()))
    todo = [r for r in rows if (r["file"],r["place"],r["location"]) not in done]
    print(f"Total: {len(rows)} | Done: {len(rows)-len(todo)} | Todo: {len(todo)}")
    print(f"Est cost: ~${len(todo)*0.02:.2f} | Est time: ~{len(todo)*4/60:.1f} min\n")
    if not todo: print("Nothing to do."); return
    exists = OUTPUT_CSV.exists()
    with OUTPUT_CSV.open("a",newline="",encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["file","place","location","pattern","sentence","verdict","notes","correct"], quoting=csv.QUOTE_ALL)
        if not exists: w.writeheader()
        for i,r in enumerate(todo,1):
            print(f"[{i}/{len(todo)}] {r['place']} @ {r['location'][:45]}... ",end="",flush=True)
            res = verify(client,r["place"],r["location"],r["sentence"])
            w.writerow({**r,**res}); f.flush()
            print(res["verdict"])
            time.sleep(0.5)
    print(f"\n✅ Done. Run: python3 scripts/factcheck_report.py")

if __name__=="__main__": main()
