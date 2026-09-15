# CLI de Projetos

CLI (Command Line Interface) interativa para criação automatizada e padronizada de projetos Front-end e Back-end.

Desenvolvido por **André Borges**, este gerador configura toda a estrutura base de código para você começar a programar imediatamente, poupando o trabalho de configuração manual inicial de rotas, componentes e ferramentas como o TypeScript.

## Tecnologias Suportadas

- **Front-end:** React + TypeScript (via Vite) com estrutura de componentes.
- **Back-end:** Node.js + Express + TypeScript com estrutura de rotas e controllers.

## Como usar na sua máquina

Para usar a ferramenta localmente, siga os passos abaixo:

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/cli-projetos.git
cd cli-projetos
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Rodar em ambiente de desenvolvimento
Se quiser apenas testar a CLI sem instalar no seu computador, rode:
```bash
npm run dev
```

---

## Como instalar globalmente (Recomendado)

Para que você possa digitar `cli-projetos` em **qualquer pasta do seu computador** e gerar um projeto novo, você precisa compilar e "linkar" o pacote globalmente no NPM.

1. **Gere a build (compila o TypeScript para JavaScript):**
   ```bash
   npm run build
   ```
2. **Crie o link global:**
   ```bash
   npm link
   ```

Agora basta abrir qualquer terminal no seu computador e digitar o comando:
```bash
cli-projetos
```