#!/usr/bin/env node
// Gancho Stop: quando o contexto desta conversa passa do limite, nao deixo a sessao parar quieta.
// Devolvo (codigo 2 + stderr) a lista da passagem de bastao: salvar o estado no Obsidian, avisar o
// Rei em uma linha e rodar passar-o-bastao.cjs, que encerra esta sessao e relanca no mesmo terminal.
// Desenho: memory/00-guia/passagem-de-bastao.md. Limite trocavel por BASTAO_LIMITE (so pra teste).
const fs = require('fs');

const LIMITE = Number(process.env.BASTAO_LIMITE) || 500000;

let raw = '';
try { raw = fs.readFileSync(0, 'utf8'); } catch (_) {}
let d = {};
try { d = JSON.parse(raw || '{}'); } catch (_) {}

// ja estou continuando por causa deste gancho: nao interrompo duas vezes seguidas
if (d.stop_hook_active) process.exit(0);

const tp = d.transcript_path;
if (!tp || !fs.existsSync(tp)) process.exit(0);

// uma passagem por sessao: a marca fica ao lado do transcript e nunca e apagada
const marca = tp + '.bastao';
if (fs.existsSync(marca)) process.exit(0);

// contexto vivo = ultimo usage de mensagem minha no fio principal (mesma conta do statusline.cjs,
// so que ignorando ajudantes/sidechain)
let ctx = null;
try {
  const fd = fs.openSync(tp, 'r');
  try {
    const size = fs.fstatSync(fd).size;
    const start = Math.max(0, size - 512 * 1024);
    const buf = Buffer.alloc(size - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    const lines = buf.toString('utf8').split(/\r?\n/).filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      let o; try { o = JSON.parse(lines[i]); } catch (_) { continue; }
      if (o.isSidechain) continue;
      if (o.type && o.type !== 'assistant') continue;
      const u = o.usage || (o.message && o.message.usage);
      if (u && (u.input_tokens != null || u.cache_read_input_tokens != null)) {
        ctx = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
        break;
      }
    }
  } finally { fs.closeSync(fd); }
} catch (_) {}

if (ctx == null || ctx < LIMITE) process.exit(0);

try { fs.writeFileSync(marca, new Date().toISOString() + ' ctx=' + ctx + '\n'); } catch (_) {}

const k = Math.round(ctx / 1000);
process.stderr.write([
  `PASSAGEM DE BASTAO: o contexto desta conversa chegou a ${k}k tokens (limite ${Math.round(LIMITE / 1000)}k). Nao pare aqui. Faca, nesta ordem, sem perguntar nada:`,
  `1. Deixe o trabalho num estado consistente: se um passo precisa terminar pra nao ficar meio feito, termine-o primeiro.`,
  `2. Reescreva a secao "Estado" de memory/00-guia/passagem-de-bastao.md: o que estavamos fazendo, o que ficou pronto, o que falta (em ordem), onde esta (branch, commit, worktree, arquivo), o proximo passo concreto, o que depende do Rei, e rascunhos prontos se houver. Confira que ela segue sendo a PRIMEIRA linha do memory/MEMORY.md.`,
  `3. Nota de projeto que ficou defasada nesta conversa: atualize tambem. Depois commit e push (mensagem em pt, sem acento).`,
  `4. Diga ao Rei em UMA linha, no tom de sempre, que a conversa ficou longa e voce vai passar o bastao pra uma sessao nova, que abre sozinha neste terminal.`,
  `5. Por ultimo, rode: node .claude/hooks/passar-o-bastao.cjs  (grava o sinal e encerra esta sessao em 2s; a proxima nasce no mesmo terminal com a mensagem de abertura).`,
  `Regra: memory/00-guia/passagem-de-bastao.md`,
].join('\n'));
process.exit(2);
