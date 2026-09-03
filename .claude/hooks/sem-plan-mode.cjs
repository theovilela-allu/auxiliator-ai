#!/usr/bin/env node
// Gancho PreToolUse em EnterPlanMode: plan mode esta desligado nesta casa desde 02/09/2026.
// Motivo, nas palavras do Rei: "toda vez que eu to aprovando um plano usando esse bypass permissions,
// ele ta me perguntando se pode seguir assim". E no modo autonomo a aprovacao travaria a noite inteira.
// So barro a ENTRADA; ExitPlanMode fica livre, pra eu conseguir sair se ele mesmo me botar em plan mode.
const out = {
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: 'Plan mode esta desligado nesta casa (pedido do Rei em 02/09/2026: a aprovacao ficava perguntando se podia seguir). Planeje do mesmo jeito, mas em texto: mostre em 3 a 6 linhas o que vai fazer e em que ordem, e EXECUTE na sequencia, sem esperar OK; ele interrompe se discordar. No modo autonomo, o plano vai pro Obsidian. Regra: memory/05-como-eu-opero/skills/modo-especialista.md',
  },
};
process.stdout.write(JSON.stringify(out));
process.exit(0);
