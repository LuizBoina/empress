const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require("express-graphql");
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/auth');

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

//to make requests http://localhost:8000/graphql
app.use(
    '/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true,
        /*customFormatErrorFno: (err) => {
            return ({ message: err.message, statusCode: err.statusCode });
        }*/
    })
);

mongoose
    .connect('mongodb://mongo:27017', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //user: "empressAdmin",//process.env.MONGO_USER,
        //pass: "AHrPvwX?6%mY$z@'",//process.env.MONGO_PASSWORD,
        dbName: "empress"//process.env.MONGO_DBNAME,
        //ssl: true
    })
    .then(() => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });
