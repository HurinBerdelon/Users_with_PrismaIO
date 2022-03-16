# Users with Prisma IO

<table>
    <tr>
      <td>
        <a href="README.md" disabled>🇺🇸 English</a>
      </td>
    </tr>
    <tr>
      <td>
        <a href="readme_pt-br.md">🇧🇷 Portuguese</a>
      </td>
    </tr>
  </table>

Many web applications need an user's registration, so informations can be associated with the user account. From that, the goal of this project is to provide an example (and serve as a template) of how to manage user's information in a rest API using <a href="https://www.prisma.io/">Prisma.IO</a> as ORM.
Concepts of authentication with JWT (accessToken) and refreshToken are used, to keep user authenticated in the app.
The project is developed using concepts of <a href="https://en.wikipedia.org/wiki/SOLID/">SOLID</a> architecture, using typescript.

### ORM

ORM (Object Relational Mapper) is a strategy of mapping for relational objects, that is, a layer of abstraction between the objects in the application and the tables in the database. ORMs has as the main goal to simplify the interaction between application and database, once with programming language information of database can be obtained, not needing to use queries.

## Prisma IO

Prisma is an open source ORM that stands out for its simplicity of abstractions in interactions with database. As many others ORMs, prisma uses the concept of migrations, so, from schema.prisma to create/update/delete tables in database.

To complete its simplicity, prisma has its own studio, called prisma studio, where it is possible to visualize, update and delete information on the database. So, using prisma it is not needed to install other platforms, as <a href="https://dbeaver.io/download/">Dbeaver</a> or <a href="https://www.beekeeperstudio.io/">Beekeeper</a>, for example.

For more information, refer to the oficial page, <a href="https://www.prisma.io/">Prisma.IO</a>.

## Project's features

This project is a Rest API that can be used as an example (or as a template) on creation and manage of users in a real web application.
The following features are covered by the project:

    - User creation;
    - Sending e-mail of confirmation user's registration;
    - Confirmation of user's e-mail;
    - Authentication of the user in the application:
      - Authentication using accessToken (JWT*);
      - RefreshToken Strategy, to keep user connected;
    - User's logout;
    - Password Reset (Forgot my password);
    - Updates of user's information:
      - Avatar Update;
      - E-mail Update, with sending confirmation to new e-mail;
      - Name Update;
      - Username Update;
      - Password Update;

\* Do not know about JWT? Refer to <a href="https://jwt.io/introduction">JWT</a> for more information.<br>
\** Do not know about refresh token? Refer to <a href="https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/">Refresh Token</a> for more information.

### E-mail Sending

This project sends e-mail with <a href="https://nodemailer.com/about/">Nodemailer</a> library. Nodemailer provides a test server for e-mail sendings, the <a href="https://nodemailer.com/smtp/testing/">Ethereal</a>, that can be used to test all the features of the application and helps while developing. As some endpoints of the API needs some tokens sent by e-mail, it's needed to have a e-mail test server to catch this tokens.

E-mail sendings are managed by a class written as a provider in the application, at <code>./src/shared/container/provider/mailProvider </code>.
The implementation already made covers only the e-mail test server of nodemailer, with its type <code>IMailProvider.ts</code>, with the sending class at <code>/implementations</code> and the class for unitary tests at <code>/inMemory </code>.

To implement this API together with all business rules of an application in productions, it is needed to implement a real e-mail provider. Nodemailer docs provides example for many different e-mail providers.
It is recommended to create a new class inside the folder <code>./src/shared/container/provider/mailProvider </code> following the type defined by <code>IMailProvider.ts </code>. This way, only an alteration in <code>./src/shared/container/provider/index.ts </code> and in environmental variables is needed to the new provider works.

## Running the API

To run and test the API, clone this repository in local machine:

```bash
git clone git@github.com:HurinBerdelon/Users_with_PrismaIO-TS.git
```

Go to the created folder,

```bash
cd Users_with_PrismaIO-TS
```

There will be a file named <code>.env.example</code>, it should be copied to a <code>.env</code> file and updated with the environmental variables to be used.

- Line 19 defines MAIL variable, that indicates which e-mail provider is going to be used. By default it is defined as "ethereal".
This variable makes reference to the object mailProvider in line 14 of file <code>./src/shared/container/providers/index.ts </code> and in case a new provider is implemented, it's name should be passed to MAIL in <code>.env</code> file and passed to mailProvider object.

- Lines 23, 27, 31 and 35 defines the URLs that will be sent by e-mail. For the test of the API using <a href="https://www.postman.com/">Postman</a> or <a href="https://insomnia.rest/">Insomnia</a>, for example, the URLs can redirect user to backend routes. When a front-end is developed to consume this API, the URLs should point to front-end, because it is in front-end that the information showed in the screen will be managed.

- This project uses docker to create the database image, so it is not needed that a database is installed and configured locally. Lines 5, 6, 7 and 8 defines the variables of database, that will be used by docker-compose to instanceat the database in a docker container. In case user wants to install and configure the database locally, this lines do not need to be altered.

- Line 12 defines the database URL, that will be used by Prisma do connect with the database. The information about name, password, port and database_name should be passed to this URL.

- The other variables are well explained in the file <code>.env.example</code>.

Besides the env variables, there are some optional configuration in the e-mail subjects, at <code>./src/config/emailSubject.ts </code>. This informations are strings that will be written in the e-mail subject when sending an e-mail and can be configured in this file as the user's preference.

Before upload the app, the database should be running.
Refer to <a href="https://www.docker.com/get-started">Docker</a> and <a href="https://docs.docker.com/compose/install/">docker-compose</a> if needing information about how to install docker and docker-compose.
To upload the database provides with the application, in a docker container, run:

```bash
docker-compose up -d
```

With the database running, the dependencies should be installed:

```bash
yarn install
```

or

```bash
npm install
```

To run the migrations and create the tables and columns in database, run:

```bash
yarn prisma migrate dev
```

or 

```bash
npx prisma migrate dev
```

Prisma studio, visual tool from Prisma, can be accessed to visualize the database by running:

```bash
yarn prisma studio
```

or

```bash
npx prisma studio
```

Before upload the app is recommended to run the unitary tests to check if all the useCases are working:

```bash
yarn test
```

or

```bash
npm run test
```

Finally, to upload the app, run:

```bash
yarn dev
```

or

```bash
npm run dev
```

In case the execution port has been kept the default (3030), the API routes docs can be accessed at:
<a href="http://localhost:3030/api-docs">localhost:3030/api-docs</a>

<small>In Case the port has been changed, just access <code>localhost:PORT/api-docs</code></small>

## Author

<h3>Fernando Henrique Pereira Cardozo (HurinBerdelon)</h3>

<a href="https://www.linkedin.com/in/fernando-henrique-p-cardozo-17ab84a3/" target='_blank'>
    <img 
      src="https://img.shields.io/badge/Linkedin-0077B5?style=for-the-badge&amp;logo=LinkedIn&amp;logoColor=white" 
      alt="linkedin">
</a>

<a href="mailto:fernando_cardozo@poli.ufrj.br" target='_blank'>
    <img 
      src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&amp;logo=Gmail&amp;logoColor=white" alt="gmail">
</a>
