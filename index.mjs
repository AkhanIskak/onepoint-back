import bodyParser from 'body-parser';
import express from 'express';
import config from './config.mjs';
import authController  from "./controllers/authController.mjs";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';

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
app.use('/auth', authController);

app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    res.render('error', {
        message: err.message,
        error: err
    });
});

mongoose.connect(
    'mongodb+srv://akhan:yaeTjxjoRcC50EX5@cluster0.eyg7o.mongodb.net/onepoint?retryWrites=true&w=majority',
    () => {
        app.listen(config.port, () => {
            console.log(`App listening on port ${config.port}`);
        });
    });