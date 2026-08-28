---
name: testar-so-o-que-mudou
type: feedback
description: 28/08 — o teste cobre só o que foi implementado por último e o que encosta nele; varredura ampla só quando a mexida é transversal, e ataque de segurança só em marco de projeto
atualizado: 2026-08-28
---

O Theo cobrou em 28/08/2026, com urgência: **"os agentes tão testando o projeto inteiro todas as
vezes que eu peço algo. Tá demorando demais."** E fechou a régua com as palavras dele: *"testes
somente no que foi implementado por último e no que tange o que foi implementado."*

**Why:** a skill [[loop]] cobrava "duas baterias limpas" sem nunca definir **o que é uma bateria**.
Sem alvo escrito, o padrão virou varrer o sistema todo, duas vezes, mais cinco frentes de ataque,
pra qualquer pedido, do ajuste de texto de tela ao redesenho de regra. O custo da equipe cresce com
o **tamanho do alvo**, não com a dificuldade do problema: em agosto ela foi 52% do gasto do mês.

**How to apply:**

1. **Alvo padrão:** o último pacote implementado + o que encosta nele + um smoke curto (entrar,
   abrir o quadro, criar pedido, aprovar). Código que ninguém tocou fica fora, mesmo ali do lado.
2. **Monto o raio antes de testar:** `git diff --stat` do que mudou, `grep` de quem depende dos
   nomes que mudaram. Declaro o escopo em uma linha e sigo; ele alarga se quiser.
3. **Ampla só quando a mexida é transversal:** login/sessão, permissão/alçada, migração ou função
   de banco, componente compartilhado, regra de valor/rateio, disparo de mensagem.
4. **Projeto inteiro só a pedido**, ou na véspera de subir pacote grande.
5. **Depois do conserto, retesto o conserto**, não o projeto: o conserto, o que ele encostou e o
   smoke. "O contador zerou" nunca significa "roda tudo de novo".
6. **Ataque de segurança só em marco:** fim de projeto ou de frente grande, véspera de commit ou
   atualização grande, ou a pedido. Fora disso, se o que mudou encostar em login, permissão, alçada
   ou dado de terceiro, eu aviso em uma linha e ofereço o ataque pontual; ele decide.

Vale pra **qualquer teste meu**, não só quando a equipe está montada. A regra completa da equipe
está em [[loop]].

Ligações: [[loop]], [[provar-menos-gastar-menos]] (aquela é a dose, esta é o alvo),
[[testar-antes-de-dizer-pronto]], [[travar-em-60-de-contexto]].
