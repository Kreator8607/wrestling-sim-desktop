# 🏗️ INSTRUÇÕES DE BUILD PARA WINDOWS

## Pro Wrestling Sim - Desktop Edition v2.0.0

---

## 📋 PRÉ-REQUISITOS

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Git** - [Download](https://git-scm.com/)
3. **Windows 7 ou superior**

---

## 🚀 PASSO 1: PREPARAR AMBIENTE

### 1.1 Clonar Repositório
```bash
git clone <repository-url>
cd wrestling_sim_desktop
```

### 1.2 Instalar Dependências
```bash
npm install --legacy-peer-deps
```

---

## 🔨 PASSO 2: BUILD PARA WINDOWS

### 2.1 Build Instalador (NSIS)
```bash
npm run build:win
```

**Resultado**: `dist/ProWrestlingSim-Setup.exe`

### 2.2 Build Portável
```bash
npm run build:win-portable
```

**Resultado**: `dist/ProWrestlingSim-Portable.exe`

---

## 📦 ARQUIVOS GERADOS

Após o build, você encontrará em `dist/`:

```
dist/
├── ProWrestlingSim-Setup.exe      (Instalador - 150-200MB)
├── ProWrestlingSim-Portable.exe   (Portável - 150-200MB)
└── builder-effective-config.yaml  (Configuração de build)
```

---

## ✅ VERIFICAR BUILD

### Testar Instalador
1. Execute `ProWrestlingSim-Setup.exe`
2. Siga o assistente de instalação
3. Clique em "Pro Wrestling Sim" para iniciar
4. Verifique se o banco de dados foi criado

### Testar Portável
1. Execute `ProWrestlingSim-Portable.exe`
2. Aplicativo inicia imediatamente
3. Dados são salvos no diretório do executável

---

## 🐛 TROUBLESHOOTING

### Erro: "Visual Studio Build Tools not found"
**Solução**: Instale [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)

### Erro: "Node modules not found"
**Solução**: Execute `npm install --legacy-peer-deps` novamente

### Aplicativo não inicia
**Solução**: 
1. Verifique se o Node.js está instalado
2. Limpe a pasta `node_modules` e reinstale
3. Verifique os logs em `%APPDATA%\Pro Wrestling Sim\`

---

## 📊 TAMANHO DO BUILD

| Arquivo | Tamanho |
|---------|---------|
| Instalador | ~150-200 MB |
| Portável | ~150-200 MB |
| Descompactado | ~500-600 MB |

---

## 🔐 ASSINATURA DIGITAL

Para assinar o executável com certificado:

```bash
# Editar package.json e adicionar certificateFile e certificatePassword
npm run build:win
```

---

## 📝 NOTAS IMPORTANTES

1. **Primeira Execução**: O banco de dados é criado automaticamente
2. **Dados Persistem**: Todos os dados são salvos localmente em SQLite
3. **Sem Internet**: O aplicativo funciona completamente offline
4. **Atualizações**: Será necessário reinstalar para atualizar

---

## 🎉 CONCLUSÃO

Após o build, você terá um executável pronto para distribuição no Windows!

**Próximos Passos**:
1. Testar em máquina Windows
2. Criar página de download
3. Distribuir para usuários

---

**Versão**: 2.0.0  
**Data**: Janeiro de 2026  
**Plataforma**: Windows 7+
