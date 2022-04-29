const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { json } = require('express/lib/response');
const query = require('express/lib/middleware/query');
const port=process.env.PORT || 5000;
require('dotenv').config()
const app=express();


// MiddleWare add 
app.use(cors());
app.use(express.json());

//  database: database1
//  password: UJbxKSw56MwrOhWj


app.get('/',(req,res)=>{
    res.send("Genius car service crud");
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ym0tb.mongodb.net/carServices?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db("carServices").collection("service");
          // post single service with insertOne method 
        app.post('/service', async (req, res) => {
            const newService = req.body ;
            console.log("service",newService);
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        //    get all service with  find method 
        app.get('/service',async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })
        // get single service with findOne method 
        app.get('/service/:id ', async(req,res)=>{
            const id=req.params.id;
            const query={ _id: ObjectId(id)};
            const service= await serviceCollection.findOne(query);
            res.send(service);
        })

        // Delete single service with deleteOne method 
        app.delete('/service/:id',async(req,res)=>{
            const id=req.params.id;
           const  query ={ _id: ObjectId(id)};
            const service= await serviceCollection.deleteOne(query);
        })

      

      

    }
    finally{

    }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log('Listening on port ', port);
})