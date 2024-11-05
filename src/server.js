const express = require("express");
var { graphqlHTTP } = require("express-graphql");
const { rootSchema } = require("./schemas/rootSchema");
// var { createHandler } = require("graphql-http/lib/use/express")

const app = express();

app.use("/graphQL", graphqlHTTP({ schema: rootSchema, graphiql: true}));

const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
