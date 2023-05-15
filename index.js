const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())






const uri = "mongodb+srv://onuragi:gWBeiXnnIZztOpbx@cluster0.xd4auwc.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollection = client.db('products').collection('product')
    // 2nd
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })
    // 1st
    app.post('/products', async (req, res) => {
      const newProduct = req.body
      console.log('new user', newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result)
    })
    // 3rd
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.deleteOne(query);
      res.send(result)

    })
    // 4th
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.send(result)
    })
    //5th
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true }
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name,
          details: updatedProduct.details,
          photo: updatedProduct.photo
        }
      }
      const result = await productsCollection.updateOne(filter, product, option)
      res.send(result)

    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('server running for Onuragi handicrft')
})


app.listen(port, () => {
  console.log(`server running at port ${port}`);
})