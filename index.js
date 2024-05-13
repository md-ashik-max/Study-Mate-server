const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xnvb7mx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const database = client.db("assignmentDB");
        const assignmentCollection = database.collection("assignment");
        const submittedCollection = database.collection("submitted");


        app.get('/assignment', async (req, res) => {
            const cursor = assignmentCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.findOne(query)
            res.send(result)
        })


        app.post('/assignment', async (req, res) => {
            const newAssignment = req.body;
            const result = await assignmentCollection.insertOne(newAssignment)
            res.send(result)
        })

        app.put('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedAssignment = req.body;
            const spot = {
                $set: {
                    title:updatedAssignment.title,
                    description:updatedAssignment.description,
                    mark:updatedAssignment.mark,
                    image:updatedAssignment.image,
                    level:updatedAssignment.level,
                    date:updatedAssignment.date,
                    email:updatedAssignment.email,
                },
            };
            const result = await assignmentCollection.updateOne(filter, spot, options)
            res.send(result)

        })

        app.delete('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.deleteOne(query)
            res.send(result)

        })

        // submitted assignment related

        app.post('/submitted', async (req, res) => {
            const submittedAssignment = req.body;
            console.log(submittedAssignment)
            const result = await submittedCollection.insertOne(submittedAssignment)
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
    res.send('study mate is running')
})
app.listen(port, () => {
    console.log(`study mate is running port on :${port}`)
})