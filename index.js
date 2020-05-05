const express = require('express');

const server = express();
server.use(express.json())

const postRouter = require('./post-routes/postRouter');

server.get('/',(req, res) => {
    res.status(200).json({message: "Looking good!"})
})

server.listen(4000, _ => {
    console.log("listening on port 4000");
})