const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let URI = null;

if(process.env.NODE_ENV != "production")
  URI = "mongodb://oladimeji:1234ab1234@127.0.0.1:27017/simply-upload";
else
  URI = "mongodb://oladimillion:jesus123@ds229290.mlab.com:29290/simply-upload";

//connecting to database
mongoose.connect(URI, {
});

  // useMongoClient: true,
// initialising mongoose connection
const db = mongoose.connection;

// when connection is established
db.on("connected", () => {
  console.log('Connected to DB');
})

// when connection encounters error
db.on("error", (err) => {
  console.log('Not connected to db: ', err);
})

// when connection is lost
db.on("disconnected", () => {
  console.log("connection to db lost");
})

// if the Node process ends, close mongoose connection
process.on("SIGINT", () => {
  db.close(() => {
    console.log("Mongoose default connection closed through app termination");
    process.exit(0);
  })
})
