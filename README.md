# Dictionary Project

## 📝 Descrição

Este projeto é um dicionário fullstack que desenvolvi para entregar uma aplicação completa com todas
suas funcionalidades do dicionário.

Como meu foco é front-end, coloquei a maior parte do meu tempo e cuidado ali, pensando em UI,
interatividade e experiência do usuário.

O back-end eu fiz com o conhecimento mais básico que tinha na área. Preferi mantê-lo simples e
direto, sem entrar em funcionalidades mais avançadas (como filas, cache mais elaborado, testes
automatizados, etc). Acredito que com mais tempo e prática conseguiria implementar essas questões
caso necessário.

Um ponto futuro para o front-end seria adicionar mais testes, principalmente para componentes e
realizar mais testes de performance e buscar separar mais componentes, buscar o que precisa de
memoização e outras melhorias.

---

## 🚀 Tecnologias utilizadas

**Backend (server)**

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

**Frontend (client)**

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Motion](https://motion.dev/)

---

## 📁 Estrutura do projeto

O projeto está dividido em duas partes principais:

```
.
├── server/              # Aplicação back-end (Node)
│   └── db/
│       └── schema.sql   # Definição das tabelas do Postgres
└── client/              # Aplicação front-end (Next.js)
```

Cada uma das pastas possui suas próprias dependências e variáveis de ambiente, e deve ser
configurada separadamente, conforme descrito abaixo.

---

## ⚙️ Configuração das variáveis de ambiente

### Server

Dentro da pasta `server`, crie um arquivo `.env` a partir do `.env.example` e preencha com as suas
informações:

```bash
cd server
cp .env.example .env
```

Variáveis necessárias:

```dotenv
DATABASE_URL=
REDIS_URL="redis://127.0.0.1:6379"
JWT_SECRET=
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

| Variável         | Descrição                                                                                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | String de conexão com o banco de dados PostgreSQL. **Ao rodar via Docker Compose, esse valor é sobrescrito automaticamente** apontando para o container do Postgres — não precisa alterar no `.env` para uso local. |
| `REDIS_URL`      | URL de conexão com o Redis. Padrão local: `redis://127.0.0.1:6379`. **Ao rodar via Docker Compose, esse valor também é sobrescrito automaticamente** para `redis://redis:6379` — não precisa alterar no `.env`.     |
| `JWT_SECRET`     | Chave secreta utilizada para assinar os tokens JWT.                                                                                                                                                                 |
| `JWT_EXPIRES_IN` | Tempo de expiração do token JWT (ex: `7d` para 7 dias).                                                                                                                                                             |
| `NODE_ENV`       | Ambiente de execução (`development`, `production`, etc).                                                                                                                                                            |
| `FRONTEND_URL`   | URL onde o client está rodando, usada para configurações de CORS.                                                                                                                                                   |

### Client

Dentro da pasta `client`, crie um arquivo `.env.local` a partir do `.env.example` e preencha com as
suas informações:

```bash
cd client
cp .env.example .env.local
```

Variáveis necessárias:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5001
```

| Variável              | Descrição                                           |
| --------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL base da API (server) que o client irá consumir. |

---

## 💻 Como instalar e rodar o projeto

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados
  (para rodar o backend, o Redis e o Postgres)
- [Node.js](https://nodejs.org/) (recomendado: versão LTS mais recente) — necessário para rodar o
  **client**
- Gerenciador de pacotes de sua preferência (`npm`, `yarn` ou `pnpm`)

> Todo o backend (Node + Redis + Postgres) roda via Docker Compose — não é necessário instalar nem
> configurar nenhum banco de dados manualmente. Apenas é preciso carregar o schema uma vez (ver
> passo 3 abaixo).

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd <nome-do-projeto>
```

### 2. Configurar e rodar o server (Docker)

```bash
cd server
cp .env.example .env
# preencha o .env conforme a seção "Configuração das variáveis de ambiente"
# (DATABASE_URL e REDIS_URL são sobrescritas automaticamente pelo docker-compose
# e não precisam ser alteradas para rodar localmente)

cd ..
docker compose up -d --build
```

Esse comando sobe três containers:

| Serviço                  | Container             | Porta  |
| ------------------------ | --------------------- | ------ |
| Backend (Node + Express) | `dictionary-backend`  | `5001` |
| Postgres                 | `dictionary-postgres` | `5432` |
| Redis                    | `dictionary-redis`    | `6379` |

A API ficará disponível em `http://localhost:5001`.

Para acompanhar os logs:

```bash
docker compose logs -f backend
```

Para parar os containers:

```bash
docker compose down
```

### 3. Criar as tabelas e popular o banco

Na primeira vez que subir o projeto (banco ainda vazio), é necessário criar as tabelas a partir do
`server/db/schema.sql`:

```bash
docker exec -i dictionary-postgres psql -U postgres -d dictionary < server/db/schema.sql
```

Em seguida, popule a tabela `Word` com a lista de palavras em inglês. Esse comando deve ser rodado
**dentro do container do backend** (e não diretamente no seu terminal local), pois é lá que a
variável `DATABASE_URL` está configurada corretamente pelo Docker Compose:

```bash
docker exec -it dictionary-backend npm run import:words
```

### 4. Configurar e rodar o client

O client roda fora do Docker, diretamente com Node:

```bash
cd client
npm install
cp .env.example .env.local
# preencha o .env.local conforme a seção "Configuração das variáveis de ambiente"
npm run dev
```

Por padrão, o client ficará disponível em `http://localhost:3000`.

### 5. Acessar a aplicação

Com o server e o client rodando, acesse:

```
http://localhost:3000
```
