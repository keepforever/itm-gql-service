#### Remeber when deploying to ziet now, need to flag .env

```sh
now --public --dotenv=.env
```
#### To remove old deployment; limited free tier cleanup
```sh
now rm itm-adv-server --safe --yes
```
#### Process for adding a new type
Update the following files:

1. **src/schema.graphql**: update type Query and type Mutation with whatever is appropriate for the added type.  For example, offers need to be both created by users and retrieved, thus they need:
```
type Query {
  offer(id: ID!): Offer
}

type Mutation {
  createOffer(title: String!, text: String!): Offer!
  deleteOffer(id: ID!): Offer!
}
```
2. **src/resolvers/Mutation**: Need to add a mutations file with the needed functionality (i.e. post, update, delete).  See "offer.js".

3. **src/resolvers/index**: Need to collect all mutations for export as follows:

```
const { Query } = require('./Query')
const { Subscription } = require('./Subscription')
const { auth } = require('./Mutation/auth')
const { post } = require('./Mutation/post')
const { offer } = require('./Mutation/offer')
const { AuthPayload } = require('./AuthPayload')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...offer,
  },
  Subscription,
  AuthPayload,
}
```
4. **src/resolvers/Query.js**: Add to Query object:
```
offer(parent, { id }, ctx, info) {
  return ctx.db.query.post({ where: { id }, info })
}
```

5. **src/database/datamodel.graphql**: Must add offer type here to tell Prisma to make room for it in the database and create the relations

```
type Offer {
  id: ID! @unique
  createdAt: DateTime!
  updatedAt: DateTime!
  title: String!
  text: String!
  author: User!
}
```

6. Finally when this is all done, from the root, run:
```sh
prisma deploy
```
This should update the backend with new defs and relations
src/generated/prisma.graphql should auto-update as a result.

## "Borrowing" Queries from prisma.graphql
1. in src/generated/prisma.graphql, find Query you want (should have been autogenerated here the last time you ran **prisma deploy**)
2. Copy/paste query into src/schema.graphql. Be sure to import the necessary accompanying types on the query arguments. 
3. in src/resolvers/Query.js:
```
  const { forwardTo } = require('prisma-binding')
  
  const Query = {
  offers: forwardTo("db"),
  
  feed(parent, args, ctx, info) {
    return ctx.db.query.posts({ where: { isPublished: true } }, info)
  },
  ...
  ...
  }


```


# EVERYTHING BELOW THIS LINE IS FROM THE README THAT CAME WITH THE BOILERPLATE CODE

<h1 align="center"><strong>Boilerplate for an Advanced GraphQL Server</strong></h1>

<br />

![](https://imgur.com/lIi4YrZ.png)

<div align="center"><strong>🚀 Bootstrap your GraphQL server within seconds</strong></div>
<div align="center">Advanced starter kit for a flexible GraphQL server for Node.js - based on best practices from the GraphQL community.</div>

## Features

- **Scalable GraphQL server:** The server uses [`graphql-yoga`](https://github.com/prisma/graphql-yoga) which is based on Apollo Server & Express
- **GraphQL database:** Includes GraphQL database binding to [Prisma](https://www.prismagraphql.com) (running on MySQL)
- **Authentication**: Signup and login workflows are ready to use for your users
- **Tooling**: Out-of-the-box support for [GraphQL Playground](https://github.com/prisma/graphql-playground) & [query performance tracing](https://github.com/apollographql/apollo-tracing)
- **Extensible**: Simple and flexible [data model](./database/datamodel.graphql) – easy to adjust and extend
- **No configuration overhead**: Preconfigured [`graphql-config`](https://github.com/prisma/graphql-config) setup
- **Realtime updates**: Support for GraphQL subscriptions

For a fully-fledged **GraphQL & Node.js tutorial**, visit [How to GraphQL](https://www.howtographql.com/graphql-js/0-introduction/). You can more learn about the idea behind GraphQL boilerplates [here](https://blog.graph.cool/graphql-boilerplates-graphql-create-how-to-setup-a-graphql-project-6428be2f3a5).

## Requirements

You need to have the [GraphQL CLI](https://github.com/graphql-cli/graphql-cli) installed to bootstrap your GraphQL server using `graphql create`:

```sh
npm install -g graphql-cli
```

## Getting started

```sh
# 1. Bootstrap GraphQL server in directory `my-app`, based on `node-advanced` boilerplate
graphql create my-app --boilerplate node-advanced

# 2. When prompted, deploy the Prisma service to a _public cluster_

# 3. Navigate to the new project
cd my-app

# 4. Start server (runs on http://localhost:4000) and open GraphQL Playground
yarn dev
```

![](https://imgur.com/hElq68i.png)

## Documentation

### Commands

* `yarn start` starts GraphQL server on `http://localhost:4000`
* `yarn dev` starts GraphQL server on `http://localhost:4000` _and_ opens GraphQL Playground
* `yarn playground` opens the GraphQL Playground for the `projects` from [`.graphqlconfig.yml`](./.graphqlconfig.yml)
* `yarn prisma <subcommand>` gives access to local version of Prisma CLI (e.g. `yarn prisma deploy`)

> **Note**: We recommend that you're using `yarn dev` during development as it will give you access to the GraphQL API or your server (defined by the [application schema](./src/schema.graphql)) as well as to the Prisma API directly (defined by the [Prisma database schema](./generated/prisma.graphql)). If you're starting the server with `yarn start`, you'll only be able to access the API of the application schema.

### Project structure

![](https://imgur.com/95faUsa.png)

| File name 　　　　　　　　　　　　　　| Description 　　　　　　　　<br><br>|
| :--  | :--         |
| `├── .env` | Defines environment variables |
| `├── .graphqlconfig.yml` | Configuration file based on [`graphql-config`](https://github.com/prisma/graphql-config) (e.g. used by GraphQL Playground).|
| `└── database ` (_directory_) | _Contains all files that are related to the Prisma database service_ |\
| `　　├── prisma.yml` | The root configuration file for your Prisma database service ([docs](https://www.prismagraphql.com/docs/reference/prisma.yml/overview-and-example-foatho8aip)) |
| `　　└── datamodel.graphql` | Defines your data model (written in [GraphQL SDL](https://blog.graph.cool/graphql-sdl-schema-definition-language-6755bcb9ce51)) |
| `└── src ` (_directory_) | _Contains the source files for your GraphQL server_ |
| `　　├── index.js` | The entry point for your GraphQL server |
| `　　├── schema.graphql` | The **application schema** defining the API exposed to client applications  |
| `　　├── resolvers` (_directory_) | _Contains the implementation of the resolvers for the application schema_ |
| `　　└── generated` (_directory_) | _Contains generated files_ |
| `　　　　└── prisma.grapghql` | The **Prisma database schema** defining the Prisma GraphQL API  |

## Contributing

The GraphQL boilerplates are maintained by the GraphQL community, with official support from the [Apollo](https://dev-blog.apollodata.com) & [Graphcool](https://blog.graph.cool/) teams.

Your feedback is **very helpful**, please share your opinion and thoughts! If you have any questions or want to contribute yourself, join the [`#graphql-boilerplate`](https://graphcool.slack.com/messages/graphql-boilerplate) channel on our [Slack](https://graphcool.slack.com/).
