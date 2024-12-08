// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
require('dotenv').config(); // For environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const Posts = require('./models/posts.js');
const Comments = require('./models/comments.js');
const Communities = require('./models/communities.js');
const LinkFlairs = require('./models/linkflairs.js');

const authRouter = require('./routes/auth.js');
const CommunitiesDataRouter = require('./routes/communitiesData.js');
const postsDataRouter = require('./routes/postsData.js');
const linkflairsDataRouter = require('./routes/linkflairsData.js');
const commentsDataRouter = require('./routes/commentsData.js');

//Mongoose default connection
const mongoDB = 'mongodb://127.0.0.1:27017/phreddit';
mongoose.connect(mongoDB)

//Get default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

// add router/middleware on receiving requests here
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the React app
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${fullUrl}`);
    next(); // Pass control to the next handler
  });
app.use('/auth', authRouter); // Authentication routes
app.use('/communitiesData', CommunitiesDataRouter);
app.use('/postsData', postsDataRouter);
app.use('/linkflairsData', linkflairsDataRouter);
app.use('/commentsData', commentsDataRouter);

// Handle incoming Get requests here
app.get("/", function (req, res) {
    res.send("Hello Phreddit!");
});


app.listen(8000, () => {console.log("Server listening on port 8000...");});
