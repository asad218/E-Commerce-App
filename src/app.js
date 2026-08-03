const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const authroutes = require('./routes/auth.routes')
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authroutes);
app.use('/api',authroutes)


module.exports = app ;



    