const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const authroutes = require('./routes/auth.routes')
const stripeRouter = require('./routes/stripe.routes')
app.use(cookieParser());

app.use('/api/stripe',stripeRouter)

app.use(express.json());
app.use('/api/auth',authroutes);
app.use('/api',authroutes)


module.exports = app ;



    