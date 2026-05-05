
---

# 🌐 AilaNav — Navegador Web Simples

O **AilaNav** é um navegador web minimalista desenvolvido em **HTML, CSS e JavaScript puro**, com o objetivo de demonstrar de forma simples como funciona o carregamento de páginas dentro de um `iframe`.

Ele é ideal para aprendizado, experimentação e projetos educacionais.

---

## ✨ Funcionalidades

* 🔎 Campo de entrada para URLs
* 🌍 Carregamento de sites em tempo real
* ⚡ Adição automática de `https://` caso o usuário não digite
* 🖥️ Exibição do site dentro da própria página usando `iframe`
* 📢 Feedback de status para o usuário

---

## 🧠 Como funciona

O AilaNav utiliza um elemento `<iframe>` para carregar páginas externas. Quando o usuário digita uma URL e clica em **"Ir"**, o sistema:

1. Verifica se a URL foi digitada
2. Adiciona `https://` automaticamente (se necessário)
3. Define a URL como `src` do iframe
4. Exibe o conteúdo dentro da interface

⚠️ **Importante:**
Alguns sites não permitem ser carregados em iframes devido a políticas de segurança (como `X-Frame-Options` e `Content-Security-Policy`). Isso é normal e esperado.

---

## 🚀 Como usar

1. Baixe ou clone o repositório:

```bash
git clone https://github.com/seu-usuario/ailanav.git
```

2. Abra o arquivo `index.html` em qualquer navegador

3. Digite uma URL (ex: `google.com`)

4. Clique em **Ir**

---

## 📁 Estrutura do Projeto

```
AilaNav/
│
├── index.html   # Arquivo principal com toda a aplicação
```

---

## 🎯 Objetivo do Projeto

Este projeto foi criado para:

* Aprender conceitos básicos de navegação web
* Entender o uso de `iframe`
* Explorar manipulação de DOM com JavaScript
* Servir como base para projetos maiores (como navegadores mais completos)

---

## 🔮 Possíveis melhorias futuras

* 🔖 Sistema de favoritos
* 📜 Histórico de navegação
* 🔎 Barra de busca integrada (tipo Google)
* 🧩 Suporte a múltiplas abas
* 🎨 Interface mais moderna
* 🛡️ Tratamento de erros mais avançado

---

## 📄 Licença

Este projeto é livre para uso e modificação para fins educacionais.
