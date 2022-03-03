# Users with Prisma IO

<table>
    <tr>
      <td>
        <a href="README.md">🇺🇸 Inglês</a>
      </td>
    </tr>
    <tr>
      <td>
        <a href="readme_pt-br.md" disabled >🇧🇷 Português</a>
      </td>
    </tr>
  </table>

Diversas aplicações web precisam que o usuário façam um cadastro, para que informações sejam associadas à conta desse usuário.
A partir disso, o objetivo deste projeto é fornecer um exemplo (e servir como um template) de como fazer o gerenciamento das informações do usuário em uma rest API utilizando o <a href="https://www.prisma.io/">Prisma.IO</a> como ORM.
São utilizados também conceitos de autenticação por token JWT (accessToken) e refreshToken para que novos JWT sejam gerados após a expiração.
O projeto é desenvolvido utilizando conceitos de arquitetura <a href="https://en.wikipedia.org/wiki/SOLID/">SOLID</a>, utilizando a linguagem typescript.

### ORM

ORM (Object Relational Mapper) é uma forma de mapeamento de objetos relacionais, ou seja, uma camada de abstração entre objetos na aplicação e objetos no banco de dados. Os ORMs tem como objetivo simplificar as interações entre aplicação e banco de dados, uma vez que através da linguagem de programação utilizada pode-se obter informações no banco, não necessitando da utilização de queries.

## Prisma IO

O Prisma é um ORM open source que tem como principal característica a simplicidade da abstração nas interações com o banco de dados. Como diversos outros ORM o prisma utiliza o conceito de migrações, para a partir de um esquema (o schema.prisma) criar/alterar/deletar as tabelas no banco de dados.

Para completar a simplicidade de utilização do prisma ele trás junto o prisma studio, onde pelo próprio navegador é possível vsualizar, alterar e excluir informações no banco de dados, não sendo necessária a instação de outras plataformas como <a href="https://dbeaver.io/download/">Dbeaver</a> ou <a href="https://www.beekeeperstudio.io/">Beekeeper</a>, por exemplo.

Para mais informações, consulte a página oficial do <a href="https://www.prisma.io/">Prisma.IO</a>.

## Funcionalidades do projeto

Esse projeto é uma Rest API que pode ser utilizada como exemplo para a criação do gerenciamento dos usuários em uma aplicação real.
São cobertas aqui as seguintes funcionalidades:

    - Criação do usuário;
    - Envio de e-mail de confirmação de registro;
    - Confirmação de e-mail do usuário;
    - Autenticação do usuário na aplicação;
      - Autenticação através de accessToken (JWT*);
      - Estratégia de refreshToken** para manter o usuário conectado.
    - Logout do usuário;
    - Reset de Senha (Esqueci minha senha);
    - Atualização das informações do usuário:
      - Atualização de avatar;
      - Atualização de e-mail, com envio de confirmação para o novo e-mail;
      - Atualização de nome;
      - Atualização de nome de usuário (username);
      - Atualização de senha.

\* Não conhece sobre token JWT? consulte <a href="https://jwt.io/introduction">JWT</a> para mais informações.<br>
\** Não conhece a estratégia de refresh token? consulte <a href="https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/">Refresh Token</a> para mais informações.

### Envio de e-mail

O envio de e-mail nesse projeto é feito com a biblioteca <a href="https://nodemailer.com/about/">Nodemailer</a>.
O Nodemailer fornece um servidor de envio de e-mails de teste, o <a href="https://nodemailer.com/smtp/testing/">Ethereal</a> que pode ser utilizado para testar se o envio de e-mails está sendo feito da forma como deve ser feito e para testar todas as funcionalidades da API, uma vez que alguns tokens enviados por e-mail são necessários em algumas atividades.

O envio de e-mail é gerenciado por uma classe escrita como um provider na aplicação, em <code>./src/shared/container/provider/mailProvider </code>.
A implementação já realizada cobre apenas o envio de e-mail de teste com nodemailer, com sua tipagem <code>IMailProvider.ts </code>, com a classe de envio em <code>/implementations</code> e com a classe para os testes unitários em <code>/inMemory </code>.

Para implementar essa API junto com as demais regras de negócio em produção, deve-se implementar o provedor de e-mail desejado para a aplicação. A documentação do nodemailer fornece exemplos para diferentes provedores de e-mail.
É recomendado que sejam criadas classes dentro da pasta <code>./src/shared/container/provider/mailProvider </code> seguindo a tipagem definida por <code>IMailProvider.ts </code>, de forma que apenas uma alteração no arquivo <code>./src/shared/container/provider/index.ts </code> e nas variaveis de ambiente seja necessária para o novo provedor de e-mail funcionar.

## Rodando a API

Para rodar e testar a API, clone esse repositório em sua máquina local:

```bash
git clone git@github.com:HurinBerdelon/Users_with_PrismaIO-TS.git
```

Acesse a pasta criada,

```bash
cd Users_with_PrismaIO-TS
```

Um arquivo <code>.env.example</code> existirá nessa pasta, ele deve ser copiado para um <code>.env</code> e alterado para as variáveis de ambiente que serão utilizadas.

- Na linha 19 está definida a variável MAIL, para qual o provider de e-mail será utilizado, por padrão definida como "ethereal".
Ela faz referência ao objeto mailProvider na linha 14 do arquivo <code>./src/shared/container/providers/index.ts </code> e caso um novo valor seja passado para MAIL, uma nova chave de mesmo valor deve ser passada para o objeto mailProvider.

- Nas linhas 23, 27, 31 e 35 são definidas as URLs de envio de e-mail. Para testes da API utilizando <a href="https://www.postman.com/">Postman</a> ou <a href="https://insomnia.rest/">Insomnia</a> as URLs de e-mail podem devolver para rotas do backend. Quando associado a um front-end, as rotas de envio de e-mail devem direcionar para o front-end, onde será feito o gerenciamento das informações mostradas em tela.

- Esse projeto utiliza o docker para criar uma imagem de banco de dados, não sendo necessária a instalação e configuração do banco de dados na máquina local. As linhas 5, 6, 7 e 8 definem as variáveis do banco de dados, que serão utilizadas pelo docker-compose, caso deseje instalar e configurar o banco de dados próprio, não é necessário utilizar as variáveis de ambiente nestas linhas.

- Na linha 12 é definida a variável para a URL do banco de dados, que será utilizada pelo Prisma, essa variável deve ser alterada com as informações de nome, senha, porta e nome do banco, para que o prisma seja capaz de localizar o banco de dados da aplicação.

- As demais variáveis são explicadas pelo próprio arquivo <code>.env.example</code>

Além das configurações de variáveis de ambiente, existem configurações do assunto dos e-mails enviados, que se encontra em <code>./src/config/emailSubject.ts </code>. Essas informações podem ser alteradas ao gosto do usuário, uma vez que são apenas strings que serão colocadas como assunto nos e-mails enviados.

Antes da aplicação ser iniciada, o banco de dados deve estar rodando.
Consulte <a href="https://www.docker.com/get-started">Docker</a> e <a href="https://docs.docker.com/compose/install/">docker-compose</a> para informações sobre como instalar as ferramentas.
Para subir o banco de dados configurado na aplicação, com docker, execute: 

```bash
docker-compose up -d
```

Com o banco de dados rodando, as dependências devem ser instaladas: 

```bash
yarn install
```

ou

```bash
npm install
```

Para executar as migrações e criar as tabelas e colunas no banco de dados utilizando o prisma, execute:

```bash
yarn prisma migrate dev
```

ou 

```bash
npx prisma migrate dev
```

O Prisma Studio, ferramenta visual para visualização do banco de dados pode ser acessado com:

```bash
yarn prisma studio
```

ou

```bash
npx prisma studio
```

Antes de subir a aplicação é recomendado rodar os testes unitários para verificar se todos os useCases estão funcionando:

```bash
yarn test
```

ou

```bash
npm run test
```

Finalmente, para subir a API:

```bash
yarn dev
```

ou

```bash
npm run dev
```

Caso a porta de execução da aplicação tenha sido mantida padrão (3030), a documentação das rotas da API pode ser acessada em:

<a href="http://localhost:3030/api-docs">localhost:3030/api-docs</a>

<small>Caso a porta tenha sido alterada, basta acessar <code>localhost:PORT/api-docs</code></small>