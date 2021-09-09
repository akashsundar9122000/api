const express = require('express');

const app=express();

const mongoose = require('mongoose');
const Notes = require('./models/notes');
const bodyParser = require('body-parser');

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

app.post('/notes',(req,res)=>{
    const newNotes = new Notes({
        title:req.body.title,
        content:req.body.content
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

app.delete('/notes/:id',(req,res)=>{
    Notes.deleteOne({_id:req.params.id}).then((result)=>{
        res.send(result);
    })
})

app.listen(3000,()=>{
    console.log('Listening on 3000')
})