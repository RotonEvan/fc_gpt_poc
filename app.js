import dotenv from 'dotenv';
dotenv.config()

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';
// import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
const app = express()
const port = process.env.PORT || 3000
import routes from './src/routes.js'
import cors from 'cors';

app.use(cors())
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static('public'));

app.use('/api', routes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});