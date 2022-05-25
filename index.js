const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port=process.env.PORT || 5000
const app=express()
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{res.send('Running')})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j7629.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run=async()=>{
  try {
	await client.connect();
	const productsCollection=client.db('Silver_Hammer').collection('products');
	app.get('/products',async(req, res)=>{
		const result =await productsCollection.find().toArray();
		res.send(result);
	})
	app.get('/products/:id',async(req, res)=>{
		const id=req.params.id;
		const query ={_id:ObjectId(id)}
		const result = await productsCollection.findOne(query);
		res.send(result);
	})
	
	
  } finally {
	  
  }

}
run()


app.listen(port,()=>{console.log('listen port',port)})