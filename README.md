# movie-crud-back-end

MovieCrud is a full-stack web application that enables users to create, edit, share and discover in-depth movie reviews.

## Links

- [MovieCrud Front-End](https://mcrud.surge.sh/) - MovieCrud Front-End Application
- [MovieCrud Back-End](https://moviecrud.onrender.com/graphql) - MovieCrud Back-End Server and Database
- [MovieCrud Front-End Repository](https://github.com/jimbucktoo/moviecrud-front-end/) - MovieCrud Front-End Github Repository
- [MovieCrud Back-End Repository](https://github.com/jimbucktoo/moviecrud-back-end/) - MovieCrud Back-End Github Repository

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

- [Knex CLI](https://knexjs.org/) - Knex.js is a SQL query builder for PostgreSQL.
- [Node.js](https://www.nodejs.org/) - Node.js is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser.
- [NPM](https://www.npmjs.com/) - npm is a package manager for the JavaScript programming language. It is the default package manager for the JavaScript runtime environment Node.js.
- [PostgreSQL CLI](https://www.postgresql.org/) - PostgreSQL is a an open source object-relational database system.

### Installing

A step by step series of examples that tell you how to get a development env running

1. Install dependencies:

```
npm install
```

2. Create local database

```
psql

create database moviecrud
```

3. Migrate to the latest deployment:

```
knex migrate:latest
```

4. Run the seeds:

```
knex seed:run
```

5. Intialize the server

```
npm start
```

6. Visit the following URL and you should see the GraphQL IDE populate the page:

```
http://localhost:8080/graphql
```

## Technologies

- [Express](https://expressjs.com/) - Express is a web application framework for Node.js. It is designed for building web applications and APIs.
- [GraphQL](https://graphql.org/) - GraphQL is an open-source data query and manipulation language for APIs and a query runtime engine.
- [JSON Web Token](https://jwt.io/) - JSON Web Token is a proposed Internet standard for creating data with optional signature and/or optional encryption whose payload holds JSON that asserts some number of claims.
- [Knex](https://knexjs.org/) - Knex.js is a "batteries included" SQL query builder for Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle, and Amazon Redshift designed to be flexible, portable, and fun to use.
- [Node.js](https://nodejs.org/en/) - Node.js is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser.
- [Postgresql](https://postgresql.org/) - Postgresql is an object-relational database management system.

## Authors

- **James Liang** - _Initial work_ - [jimbucktoo](https://github.com/jimbucktoo/)
