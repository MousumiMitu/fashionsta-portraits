const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1el86.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  const bookingCollection = client
    .db("eventPhotographer")
    .collection("bookings");
  const adminCollection = client.db("eventPhotographer").collection("admin");
  const reviewCollection = client.db("eventPhotographer").collection("reviews");

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

  app.delete("/delete/:id", (req, res) => {
    serviceCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
      });
  });

  app.get("/service/:id", (req, res) => {
    serviceCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/addBooking", (req, res) => {
    const newService = req.body;
    bookingCollection.insertOne(newService).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/bookingAppointments", (req, res) => {
    const email = req.body.email;

    adminCollection.find({ email }).toArray((err, admins) => {
      if (admins.length === 0) {
        bookingCollection.find({ email: email }).toArray((err, documents) => {
          res.send(documents);
        });
      } else {
        bookingCollection.find({}).toArray((err, documents) => {
          res.send(documents);
        });
      }
    });
  });

  app.post("/addAdmin", (req, res) => {
    const newAdmin = req.body;
    console.log(newAdmin);
    adminCollection.insertOne(newAdmin).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/checkAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });

  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    console.log(newReview);
    reviewCollection.insertOne(newReview).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  console.log("db connected successfully");
});

app.listen(process.env.PORT || port);
