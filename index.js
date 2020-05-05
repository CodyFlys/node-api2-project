const express = require('express');
const server = express();
const postsRouter = require('./posts/postsRouter');

server.use(express.json());

server.use('/api/posts', postsRouter);

server.get("/", (req, res) => {
    res.send('API ROOT')
})

server.listen(5000, () => {
    console.log('Server listening on http://localhost:5000')
})