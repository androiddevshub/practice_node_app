const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./User');
const cors = require('cors');
const { ObjectId } = require('mongodb');
app.use(cors());

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/MyFirstMongoDb", {
  useNewUrlParser: "true",
});

mongoose.connection.on("error", err => {
  console.log("err", err)
});

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
});

// GET Route
app.get('/users', (req,res) => {
  User.find({}, function(err, data){
    if(err){
      return next(err);
    }
    res.json(data)
  })
});

// GET Route
app.get('/users/:id', (req,res) => {
  User.findOne({_id: new ObjectId(req.params.id)}, function(err, data){
    if (err) {
      return next(err);
    }
    res.json(data);
  })
});

// POST Route
app.post('/users', (req,res) => {
  let user = new User(
    {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password
    }
  );

  user.save(function (err) {
    if (err) {
        return next(err);
    }
    res.json({status: true, message: "User created successfully"});
  });
});

// PUT Route
app.put(`/users/:id`, (req,res) => {
  User.updateOne({_id: new ObjectId(req.params.id)}, {
    username: req.body.username,
    phone: req.body.phone
  }, function(err, data){
    if (err) {
      return next(err);
    }
    res.json(data);
  })
});

// DELETE Route
app.delete(`/users/:id`, (req,res) => {
  User.deleteOne({_id: new ObjectId(req.params.id)}, function(err, data){
    if (err) {
      return next(err);
    }
    res.json(data);
  })
});

app.listen(process.env.port || 3000);
console.log('Web Server is listening at port '+ (process.env.port || 3000));

// let arr = [
//   {
//     id: 1,
//     name: "Joe"
//   },
//   {
//     id: 2,
//     name: "Emily"
//   },
//   {
//     id: 3,
//     name: "Harry"
//   },
//   {
//     id: 4,
//     name: "Philip"
//   }
// ];


