import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const SOURCE_PATH = path.join(ROOT, "en_source.json");
const CURRENT_SQ_PATH = path.join(ROOT, "js/data/locales/sq.js");
const OUT_PATH = CURRENT_SQ_PATH;

const source = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf8"));
const { sq_elements: currentSq } = await import(pathToFileURL(CURRENT_SQ_PATH).href);

const payload = {};
for (let atomicNumber = 1; atomicNumber <= 118; atomicNumber += 1) {
  const key = String(atomicNumber);
  payload[key] = {
    name: currentSq[key]?.name || source[key]?.name || "",
    ions: source[key].ions,
    history: {
      discoveryYear: source[key].history.discoveryYear,
      discoveredBy: source[key].history.discoveredBy,
      namedBy: source[key].history.namedBy,
    },
    stse: [...source[key].stse],
    uses: [...source[key].uses],
    hazards: [...source[key].hazards],
  };
}

const file = `export const sq_elements = ${JSON.stringify(payload, null, 2)};\n`;
fs.writeFileSync(OUT_PATH, file, "utf8");
console.log(`Wrote ${OUT_PATH}`);
