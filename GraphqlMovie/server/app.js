const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const GraphQLSchema = require("graphql").GraphQLSchema;
const schema = require("./schema/schema");
const connectDb = require("./helpers/db.js");
const cors = require("cors");

const app = express();

/*cors*/
app.use(cors());

/*db*/
connectDb();

/*middleware == graphqlHTTP*/
app.use(
  "/graphql",
  graphqlHTTP({
    shcema: new GraphQLSchema({}),
    schema: schema,
    graphiql: true, // show interface
  })
);

app.listen(1000, () => console.log("Now browser to localhost:5000/graphql"));
