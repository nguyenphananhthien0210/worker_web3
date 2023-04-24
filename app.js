const express = require('express')
const router = require('./worker')

const hostname = 'localhost';
const port = 3000;

const app = express()
app.use('/worker', router)
app.get('/', function (req, res) {
    console.log("start")
    res.status(200).send("hi")
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});