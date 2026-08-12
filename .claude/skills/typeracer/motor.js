// Motor de digitacao do TypeRacer.
//
// Como usar: colar este arquivo inteiro como a funcao do browser_evaluate.
// Dispara e devolve na hora; o progresso vive em window.__bot.
//
// PADRAO DO REI (12/08/2026): 380 CPM de referencia, com margem de +150/-80
// (300 a 530 CPM), e EU escolho o numero dentro dela a cada corrida. Acerto de
// 96%. E fica SEMPRE ARMADO: terminou uma, ja espera a proxima largada.
//
// Config opcional, avaliada ANTES daqui:
//   window.__cfg = { cpm: 380, cpmMin: 300, cpmMax: 530, taxaErro: 0.05,
//                    rearmar: true, largar: true, limite: 0, ppm: null }
//     cpm      -> centro da faixa (o Rei fala em CPM; CPM = ppm x 5)
//     cpmMin/Max -> a margem dele; sorteio em sino em volta do centro
//     taxaErro -> chance por letra de errar num vizinho e corrigir. 0.05 = 96%
//     rearmar  -> depois de terminar, espera a proxima corrida (padrao true)
//     largar   -> clicar Join Race / Start Race quando existirem
//     ppm      -> se preenchido, ignora a faixa e usa esta MIRA crua
//
// Serve pros dois modos: pratica (comeca na primeira tecla) e sala privada
// (fica armado e dispara no instante em que a caixa libera).
//
// TRAVA: se a tela for o teste de verificacao do site (pede um minimo de CPM
// sob supervisao pra provar que a velocidade e real), o motor NAO digita.
// Aquilo e a checagem de bot da plataforma e passar por ela nao esta na mesa.
// Para parar tudo: window.__bot.parar = true
() => {
  const cfg = Object.assign(
    { cpm: 380, cpmMin: 300, cpmMax: 530, taxaErro: 0.05, rearmar: true, largar: true, limite: 0, ppm: null },
    window.__cfg || {}
  );

  const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
  const setValor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  const botao = (re) => [...document.querySelectorAll('a,button')].find((e) => re.test((e.textContent || '').trim()));
  const ehTesteDeVerificacao = () => /Begin Test|verification|You will need to type at least/i.test(document.body.innerText || '');

  // sorteio em sino dentro da margem: quase sempre perto do centro, as vezes
  // nas pontas. E o que faz uma corrida nao sair igual a outra
  const sorteiaCpm = () => {
    const g = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; // ~[-1,1]
    const lado = g >= 0 ? cfg.cpmMax - cfg.cpm : cfg.cpm - cfg.cpmMin;
    return Math.round(Math.min(cfg.cpmMax, Math.max(cfg.cpmMin, cfg.cpm + g * lado)));
  };

  // com 5% de erro e as pausas humanas, o resultado sai em ~0,74 da mira
  const miraPara = (cpm) => (cpm / 5) / 0.74;

  const B = (window.__bot = {
    estado: 'esperando largada', corrida: 0, i: 0, total: null, rodando: true,
    parar: false, erros: 0, cpmEscolhido: null, ppmMira: null,
    ppmMedido: null, cpmMedido: null, historico: [], falha: null,
  });

  const largar = () => {
    if (!cfg.largar) return;
    const join = botao(/^Join Race$/i);
    if (join) join.click();
    const start = botao(/^Start Race$/i);
    if (start) start.click();
  };

  async function umaCorrida() {
    const cpm = cfg.ppm ? cfg.ppm * 5 * 0.74 : sorteiaCpm();
    const mira = cfg.ppm || miraPara(cpm);
    B.cpmEscolhido = Math.round(cpm);
    B.ppmMira = Math.round(mira);
    B.estado = 'esperando largada';
    B.i = 0;
    B.erros = 0;

    largar();

    let caixa = null, campo = null, texto = '';
    for (let t = 0; t < 7200; t++) { // ate 6 min esperando
      if (B.parar) return 'parado';
      if (ehTesteDeVerificacao()) { B.falha = 'teste de verificacao na tela: nao digito nele'; return 'trava'; }
      caixa = document.querySelector('div.relative.leading-relaxed.select-none.overflow-hidden');
      campo = document.querySelector('input.font-mono');
      if (caixa && campo && !campo.disabled) {
        texto = [...caixa.querySelectorAll('span')].map((s) => s.textContent).join('');
        if (texto.length > 10) break;
      }
      if (t % 40 === 39) largar(); // a sala re-renderiza; tenta de novo de vez em quando
      await dorme(50);
    }
    if (!texto) return 'sem largada';

    B.estado = 'digitando';
    B.corrida++;
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

    const base = 60000 / (mira * 5);
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
      if (B.parar) return 'parado';
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
    B.historico.push({ corrida: B.corrida, chars: B.i, cpmPedido: B.cpmEscolhido, cpmMedido: B.cpmMedido, erros: B.erros });
    B.estado = 'terminou';
    return 'ok';
  }

  (async () => {
    try {
      do {
        const r = await umaCorrida();
        if (r === 'parado' || r === 'trava') break;
        if (!cfg.rearmar) break;
        if (r === 'sem largada') break;
        // espera a corrida atual sair da tela antes de armar a proxima
        B.estado = 'rearmando';
        for (let t = 0; t < 600; t++) {
          if (B.parar) break;
          const campo = document.querySelector('input.font-mono');
          if (!campo || campo.disabled) break;
          await dorme(100);
        }
      } while (!B.parar);
    } catch (e) {
      B.falha = e.message;
    } finally {
      B.rodando = false;
      if (B.estado !== 'terminou') B.estado = 'parado';
    }
  })();

  return { armado: true, padrao: `${cfg.cpmMin}-${cfg.cpmMax} CPM, centro ${cfg.cpm}`, acerto: `${Math.round((1 - cfg.taxaErro) * 100)}%`, rearmar: cfg.rearmar };
}
