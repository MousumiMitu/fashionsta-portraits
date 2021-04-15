const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1el86.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(express.json());
app.use(cors());

const port = 5000;

app.get("/", (req, res) => {
  res.send("hello its mitz");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client
    .db("eventPhotographer")
    .collection("services");

  app.post("/addService", (req, res) => {
    const newService = req.body;
    console.log(newService);
    serviceCollection.insertOne(newService).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/service/:id", (req, res) => {
    serviceCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  console.log("db connected successfully");
});

app.listen(process.env.PORT || port);
