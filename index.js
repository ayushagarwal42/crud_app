require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;

//database connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to the database'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: "mysecretkey",
    saveUninitialized: true,
    resave: false,
}))

app.get('/', (req, res) => {
    res.send('hello World');
});

app.listen(PORT, () => {
    console.log(`Server starts at http://localhost:${PORT}`);
});