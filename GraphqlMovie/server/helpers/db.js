const mongoose = require("mongoose");

let url =
  "mongodb+srv://admin:12345@cluster0.unoua.mongodb.net/graphql_movie?retryWrites=true&w=majority";

const connectDb = async () => {
  await mongoose
    .connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDb connection Successfull"))
    .catch((err) => console.error(err));
};

module.exports = connectDb;
