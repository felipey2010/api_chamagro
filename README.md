# API CHAMAGRO

[![NPM Version][npm-version-image]][npm-url]
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
![license: MIT][license]
![Node Version][node]

Esta API Node.js Express serve como API de backend para **ChamAgro**, uma plataforma construída durante o hackathon EXPOFERR de 2024. A API é construída usando **Node.js** e **Express** e fornece uma interface RESTful para gerenciar usuários, notificações e muito mais.

## Índice

1. [Recursos](#recursos)
2. [Tecnologias usadas](#tecnologias-usadas)
3. [Instalação](#instalação)
4. [Configuração](#configuração)
5. [Manipulação de resposta](#manipulação-de-resposta)
6. [Contribuição](#contribuição)
7. [Contato](#contato)

## Recursos

- **Gerenciamento de usuários**: crie, atualize, exclua e busque dados de usuários.

## Tecnologias usadas

- [**Node.js**](https://nodejs.org/en): ambiente de execução JavaScript
- [**Express.js**](https://expressjs.com/): framework web rápido, imparcial e minimalista
- [**Prisma ORM**](https://www.prisma.io/): acesso e manipulação de banco de dados
- [**JWT**](https://www.npmjs.com/package/jsonwebtoken): JSON Web Token para autenticação
- [**Joi**](https://www.npmjs.com/package/joi): validação de esquemas de dados de solicitação
- [**Http-status**](https://www.npmjs.com/package/http-status): utilitário para adicionar status ao tratamento de resposta informando o nome ou código
- [**Bcrypt**](https://www.npmjs.com/package/bcrypt): hash de senha
- [**Google APIs**](https://www.npmjs.com/package/googleapis): API do GMail para enviar mensagens por e-mail
- [**Nodemailer**](https://nodemailer.com/): Módulo para enviar e-mail

### Instalação

- Clone o repositório `https://github.com/felipey2010/api-mentor-connect.git`
- Instale dependências: `npm install`
- Configure variáveis ​​de ambiente (por exemplo, string de conexão do banco de dados, segredo JWT).
- Execute os comandos `npm run db-pull` e após `npm run db-generate` para configurar Prisma ORM automaticamente
- Inclua .env no seu .gitignore
- Inicie o servidor: `npm start` ou `npm run dev`

É executado em localhost:3000 por padrão, mas pode ser configurado usando a variável de ambiente `PORT`.

## Configuração

Crie um arquivo `.env` no diretório raiz com as seguintes variáveis ​​de ambiente:

```bash
PORT=
NODE_ENV="production" ou "development"
POSTGRES_URL="url do seu banco de dados postgres (produção). Use 'production' no NODE_ENV"
DB_LOCAL_URL="seu banco de dados local (desenvolvimento). Use 'development' no NODE_ENV"

JWT_SALTROUND=
JWT_SECRET="uma chave secreta segura"
JWT_ACCESS_EXPIRATION_MINUTES=
JWT_REFRESH_EXPIRATION_DAYS=
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME="seu email"
SMTP_PASSWORD=
EMAIL_FROM="seu email"

OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
OAUTH_REDIRECT_URI=https://developers.google.com/oauthplayground
OAUTH_REFRESH_TOKEN="gmail api refresh token"
OAUTH_USER="seu email"

ENCRYPTION_SECRET_KEY="gerar qualquer chave segura"
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
APPWRITE_BUCKET_ID=
```

## Manipulação de resposta

Cada ponto final retorna códigos de status HTTP padrão para indicar sucesso ou falha. As respostas são retornadas com um objeto JSON estruturado contendo:

- status: código de status HTTP
- success: booleano para indicar se a solicitação foi bem-sucedida
- message: description
- data: os dados solicitados ou nulos, se nenhum dado estiver envolvido

Para tratamento de erros, todos os itens acima são enviados, exceto os dados que são substituídos por `error`

## Contribuição

Se você quiser contribuir para o desenvolvimento deste projeto, siga estas etapas:

1. Bifurque este repositório.
2. Crie uma ramificação para seu recurso ou correção de bug (git checkout -b feature/feature-name).
3. Confirme suas alterações (git commit -am 'Add a new feature').
4. Envie para a ramificação (git push origin feature/feature-name).
5. Crie uma nova solicitação de pull.

## Contato

Para mais informações ou suporte, entre em contato com a equipe de desenvolvimento:

- Email: [mentorhub2024@gmail.com](mailto:mentorhub2024@gmail.com)

---

[npm-url]: https://npmjs.org/package/express
[npm-version-image]: https://badgen.net/npm/v/express
[license]: https://badgen.net/npm/license/lodash
[node]: https://badgen.net/npm/node/next
