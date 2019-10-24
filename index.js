var express = require('express');
var bodyparser = require('body-parser');
var router = require('./routes');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
require('./passport')(passport);
app = express();


// middlewares
app.use(session({ secret: "cats" ,

resave:false,

saveUninitialized:false

}));

//passport

app.use(passport.initialize());

app.use(passport.session());
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));

app.use('/', router);


app.listen('8000', () => {
    console.log('server started at port 8000');
})
