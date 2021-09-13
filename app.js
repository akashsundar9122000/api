const express = require('express');

const app=express();
const userRoutes = require('./user');
const mongoose = require('mongoose');
const Notes = require('./models/notes');
const bodyParser = require('body-parser');
const checkAuth=require('./middleware/check-auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


mongoose.connect('mongodb+srv://akash:meannotesapp@cluster0.bbcxl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(()=>{
    console.log("Connected to database");
}).catch(err=>{
    console.log(err);
})

app.use((req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, OPTIONS, DELETE, PUT");
    next();
  })

app.post('/notes',checkAuth,(req,res)=>{
    const newNotes = new Notes({
        title:req.body.title,
        content:req.body.content,
        creator:req.userData.userId
    })
    newNotes.save().then((notes)=>{
        res.send(notes);
    }).catch(err=>{
        console.log(err);
    })
})

app.get('/notes',(req,res)=>{
    Notes.find().then((notes)=>{
        res.send(notes);
    }).catch(err=>{
        console.log(err);
    })
})

app.put('/notes/:id',checkAuth,(req,res)=>{
    const newNotes = new Notes({
        _id:req.body._id,
        title:req.body.title,
        content:req.body.content,
        creator:req.userData.userId
    })
    Notes.updateOne({_id:req.params.id},newNotes).then(result=>{
        res.send(result);
    })
})

app.delete('/notes/:id',(req,res)=>{
    Notes.deleteOne({_id:req.params.id}).then((result)=>{
        res.send(result);
    })
})

app.use('/user',userRoutes);

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log('Listening on 3000')
})