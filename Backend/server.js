const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/Test1')
.then(()=>{
  console.log("db connected");
  
})
.catch(()=>{
  console.log("Error");
})
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('Hello')
})

app.post('/api/signup', async (req, res)=>{
  const {username, email, password} = req.body;
  const user = await User.create({
      username,
      email,
      password
  });
  res.json(user)
})

app.post('/api/login', async (req,res)=>{
  const {email, password} = req.body;
  const user = await User.find({email:email});
  if(user == undefined || user == null){
      res.send({error:"User not found!"})
  }
  if(user[0].password === password){
      res.json(user[0]);
  }else{
      console.log(user[0].password);
      console.log(password)
      res.send({error:"User not found!"})
  }
})

app.listen(8080)

