const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({origin: ['https://ecom-emo-server.vercel.app'],
    }));
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority`;
// My uri is
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x1smjlm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const productCollection = client.db('emaJohnDB').collection('products');

    app.get('/products', async (req, res) => {
      
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size);
      
      const result = await productCollection.find().skip(page*size).limit(size).toArray();
      res.send(result);
    })
    app.get('/productsCount', async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count })
    })
    app.post('/productsByIds', async(req, res)=>{
      const ids= req.body
      const idsWithObjectId = ids.map(id => new ObjectId(id))
      const query ={
        _id: {
          $in: idsWithObjectId
        }
      }
      const result = await productCollection.find(query).toArray();

      res.send(result)
      
    })
    app.post('/cart', async(req, res)=>{
      res.send('john is cart on building')
      
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
  res.send('john is busy shopping')
})

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
})
