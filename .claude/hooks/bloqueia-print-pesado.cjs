#!/usr/bin/env node
// Bloqueia leitura direta de imagem/PDF pesado na conversa principal.
// Motivo: imagem lida direto fica no contexto e e recobrada em TODO turno seguinte
// (diagnostico 20/08: prints eram 80% do volume de leitura do mes).
// Regra: memory/20-como-trabalhar/travar-em-60-de-contexto.md
// Subagente PODE ler (transcript agent-*.jsonl) - e pra la que esse trabalho vai.
let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let d;
  try { d = JSON.parse(raw); } catch (e) { return process.exit(0); }
  const p = String((d.tool_input && d.tool_input.file_path) || "");
  if (!/\.(png|jpe?g|gif|webp|bmp|pdf)$/i.test(p)) return process.exit(0);
  const t = String(d.transcript_path || "");
  if (/agent-[^\\/]*\.jsonl$/i.test(t)) return process.exit(0); // subagente: liberado
  let size = 0;
  try { size = require("fs").statSync(p).size; } catch (e) { return process.exit(0); }
  if (size <= 150 * 1024) return process.exit(0); // pequeno: liberado
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason:
        "Arquivo pesado (" + Math.round(size / 1024) + "KB). Nao leia imagem/PDF grande direto na conversa: delegue a um subagente (Agent tool) que le o arquivo e devolve SO o texto e os numeros relevantes. Regra: memory/20-como-trabalhar/travar-em-60-de-contexto.md",
    },
  }));
  process.exit(0);
});
