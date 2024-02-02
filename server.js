const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, '/client')))

const messages = [];

app.get('/', (req, res) => {
    res.render('index.html');
});

app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});