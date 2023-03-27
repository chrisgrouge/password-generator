const express = require("express"),
// this is our app or instance of express
app = express(),
//
homeRouter = require("./routes/home"),
//
randomRouter = require("./routes/random")
// port 3000 can be used for local testing. Otherwise, we're using the environment port.
port = process.env.PORT || 3000;



// API middlewares
// this will accept data in json format
app.use(express.json());
// will support url-encoded bodies
app.use(express.urlencoded({
  extended: true
}));
// this will serve the public folder as the static folder
app.use(express.static("public"));


// * This will be where all my routes get built by getting the path and rendering a specific page in the public folder
// Homepage
app.use(homeRouter)


// Random Words API
app.use(randomRouter)



// This is listening for the server created on our port
app.listen(port, () => {
  console.log('Server is running at port: ', 'http://localhost:' + port);
});