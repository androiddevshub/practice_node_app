const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./User');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
app.use(cors());
const saltRounds = 10;

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

//    /api/users - post
//    /api/users - post
//    /api/users/1 - get
//    /api/users/1 - put
//    /api/users/1 - delete

// GET Route
app.get('/users', (req,res) => {
  User.find({}, function(err, data){
    if(err){
      return next(err);
    }
    res.json(data)
  });
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

app.get('/enc_pass', async (req,res) => {
  const hashedPwd = await bcrypt.hash(req.query.password, saltRounds);
  res.json({"encpassword": hashedPwd})
});

// POST Route
app.post('/users', async (req,res) => {
  const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
  console.log("hashedPwd=====>", hashedPwd);
  let user = new User(
    {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPwd,
      role: req.body.role,
    }
  );

  user.save(function (err) {
    if (err) {
        return next(err);
    }
    res.json({status: true, message: "User created successfully"});
  });
});

app.post('/users/login', async (req, res)=> {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user.password);
    if (user) {
      const cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        //   ..... further code to maintain authentication like jwt or sessions
        res.json({message: "Auth Successful"});
      } else {
        res.json("Wrong username or password.");
      }
    } else {
      res.json("Wrong username or password.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server error Occured");
  }
})

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


