const express = require('express')
const app = express();
// const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const cors = require('cors')
const dotenv = require("dotenv");
dotenv.config()
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path')

const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: 'sessions'
});

// Catch errors
store.on('error', function (error) {
  console.log(error);
});



app.use(
  cors({
    origin:['http://localhost:3000']
  })
)
// Configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 5 // Session duration in milliseconds (5 hrs)
  }
}));
app.use((req, res, next) => {
  console.log('------')
  console.log("session", req.session)
  if (req.session.user) {
    console.log('User is logged in');
  } else {
    console.log('User is logged out');

  }
  next();
});

app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Route imports
const service = require("./routes/serviceRouter")
const invoice = require("./routes/invoiceRouter");
const client = require("./routes/clientRouter");
const order = require("./routes/orderRouter");
const quote = require("./routes/quoteRouter");
const user = require("./routes/userRouter");
const auth = require("./routes/authRoutes");
const ticket = require("./routes/ticketRoutes");
const task = require("./routes/taskRouter");
const combined = require("./routes/combinedRoute");
const sessionRoute = require("./routes/sessionRouter")
const notificationRoute = require("./routes/notificationRouter")



app.use("/test/v1", task)
app.use("/test/v1", auth)
app.use("/test/v1", user);
app.use("/test/v1", order);
app.use("/test/v1", quote);
app.use("/test/v1", client);
app.use("/test/v1", service);
app.use("/test/v1", invoice);
app.use("/test/v1", ticket)
app.use("/test/v1", combined)
app.use("/test/v1", sessionRoute)
app.use("/test/v1", notificationRoute)


const connectDatabase = require("./config/database")


const PORT = process.env.PORT || 4001

connectDatabase()
// app.use(express.static(path.resolve(__dirname, "frontend", "agency-kinetics", "build")))

// app.get("/", (req, res) => {
//   console.log("ins")
//   res.sendFile(path.resolve(__dirname, "frontend", "agency-kinetics", "build", "index.html"))
// })


app.listen(PORT, () => {
    console.log(`Server is working on http://127.0.0.1:${PORT}`)

})

module.exports = app