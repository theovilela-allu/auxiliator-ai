#!/usr/bin/env node
// Diagnostico de gasto de tokens do assessor — recriavel a qualquer momento.
// Le os transcripts do Claude Code deste projeto e mostra: gasto por sessao,
// custo estimado, contexto medio/pico e os piores ofensores (imagens lidas direto).
//
// Uso:  node scripts/diagnostico-de-gasto.cjs [--desde 2026-08-01] [--modelo fable|opus|sonnet]
// Comparar periodos = rodar duas vezes com --desde diferente.
// Nascido no diagnostico de 20/08/2026 (ver memory/20-como-trabalhar/travar-em-60-de-contexto.md).
const fs = require("fs");
const path = require("path");
const os = require("os");

const args = process.argv.slice(2);
const arg = (k, def) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : def; };
const desde = new Date(arg("--desde", "2026-08-01"));
const modelo = arg("--modelo", "fable");

// preco por 1M de tokens: [cache_read, cache_write(1h), output]
const PRECOS = { fable: [1.0, 20.0, 50.0], opus: [0.5, 10.0, 25.0], sonnet: [0.3, 6.0, 15.0] };
const [pcr, pcw, pout] = PRECOS[modelo] || PRECOS.fable;

// pasta de transcripts deste projeto (regra de nome do Claude Code: : e \ viram -)
const proj = (()=>{ const p = process.cwd().split(path.sep).join("-").replace(/:/g, "-"); return p[0].toLowerCase() + p.slice(1); })();
const dir = path.join(os.homedir(), ".claude", "projects", proj);
if (!fs.existsSync(dir)) { console.error("pasta de transcripts nao achada: " + dir); process.exit(1); }

const imgExt = /\.(png|jpe?g|gif|webp|bmp|pdf)$/i;
const sessoes = []; const imagens = [];
let T = { cr: 0, cw: 0, out: 0, turnos: 0 };

for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".jsonl"))) {
  const st = fs.statSync(path.join(dir, f));
  if (st.mtime < desde) continue;
  let s = { id: f.slice(0, 8), dia: st.mtime.toISOString().slice(0, 10), turnos: 0, cr: 0, cw: 0, out: 0, pico: 0 };
  const id2img = {};
  for (const l of fs.readFileSync(path.join(dir, f), "utf8").split("\n")) {
    if (!l.trim()) continue;
    let j; try { j = JSON.parse(l); } catch (e) { continue; }
    const m = j.message; if (!m) continue;
    const u = m.usage;
    if (u) {
      s.turnos++; s.cr += u.cache_read_input_tokens || 0; s.cw += u.cache_creation_input_tokens || 0; s.out += u.output_tokens || 0;
      const ctx = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
      if (ctx > s.pico) s.pico = ctx;
    }
    if (!Array.isArray(m.content)) continue;
    for (const c of m.content) {
      if (c.type === "tool_use" && c.name === "Read" && c.input && imgExt.test(String(c.input.file_path || ""))) id2img[c.id] = c.input.file_path;
      if (c.type === "tool_result" && id2img[c.tool_use_id]) {
        const t = typeof c.content === "string" ? c.content : JSON.stringify(c.content || "");
        imagens.push({ arq: String(id2img[c.tool_use_id]).split(/[\/]/).pop(), tok: Math.round(t.length / 4), sessao: s.id });
      }
    }
  }
  if (s.turnos > 0) { sessoes.push(s); T.cr += s.cr; T.cw += s.cw; T.out += s.out; T.turnos += s.turnos; }
}

const custo = (x) => (x.cr / 1e6) * pcr + (x.cw / 1e6) * pcw + (x.out / 1e6) * pout;
const k = (n) => Math.round(n / 1000) + "k";
sessoes.sort((a, b) => custo(b) - custo(a));

console.log("=== GASTO desde " + desde.toISOString().slice(0, 10) + " (precos " + modelo + ") ===");
console.log("sessoes=" + sessoes.length + "  turnos=" + T.turnos + "  releitura=" + (T.cr / 1e9).toFixed(2) + "B  escrita_cache=" + k(T.cw) + "  saida=" + k(T.out));
console.log("CUSTO ESTIMADO: US$ " + Math.round(custo(T)) + "  |  contexto medio/turno: " + (T.turnos ? k(T.cr / T.turnos) : "-"));
console.log("\n-- top 8 sessoes por custo --");
console.log("dia        | sessao   | turnos | pico ctx | custo");
for (const s of sessoes.slice(0, 8))
  console.log(s.dia + " | " + s.id + " | " + String(s.turnos).padStart(6) + " | " + k(s.pico).padStart(8) + " | US$ " + Math.round(custo(s)));
const acima = sessoes.filter((s) => s.pico > 200000).length;
console.log("\nsessoes que passaram da trava de 200k: " + acima + " de " + sessoes.length);
imagens.sort((a, b) => b.tok - a.tok);
if (imagens.length) {
  console.log("\n-- imagens/PDF lidos direto (deviam ir pro subagente) --");
  for (const i of imagens.slice(0, 8)) console.log("  ~" + k(i.tok) + "  " + i.arq + "  (sessao " + i.sessao + ")");
} else console.log("\nnenhuma imagem lida direto no periodo. regra funcionando.");
