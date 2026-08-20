---
name: area-multi-ri-fpna
type: feedback
description: Theo tem 2 áreas (RI, FP&A) — tarefa multi-área precisa do campo area preenchido
atualizado: 2026-08-05
aliases:
  - feedback-area-multi
---

O Theo é de **RI e FP&A**. No quadro de tarefas, o filtro por área usa o campo `area` DA TAREFA (não a área do dono).

**Why:** dono de área única deixa `area` null e cai no fallback da área dele; mas dono multi-área (Theo) com `area` null não aparece direito no filtro — o Theo percebe como "a mudança não chegou".

**How to apply:** ao criar/mover tarefa do Theo, preencher `area` explicitamente conforme o contexto da tarefa (ex.: tarefas da meta de big numbers/dashboard = "FP&A"). Em dúvida entre RI e FP&A, perguntar. Ver [[dashboard-big-numbers]].
