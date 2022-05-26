const express=require('express');
const cors=require('cors');
const jwt = require('jsonwebtoken');
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
	const usersCollection=client.db('Silver_Hammer').collection('users');
	const ordersCollection=client.db('Silver_Hammer').collection('orders');
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
	app.put('/users/:email',async(req, res)=>{
		const email=req.params.email;
		const filter = { email: email };
		const options = { upsert: true };
		const result=await usersCollection.updateOne(filter,options);
		const token = jwt.sign({email:email},process.env.SECRET_TOKEN);
		res.send({result,token});
	})

	app.post('/orders',async(req, res)=>{
		const order=req.body
		if(!order){
			res.send({success:false, message:'Order failed,Please try again'})
		}
		else{
			const result=await ordersCollection.insertOne(order)
          res.send({success:true,message:'Order added Successfully'})
		}
	})

	app.get('/orders/:email',async(req, res)=>{
		const email=req.params.email;
		const filter={email:email};
		const result=await ordersCollection.find(filter).toArray();
		if(result.length){
			res.send(result)
		}
		else{
			res.send({success:false,message:"You don't have order'"})
		}

	})
	
	
  } finally {
	  
  }

}
run()


app.listen(port,()=>{console.log('listen port',port)})