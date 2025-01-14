const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors({
    origin: [
        // 'http://localhost:5173',
        'https://study-mate-2766f.web.app',
        'https://study-mate-2766f.firebaseapp.com'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xnvb7mx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// middleware
const logger = (req, res, next) => {
    console.log('log:info', req.method, req.url)
    next();
}

const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    console.log('token from middleware', token)
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' })
        }
        req.user = decoded;
        next()
    })
}

const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
}

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const database = client.db("assignmentDB");
        const assignmentCollection = database.collection("assignment");
        const submittedCollection = database.collection("submitted");

        // auth related api

        app.post('/jwt', logger, async (req, res) => {
            const user = req.body;
            console.log('user for token', user?.email);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.cookie('token', token, cookieOption)
                .send({ success: true })
        })

        app.post('/logout', async (req, res) => {
            const user = req.body;
            console.log('log out user', user)
            res.clearCookie('token', { ...cookieOption, maxAge: 0 }).send({ success: true })
        })


        // assignment related

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
                    title: updatedAssignment.title,
                    description: updatedAssignment.description,
                    mark: updatedAssignment.mark,
                    image: updatedAssignment.image,
                    level: updatedAssignment.level,
                    date: updatedAssignment.date,
                    email: updatedAssignment.email,
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

        app.get('/submitted', async (req, res) => {
            const cursor = submittedCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // app.get('/submitted/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const cursor = submittedCollection.find(query);
        //     const result = await cursor.toArray();
        //     res.send(result)
        // })

        app.get('/submitted/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await submittedCollection.findOne(query)
            console.log(result)
            res.send(result)
        })


        app.post('/submitted', async (req, res) => {
            const submittedAssignment = req.body;
            const result = await submittedCollection.insertOne(submittedAssignment)
            res.send(result)
        })

        app.patch('/submitted/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateAssignment = req.body;
            const updateDoc = {
                $set: {
                    status: updateAssignment.status,
                    obtainMark: updateAssignment.obtainMark,
                    feedback: updateAssignment.feedback,
                    examinerName: updateAssignment.examinerName,
                },
            };
            const result = await submittedCollection.updateOne(filter, updateDoc)
            res.send(result)

        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
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