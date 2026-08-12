// Motor de digitacao do TypeRacer — treino solo (modo pratica).
//
// Como usar: colar este arquivo inteiro como a funcao do browser_evaluate.
// Ele dispara e devolve na hora; o progresso vive em window.__bot.
//
// Config opcional, avaliada ANTES deste arquivo:
//   window.__cfg = { ppm: 85, taxaErro: 0.012, limite: 0 }
//     ppm      -> palavras por minuto alvo (5 caracteres = 1 palavra)
//     taxaErro -> chance por letra de errar e corrigir na hora (0 desliga)
//     limite   -> digitar so os N primeiros caracteres (0 = trecho todo)
//
// Mecanica do site, descoberta na mao em 12/08/2026:
//   - o trecho vem num span por caractere, dentro de
//     div.relative.leading-relaxed.select-none.overflow-hidden
//   - a caixa de digitar e input.font-mono, e ela ESVAZIA a cada espaco
//     (o site cobra palavra por palavra), por isso toda tecla parte de
//     campo.value e nao de um texto meu
//   - o site pinta de verde (text-success) tudo que ja foi aceito, inclusive
//     a palavra em curso: a contagem de verdes e o ponto exato de retomada
//   - a corrida solo comeca na primeira tecla, e a caixa trava sozinha se
//     a pratica ficar parada tempo demais
() => {
  const cfg = Object.assign({ ppm: 85, taxaErro: 0.012, limite: 0 }, window.__cfg || {});

  const caixa = document.querySelector('div.relative.leading-relaxed.select-none.overflow-hidden');
  const campo = document.querySelector('input.font-mono');
  if (!caixa || !campo) return { falha: 'nao achei o trecho ou a caixa de digitar' };
  if (campo.disabled) return { falha: 'a caixa de digitar esta travada: abra uma pratica nova' };

  const spans = () => [...caixa.querySelectorAll('span')];
  const texto = spans().map((s) => s.textContent).join('');
  if (!texto) return { falha: 'trecho vazio' };

  const verdes = () => spans().filter((s) => /text-success/.test(s.className)).length;

  const setValor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  const dorme = (ms) => new Promise((r) => setTimeout(r, ms));

  const tecla = (ch, tipo) =>
    campo.dispatchEvent(new KeyboardEvent(tipo, { key: ch, bubbles: true, cancelable: true }));

  const bate = (ch) => {
    tecla(ch, 'keydown');
    setValor.call(campo, campo.value + ch);
    campo.dispatchEvent(new Event('input', { bubbles: true }));
    tecla(ch, 'keyup');
  };

  const apaga = () => {
    tecla('Backspace', 'keydown');
    setValor.call(campo, campo.value.slice(0, -1));
    campo.dispatchEvent(new Event('input', { bubbles: true }));
    tecla('Backspace', 'keyup');
  };

  // ---- cadencia ----
  const base = 60000 / (cfg.ppm * 5); // ms por caractere no ritmo alvo
  // tres sorteios somados dao curva em sino: a maioria das teclas perto do
  // ritmo, poucas bem rapidas ou bem lentas
  const jitter = () => Math.exp((Math.random() + Math.random() + Math.random() - 1.5) * 0.45);

  const MAIUSC = /[A-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ]/;
  const ACENTO = /[áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ]/;

  function atraso(ch, anterior) {
    let m = 1;
    if (ch === ' ') m *= 1.25; // respiro entre palavras
    if (/[.,;:!?]/.test(anterior)) m *= 1.9; // pausa depois de pontuacao
    if (MAIUSC.test(ch)) m *= 1.45; // shift custa
    if (ACENTO.test(ch)) m *= 1.3; // acento custa
    if (/[0-9]/.test(ch)) m *= 1.5;
    if (Math.random() < 0.02) m *= 3.2; // hesitacao ocasional
    return base * m * jitter();
  }

  // vizinhos de tecla, pra o erro cair onde a mao erraria
  const VIZ = {
    a: 'sqzw', b: 'vgnh', c: 'xvdf', d: 'sfce', e: 'wrds', f: 'dgrv', g: 'fhtb',
    h: 'gjyn', i: 'uokj', j: 'hkun', k: 'jlim', l: 'kçop', m: 'njk', n: 'bmhj',
    o: 'ipkl', p: 'oçl', q: 'wa', r: 'etfd', s: 'adwx', t: 'ryfg', u: 'yijh',
    v: 'cbfg', w: 'qesa', x: 'zcsd', y: 'tuhg', z: 'xas',
  };
  const vizinho = (ch) => {
    const b = ch.toLowerCase();
    const v = VIZ[b];
    if (!v) return null;
    const alt = v[Math.floor(Math.random() * v.length)];
    return ch === b ? alt : alt.toUpperCase();
  };

  const jaFeito = verdes();

  const B = (window.__bot = {
    total: texto.length,
    de: jaFeito,
    i: jaFeito,
    rodando: true,
    erros: 0,
    ppmAlvo: cfg.ppm,
    ppmMedido: null,
    custoTecla: null,
    falha: null,
  });

  (async () => {
    let t0 = null;
    try {
      campo.focus();
      campo.click();
      const fim = cfg.limite > 0 ? Math.min(cfg.limite, texto.length) : texto.length;
      let gastoTotal = 0; // quanto tempo os eventos e o redesenho consomem

      for (let k = jaFeito; k < fim; k++) {
        const ch = texto[k];
        const anterior = k > 0 ? texto[k - 1] : '';

        // erro proposital, corrigido na hora (nunca no espaco, senao a
        // palavra ja foi cobrada e nao da pra voltar)
        if (ch !== ' ' && Math.random() < cfg.taxaErro) {
          const errado = vizinho(ch);
          if (errado && errado !== ch) {
            bate(errado);
            B.erros++;
            await dorme(base * (1.2 + Math.random()));
            apaga();
            await dorme(base * (0.8 + Math.random() * 0.6));
          }
        }

        const marca = performance.now();
        bate(ch);
        const gasto = performance.now() - marca;
        gastoTotal += gasto;

        B.i = k + 1;
        if (t0 === null) t0 = marca;

        // a cada 25 teclas confere se o site esta acompanhando; se descolar,
        // para em vez de martelar em cima do erro
        if ((k - jaFeito) % 25 === 24) {
          const v = verdes();
          if (v > 0 && Math.abs(v - B.i) > 2) {
            B.falha = `descolou do site: ele marca ${v}, eu contei ${B.i}`;
            break;
          }
        }

        // desconta o custo da tecla, senao o ritmo real fica bem abaixo do alvo
        await dorme(Math.max(8, atraso(ch, anterior) - gasto));
      }

      const min = (performance.now() - t0) / 60000;
      B.ppmMedido = min > 0 ? Math.round((B.i - B.de) / 5 / min) : null;
      B.custoTecla = Math.round(gastoTotal / Math.max(1, B.i - B.de));
    } catch (e) {
      B.falha = e.message;
    } finally {
      B.rodando = false;
    }
  })();

  return { disparado: true, chars: texto.length, de: jaFeito, ppmAlvo: cfg.ppm };
}
