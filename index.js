const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.esrkv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodCollection = client.db("frozen").collection("foods");

  app.get('/foods', (req, res) => {
    foodCollection.find({})
    .toArray((err , items) => {
      res.send(items)
    })
  })

  app.get('/food/:id', (req, res) => {
    foodCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err , items) => {
      res.send(items[0])
    })
  })
    
  app.post('/addFood', (req, res) => {
    const newFood = req.body;
    console.log('adding new food', newFood);
    foodCollection.insertOne(newFood)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})