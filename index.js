const express = require("express");
const {v4: uuidv4} = require('uuid');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomID: req.params.room})
})

app.listen(8000, () => {
    console.log("Server is running on port 8000");
})