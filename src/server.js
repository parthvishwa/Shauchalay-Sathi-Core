require('dotenv').config()
const express = require("express");
var { graphqlHTTP } = require("express-graphql");
const { rootSchema } = require("./schemas/rootSchema");
// var { createHandler } = require("graphql-http/lib/use/express")
const mongoose = require("mongoose");

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.iffee.mongodb.net/${process.env.DB_APPDATA}?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=> console.log('connection succeeded'))
.catch(err => {
  console.log('connection failed')
  throw err
})

app.use("/graphQL", graphqlHTTP({ schema: rootSchema, graphiql: true}));

const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
