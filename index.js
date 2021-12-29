const { Keystone } = require("@keystonejs/keystone");
const { Text, Integer } = require("@keystonejs/fields");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { StaticApp } = require("@keystonejs/app-static");

const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");
const PROJECT_NAME = "Movie Rating";

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter({
    mongoUri:
      process.env.MONGOURI ||
      "mongodb+srv://ronin:harshn355@cluster0.ej1tv.mongodb.net/keymovie?retryWrites=true&w=majority", //"mongodb://localhost/keystone",
  }),
  port: process.env.PORT || 3000,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30,
    sameSite: false,
  },
  cookieSecret: process.env.COOKIE_SECRET || "v3rg1l",
});

// Define schema for movie ratings
keystone.createList("Movie", {
  fields: {
    title: {
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    rating: {
      type: Integer,
      isRequired: true,
      defaultValue: 10,
    },
  },
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({ path: "/", src: "public" }),
    new AdminUIApp({ enableDefaultRoute: true }),
  ],
  configureExpress: (app) => {
    app.set("trust proxy", true);
  },
};
