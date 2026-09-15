#!/usr/bin/env node
import * as p from '@clack/prompts';
import color from 'picocolors';
import path from 'node:path';
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper para abortar execuções canceladas pelo usuário (Ctrl+C)
function handleCancel(value: unknown) {
    if (p.isCancel(value)) {
        p.cancel('Operação abortada pelo usuário.');
        process.exit(0);
    }
}

async function run() {
    console.clear();
    p.intro(`${color.bgCyan(color.black(' MEU GERADOR DE PROJETOS '))}`);

    // 1. Nome do projeto com sanitização e validação
    const projectName = await p.text({
        message: 'Qual o nome do projeto?',
        placeholder: 'meu-novo-app',
        validate: (value) => {
            if (!value) return 'O nome do projeto é obrigatório.';
            if (!/^[a-z0-9-_]+$/i.test(value)) {
                return 'Use apenas letras, números, hifens (-) e sublinhados (_).';
            }
            if (fs.existsSync(path.resolve(process.cwd(), value))) {
                return `O diretório "${value}" já existe neste local!`;
            }
        },
    });
    handleCancel(projectName);

    // 2. Tipo do projeto
    const projectType = await p.select({
        message: 'Qual o tipo de projeto?',
        options: [
            { value: 'back-end', label: 'Back-end', hint: 'APIs, microsserviços' },
            { value: 'front-end', label: 'Front-end', hint: 'SPAs, aplicações web' },
        ],
    });
    handleCancel(projectType);

    // 3. Stack baseada no tipo selecionado
    const stackOptions = {
        'back-end': [
            { value: 'typescript-express', label: 'Express + TypeScript', hint: 'Padrão recomendado' },
            { value: 'typescript-nest', label: 'NestJS + TypeScript' },
        ],
        'front-end': [
            { value: 'typescript-react', label: 'React + TypeScript', hint: 'Padrão recomendado' },
            { value: 'typescript-next', label: 'Next.js + TypeScript' },
        ],
    };

    const stack = await p.select({
        message: 'Qual tecnologia deseja usar?',
        initialValue: projectType === 'back-end' ? 'typescript-express' : 'typescript-react',
        options: stackOptions[projectType as keyof typeof stackOptions],
    });
    handleCancel(stack);

    // 4. Preferências adicionais de ambiente
    const shouldInitGit = await p.confirm({
        message: 'Deseja inicializar um repositório Git local (git init)?',
        initialValue: true,
    });
    handleCancel(shouldInitGit);

    const shouldInstallDeps = await p.confirm({
        message: 'Deseja instalar as dependências agora (npm install)?',
        initialValue: true,
    });
    handleCancel(shouldInstallDeps);

    // 5. Cópia e Configuração do Template
    const s = p.spinner();
    s.start(`Montando projeto em ./${String(projectName)}...`);

    const targetDir = path.resolve(process.cwd(), projectName as string);
    const templateDir = path.resolve(__dirname, '../templates', projectType as string, stack as string);

    try {
        if (!(await fs.pathExists(templateDir))) {
            throw new Error(`Template não encontrado: ${templateDir}`);
        }

        // Copia arquivos do template
        await fs.copy(templateDir, targetDir);

        // Renomeia _gitignore para .gitignore caso exista no template
        const rawGitignore = path.join(targetDir, '_gitignore');
        const dotGitignore = path.join(targetDir, '.gitignore');
        if (await fs.pathExists(rawGitignore)) {
            await fs.move(rawGitignore, dotGitignore, { overwrite: true });
        }

        // Atualiza o package.json
        const targetPkgPath = path.join(targetDir, 'package.json');
        if (await fs.pathExists(targetPkgPath)) {
            const pkg = await fs.readJson(targetPkgPath);
            pkg.name = projectName;
            await fs.writeJson(targetPkgPath, pkg, { spaces: 2 });
        }

        s.stop(`Arquivos copiados para ${color.green(`./${String(projectName)}`)}`);

        // Inicialização do Git
        if (shouldInitGit) {
            s.start('Inicializando Git...');
            await execa('git', ['init'], { cwd: targetDir });
            s.stop('Repositório Git inicializado.');
        }

        // Instalação de dependências
        if (shouldInstallDeps) {
            s.start('Instalando dependências via npm (pode levar alguns segundos)...');
            await execa('npm', ['install'], { cwd: targetDir });
            s.stop('Dependências instaladas.');
        }

        // Instruções de finalização
        const nextSteps = [
            `cd ${String(projectName)}`,
            ...(shouldInstallDeps ? [] : ['npm install']),
            'npm run dev',
        ].join('\n');

        p.note(nextSteps, 'Próximos passos para rodar:');
        p.outro(color.green('Tudo pronto para começar!'));
    } catch (err: any) {
        s.stop('Falha ao gerar projeto.');
        p.log.error(err.message || String(err));
        process.exit(1);
    }
}

run();