const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())





// 
// tzuk7hwU4I3qU10X



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpqoiya.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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

        const teaHouse = client.db('teaHouseDB').collection('tea')

        app.get('/tea', async (req, res) => {
            const user = req.body;
            const cursor = await teaHouse.find().toArray(user)
            res.send(cursor)
        })

        app.get('/tea/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await teaHouse.findOne(query)
            res.send(result)
        })

        app.post('/tea', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await teaHouse.insertOne(user)
            res.send(result)
        })

        app.put('/tea/:id', async (req, res) => {
            const user = req.body;
            const id = req.params.id;
            console.log('hitting', user, id);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            const result = await teaHouse.updateOne(filter, updateUser, options)
            res.send(result)
        })

        app.delete('/tea/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await teaHouse.deleteOne(query)
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
    res.send('express server is running')
})

app.listen(port, () => {
    console.log(`server site is running on the port : ${port}`);
})