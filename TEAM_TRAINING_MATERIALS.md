# Team Training Materials - GitHub Actions Maintenance

**Versão:** 1.0  
**Data:** May 3, 2026  
**Público:** Todos os desenvolvedores  

---

## 📚 Módulo 1: Introdução (30 minutos)

### Objetivo
Entender por que manutenção de dependências é importante

### Conteúdo

#### 1.1 Por que Manutenção?
```
Problema: Dependências desatualizadas causam:
  ❌ Vulnerabilidades de segurança
  ❌ Bugs e instabilidade
  ❌ Performance ruim
  ❌ Incompatibilidade com novos features
  ❌ Deprecation warnings

Solução: Manutenção regular
  ✅ Segurança garantida
  ✅ Estabilidade
  ✅ Performance otimizada
  ✅ Compatibilidade futura
  ✅ Sem surpresas
```

#### 1.2 Estatísticas
```
Projeto Pro Wrestling Sim:
  - 1,571 pacotes npm
  - 24.x Node.js
  - 4 GitHub Actions workflows
  - 50+ dependências críticas

Impacto de não manter:
  - 1 vulnerabilidade crítica por mês (média)
  - 10-15 atualizações por semana
  - Deprecation warnings a cada 3-6 meses
  - Build failures ocasionais
```

#### 1.3 Benefícios
```
Manutenção Regular:
  ✅ 0 vulnerabilidades críticas
  ✅ Build sempre verde
  ✅ Sem surpresas
  ✅ Performance melhorada
  ✅ Compatibilidade futura
```

### Atividade
- Discussão: "Qual foi o último problema que tivemos com dependências?"
- Brainstorm: "Como poderíamos ter evitado?"

---

## 📚 Módulo 2: Ferramentas (45 minutos)

### Objetivo
Aprender a usar as ferramentas de manutenção

### Conteúdo

#### 2.1 npm audit
```bash
# Verificar vulnerabilidades
npm audit

# Ver em JSON
npm audit --json

# Apenas críticas/altas
npm audit --audit-level=high

# Tentar corrigir automaticamente
npm audit fix

# Corrigir com peer deps
npm audit fix --legacy-peer-deps
```

**Interpretando resultados:**
```
Critical: Corrigir IMEDIATAMENTE (< 1h)
High: Corrigir hoje (< 24h)
Moderate: Corrigir essa semana (< 1 semana)
Low: Corrigir esse mês (< 1 mês)
```

#### 2.2 npm outdated
```bash
# Ver pacotes desatualizados
npm outdated

# Ver em JSON
npm outdated --json

# Atualizar menores
npm update

# Atualizar específico
npm install package-name@latest

# Atualizar todos (cuidado!)
npm install -g npm-check-updates
npx ncu -u
npm install
```

**Interpretando resultados:**
```
Current: Versão instalada
Wanted: Versão mais recente compatível
Latest: Versão mais recente
```

#### 2.3 GitHub Actions
```bash
# Ver status dos workflows
gh run list

# Ver detalhes de um run
gh run view <run-id>

# Ver logs
gh run view <run-id> --log

# Rerun workflow
gh run rerun <run-id>
```

#### 2.4 Dependabot
```
Funciona automaticamente:
✅ Verifica atualizações diariamente
✅ Cria PRs automaticamente
✅ Executa testes
✅ Sugere merge
```

### Atividade Prática
1. Executar `npm audit` no projeto
2. Executar `npm outdated`
3. Revisar GitHub Actions logs
4. Discutir resultados

---

## 📚 Módulo 3: Processos (60 minutos)

### Objetivo
Entender o processo de manutenção

### Conteúdo

#### 3.1 Semanal
```
Toda segunda-feira, 09:00 UTC:

1. Monitoramento (15 min)
   - Revisar maintenance-check.sh report
   - Verificar vulnerabilidades
   - Listar atualizações

2. Avaliação (15 min)
   - Priorizar issues
   - Planejar implementação
   - Atribuir responsáveis

3. Ação (30 min)
   - Se crítica: corrigir imediatamente
   - Se alta: planejar para hoje
   - Se média: agendar para semana
```

#### 3.2 Mensal
```
Primeiro dia do mês:

1. Atualizar versões menores (30 min)
   - npm update
   - Testar localmente
   - Fazer commit

2. Testar workflows (30 min)
   - Executar build
   - Executar testes
   - Verificar performance

3. Criar release (30 min)
   - Atualizar CHANGELOG
   - Criar tag
   - Gerar release notes
```

#### 3.3 Trimestral
```
A cada 3 meses:

1. Avaliar versões maiores (1h)
   - Revisar breaking changes
   - Planejar migração
   - Estimar esforço

2. Planejar upgrades (1h)
   - Priorizar
   - Agendar
   - Comunicar ao time
```

#### 3.4 Anual
```
Início do ano:

1. Revisar roadmap (2h)
   - Node.js LTS
   - Electron releases
   - Framework updates

2. Planejar mudanças (2h)
   - Arquitetura
   - Dependências críticas
   - Estratégia
```

### Atividade Prática
1. Simular processo semanal
2. Criar PR com atualização
3. Revisar e fazer merge
4. Criar release

---

## 📚 Módulo 4: Troubleshooting (45 minutos)

### Objetivo
Resolver problemas comuns

### Conteúdo

#### 4.1 npm audit mostra vulnerabilidades
```
Problema: npm audit encontra vulnerabilidades

Solução 1: Auto-fix
  npm audit fix

Solução 2: Manual
  npm install vulnerable-package@latest

Solução 3: Aceitar risco (se seguro)
  npm audit --audit-level=moderate

Solução 4: Investigar
  npm audit --json | jq '.vulnerabilities'
```

#### 4.2 Build falha após atualização
```
Problema: npm update quebrou o build

Solução 1: Limpar e reinstalar
  rm -rf node_modules package-lock.json
  npm install

Solução 2: Testar build
  npm run build:win

Solução 3: Se ainda falhar, rollback
  git revert <commit-hash>
  npm install

Solução 4: Investigar erro
  npm run build:win 2>&1 | head -50
```

#### 4.3 GitHub Actions deprecated warning
```
Problema: GitHub Actions mostra deprecation warning

Solução 1: Encontrar action deprecated
  grep -r "@v3" .github/workflows/
  grep -r "@v2" .github/workflows/

Solução 2: Atualizar
  # Mudar: uses: actions/checkout@v3
  # Para: uses: actions/checkout@v4

Solução 3: Testar
  git push origin test-branch
  Verificar workflow

Solução 4: Fazer merge
  git checkout master
  git merge test-branch
  git push origin master
```

#### 4.4 Node.js version mismatch
```
Problema: Versão local diferente de CI

Solução 1: Verificar versão
  node --version
  npm --version

Solução 2: Atualizar Node.js
  nvm install 24.x
  nvm use 24.x

Solução 3: Verificar novamente
  node --version
  npm --version

Solução 4: Reinstalar dependências
  npm install
```

### Atividade Prática
1. Simular cada problema
2. Aplicar solução
3. Verificar resultado
4. Documentar aprendizado

---

## 📚 Módulo 5: Segurança (30 minutos)

### Objetivo
Entender segurança em dependências

### Conteúdo

#### 5.1 Tipos de Vulnerabilidades
```
Critical: Exploração fácil, impacto alto
  Exemplo: SQL injection, RCE
  Ação: Corrigir em < 1 hora

High: Exploração possível, impacto alto
  Exemplo: XSS, CSRF
  Ação: Corrigir em < 24 horas

Moderate: Exploração difícil, impacto médio
  Exemplo: DoS, Information disclosure
  Ação: Corrigir em < 1 semana

Low: Exploração muito difícil, impacto baixo
  Exemplo: Timing attacks
  Ação: Corrigir em < 1 mês
```

#### 5.2 Melhores Práticas
```
✅ Manter dependências atualizadas
✅ Usar lock files (package-lock.json)
✅ Executar npm audit regularmente
✅ Revisar mudanças antes de merge
✅ Testar completamente
✅ Monitorar em produção
✅ Ter plano de resposta
✅ Documentar tudo
```

#### 5.3 Resposta a Incidente
```
1. Detectar (npm audit, Dependabot)
2. Avaliar (impacto, severidade)
3. Planejar (solução, timeline)
4. Implementar (fix, test, deploy)
5. Comunicar (team, users)
6. Analisar (post-mortem)
7. Melhorar (processo, documentação)
```

### Atividade Prática
1. Revisar npm audit report
2. Classificar vulnerabilidades
3. Planejar resposta
4. Implementar fix

---

## 📚 Módulo 6: Hands-On Lab (90 minutos)

### Objetivo
Praticar tudo que foi aprendido

### Exercício 1: Auditoria de Segurança (20 min)
```bash
# 1. Executar npm audit
npm audit

# 2. Salvar resultado
npm audit > audit-report.txt

# 3. Analisar
# - Quantas vulnerabilidades?
# - Qual a severidade?
# - Qual o impacto?

# 4. Reportar
# - Criar documento
# - Apresentar ao time
```

### Exercício 2: Atualizar Dependências (30 min)
```bash
# 1. Criar branch
git checkout -b update/dependencies

# 2. Atualizar
npm update

# 3. Testar
npm run build:win

# 4. Se OK, fazer commit
git add -A
git commit -m "chore(deps): Update dependencies"

# 5. Se erro, rollback
git reset --hard HEAD~1

# 6. Investigar e corrigir
```

### Exercício 3: Revisar Workflows (20 min)
```bash
# 1. Verificar workflows
ls -la .github/workflows/

# 2. Procurar por deprecated actions
grep -r "@v3" .github/workflows/
grep -r "@v2" .github/workflows/

# 3. Atualizar se necessário
# 4. Testar
# 5. Fazer commit
```

### Exercício 4: Criar PR (20 min)
```bash
# 1. Criar branch
git checkout -b update/test

# 2. Fazer mudança pequena
echo "# Test" >> README.md

# 3. Fazer commit
git add -A
git commit -m "test: Update test"

# 4. Push
git push origin update/test

# 5. Criar PR
gh pr create --title "Test" --body "Test PR"

# 6. Revisar e fazer merge
```

---

## 📋 Checklist de Aprendizado

### Módulo 1: Introdução
- [ ] Entendo por que manutenção é importante
- [ ] Conheço os riscos de não manter
- [ ] Conheço os benefícios de manter

### Módulo 2: Ferramentas
- [ ] Consigo usar npm audit
- [ ] Consigo usar npm outdated
- [ ] Consigo usar GitHub Actions
- [ ] Entendo como Dependabot funciona

### Módulo 3: Processos
- [ ] Entendo processo semanal
- [ ] Entendo processo mensal
- [ ] Entendo processo trimestral
- [ ] Entendo processo anual

### Módulo 4: Troubleshooting
- [ ] Consigo resolver npm audit issues
- [ ] Consigo resolver build failures
- [ ] Consigo resolver deprecation warnings
- [ ] Consigo resolver version mismatches

### Módulo 5: Segurança
- [ ] Entendo tipos de vulnerabilidades
- [ ] Conheço melhores práticas
- [ ] Consigo responder a incidente
- [ ] Consigo comunicar riscos

### Módulo 6: Hands-On
- [ ] Consigo fazer auditoria
- [ ] Consigo atualizar dependências
- [ ] Consigo revisar workflows
- [ ] Consigo criar e revisar PRs

---

## 📊 Avaliação

### Quiz (15 perguntas, 5 minutos)
1. Qual é a frequência recomendada para npm audit?
2. Qual é a diferença entre "Wanted" e "Latest" no npm outdated?
3. Como você corrige uma vulnerabilidade crítica?
4. Qual é o primeiro passo ao receber um deprecation warning?
5. Como você testa uma atualização de dependência?
6. Qual é a ação recomendada para vulnerabilidade "High"?
7. Como você reverte uma atualização que quebrou o build?
8. Qual é o objetivo do Dependabot?
9. Como você monitora vulnerabilidades?
10. Qual é o processo de escalação?

### Prática (30 minutos)
1. Executar npm audit
2. Atualizar dependências
3. Testar build
4. Criar PR
5. Revisar e fazer merge

### Certificado
```
Certificado de Conclusão

Este certifica que [Nome] completou com sucesso
o treinamento de GitHub Actions Maintenance
para Pro Wrestling Sim v5.0.0

Data: [Data]
Assinado: [DevOps Lead]
```

---

## 📚 Recursos Adicionais

### Documentação
- GITHUB_ACTIONS_MAINTENANCE_PLAN.md
- MAINTENANCE_QUICK_REFERENCE.md
- GITHUB_NOTIFICATIONS_SETUP.md

### Ferramentas
- npm: https://docs.npmjs.com/
- GitHub Actions: https://docs.github.com/en/actions
- Dependabot: https://docs.github.com/en/code-security/dependabot

### Comunidade
- npm Support: https://npm.community/
- GitHub Discussions: https://github.com/Kreator8607/wrestling-sim-desktop/discussions
- Stack Overflow: https://stackoverflow.com/questions/tagged/npm

---

## 🎯 Próximas Etapas

1. **Semana 1:** Completar todos os módulos
2. **Semana 2:** Fazer quiz e prática
3. **Semana 3:** Receber certificado
4. **Semana 4:** Aplicar conhecimento no projeto

---

## 📞 Suporte

**Dúvidas?** Abra uma issue no GitHub ou pergunte no Slack

**Feedback?** Envie para devops@wrestling-sim.com

---

**Status:** ✅ PRONTO PARA TREINAMENTO

---

*Team Training Materials - Pro Wrestling Sim v5.0.0*  
*Generated: May 3, 2026*
