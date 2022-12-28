const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require("mongoose");
const UserModel = require('./models/user.js');
const ExerciseModel = require('./models/exercise.js');
const bodyParser = require("body-parser");
// const userRouter = require("./routes/router.js"); //router


//Middleware
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use("/api/users", userRouter);



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", async (req, res) => {

  // const user = {
  //   username: req.body.username
  // };

  // try {
  //   const newUser = await UserModel.create(user);
  // } catch (err) {
  //   res.status(500).json({ msg: "User cannot be created." });
  // };

  const user = new UserModel({
    username: req.body.username
  });

  user.save((err, doc) => {
    if (err || !doc) {
      console.error(err);
      return res.status(500).send("Database Error");
    }
    // console.log(doc);
    return res.status(201).json(doc);
  });
});

app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await UserModel.find({});
    return res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Database error" });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;

  const exercise = {
    userId: req.params._id,
    description,
    duration: Number(duration),
    date: new Date(date)
  };

  if (exercise.date.toString() === "Invalid Date") {
    exercise.date = new Date().toDateString();
  } else {
    exercise.date = new Date(date).toDateString();
  };

  try {
    const currentUser = await UserModel.findById(req.params._id);
    if (!currentUser) {
      res.status(404).json({ msg: "User not found." });
    };

    const newExercise = await ExerciseModel.create(exercise);

    return res.status(200).send({
      username: currentUser.username,
      description,
      duration: Number(duration),
      date: exercise.date,
      _id: currentUser._id,
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error." });
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const id = req.params._id;
  const { from, to, limit } = req.query;
  const logfilter = { userId: id };

  if (from) {
    logfilter["$gte"] = new Date(from);
  };

  if (to) {
    logfilter["$lte"] = new Date(to);
  };

  // console.log(from, to, limit);

  const currentUser = await UserModel.findById(id);
  if (!currentUser) {
    return res.status(404).json({ msg: "User not found." });
  };

  const foundUserExercises =
    await ExerciseModel.find(logfilter)
      .limit(limit ? limit : 500);

  if (foundUserExercises.length === 0) { //optional
    return res.status(404).json({ msg: "Exercises not found" });
  };

  return res.status(200).send({
    username: currentUser.username,
    count: foundUserExercises.length,
    _id: currentUser._id,
    log: foundUserExercises.map(ex => {
      return {
        description: ex.description,
        duration: ex.duration,
        date: ex.date.toDateString()
      }
    })
  })
});


//starting up app and connecting to db 
const start = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log('Your app is listening on port ' + listener.address().port);
    });
  } catch (error) {
    console.error(error);
  }
}

start();