// Motor de digitacao do TypeRacer.
//
// Como usar: colar este arquivo inteiro como a funcao do browser_evaluate.
// Ele dispara e devolve na hora; o progresso vive em window.__bot.
//
// Config opcional, avaliada ANTES deste arquivo (ou no proprio topo daqui):
//   window.__cfg = { ppm: 96, taxaErro: 0.03, limite: 0, largar: true }
//     ppm      -> MIRA em palavras por minuto (5 caracteres = 1 palavra).
//                 Nao e o resultado: ver a tabela de calibragem no manual.
//                 O Rei fala em CPM. CPM = ppm x 5, entao 380 CPM = 76 ppm.
//     taxaErro -> chance por letra de errar num vizinho de tecla e corrigir
//     limite   -> digitar so os N primeiros caracteres (0 = trecho todo)
//     largar   -> clicar Join Race / Start Race antes de esperar (padrao true)
//
// Serve pros dois modos:
//   pratica  -> a corrida comeca na primeira tecla, digita na hora
//   sala     -> fica armado e dispara no instante em que a caixa liberar
//
// TRAVA: se a tela for o teste de verificacao do site (pede um minimo de CPM
// sob supervisao pra provar que a velocidade e real), o motor NAO digita.
// Essa checagem existe pra detectar bot, e passar por ela nao esta na mesa.
() => {
  const cfg = Object.assign({ ppm: 96, taxaErro: 0.012, limite: 0, largar: true }, window.__cfg || {});

  const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
  const setValor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  const botao = (re) => [...document.querySelectorAll('a,button')].find((e) => re.test((e.textContent || '').trim()));
  const ehTesteDeVerificacao = () => /Begin Test|verification|You will need to type at least/i.test(document.body.innerText || '');

  if (ehTesteDeVerificacao()) return { falha: 'teste de verificacao na tela: nao digito nele' };

  let clicouJoin = false, clicouStart = false;
  if (cfg.largar) {
    const join = botao(/^Join Race$/i);
    if (join) { join.click(); clicouJoin = true; }
    const start = botao(/^Start Race$/i);
    if (start) { start.click(); clicouStart = true; }
  }

  const B = (window.__bot = {
    estado: 'esperando largada', i: 0, total: null, rodando: true, erros: 0,
    ppmAlvo: cfg.ppm, ppmMedido: null, cpmMedido: null, falha: null, clicouJoin, clicouStart,
  });

  (async () => {
    try {
      let caixa = null, campo = null, texto = '';
      for (let t = 0; t < 2400; t++) { // ate 2 min esperando a largada
        if (ehTesteDeVerificacao()) { B.falha = 'teste de verificacao na tela: nao digito nele'; B.rodando = false; return; }
        caixa = document.querySelector('div.relative.leading-relaxed.select-none.overflow-hidden');
        campo = document.querySelector('input.font-mono');
        if (caixa && campo && !campo.disabled) {
          texto = [...caixa.querySelectorAll('span')].map((s) => s.textContent).join('');
          if (texto.length > 10) break;
        }
        await dorme(50);
      }
      if (!texto) { B.falha = 'a corrida nao largou'; B.rodando = false; return; }

      B.estado = 'digitando';
      B.total = texto.length;

      const tecla = (ch, tipo) => campo.dispatchEvent(new KeyboardEvent(tipo, { key: ch, bubbles: true, cancelable: true }));
      // toda tecla parte de campo.value, porque o site esvazia a caixa a cada espaco
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
      const base = 60000 / (cfg.ppm * 5);
      // tres sorteios somados dao curva em sino: a maioria das teclas perto do
      // ritmo, poucas bem rapidas ou bem lentas
      const jitter = () => Math.exp((Math.random() + Math.random() + Math.random() - 1.5) * 0.45);
      const MAIUSC = /[A-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ]/;
      const ACENTO = /[áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ]/;
      const atraso = (ch, ant) => {
        let m = 1;
        if (ch === ' ') m *= 1.25; // respiro entre palavras
        if (/[.,;:!?]/.test(ant)) m *= 1.9; // pausa depois de pontuacao
        if (MAIUSC.test(ch)) m *= 1.45; // shift custa
        if (ACENTO.test(ch)) m *= 1.3; // acento custa
        if (/[0-9]/.test(ch)) m *= 1.5;
        if (Math.random() < 0.02) m *= 3.2; // hesitacao ocasional
        return base * m * jitter();
      };

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

      campo.focus();
      campo.click();

      const fim = cfg.limite > 0 ? Math.min(cfg.limite, texto.length) : texto.length;
      let t0 = null;

      for (let k = 0; k < fim; k++) {
        const ch = texto[k];

        // erro proposital, corrigido na hora. Nunca no espaco: depois dele a
        // palavra ja foi cobrada e o backspace nao volta
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
        B.i = k + 1;
        if (t0 === null) t0 = marca;
        await dorme(Math.max(8, atraso(ch, k > 0 ? texto[k - 1] : '') - (performance.now() - marca)));
      }

      const min = (performance.now() - t0) / 60000;
      B.ppmMedido = min > 0 ? Math.round(B.i / 5 / min) : null;
      B.cpmMedido = B.ppmMedido ? B.ppmMedido * 5 : null;
      B.estado = 'terminou';
    } catch (e) {
      B.falha = e.message;
    } finally {
      B.rodando = false;
    }
  })();

  return { armado: true, clicouJoin, clicouStart, ppmAlvo: cfg.ppm, cpmAlvo: cfg.ppm * 5 };
}
