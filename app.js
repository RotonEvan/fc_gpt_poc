require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const app = express()
const port = process.env.PORT || 3000
const routes = require('./src/routes')
const cors = require('cors')

app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static('public'));

app.use('/api', routes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});