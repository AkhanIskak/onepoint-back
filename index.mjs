import bodyParser from 'body-parser';
import express from 'express';
import config from './config.mjs';
import cookieParser from 'cookie-parser';
import UserAuth from './controllers/authController.mjs '

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`)

    if (req.body) {
        console.log('body', JSON.stringify(req.body));
    }

    next();
});

//controllers
app.use('/user', UserAuth);
app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}`);
});