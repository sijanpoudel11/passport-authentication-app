var router = require('express').Router();
let mongoose = require('mongoose');
var User = require('./models/model');
var passport = require('passport');

 //var entureauthenticated = require('./auth');
mongoose.connect('mongodb://localhost/passport', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('database connection established');
}).catch((err) => {
    console.log(err);


})


router.get('/', (req, res) => {
    res.render('home');
});
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login',redirectdashboard, (req, res) => {
    res.render('login');
});

router.get('/dashboard', entureauthenticated,(req, res) => {
    res.render('dashboard', {name: req.user.name});
    console.log(req.user);
});
// logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
    console.log( 'logged out');
})

router.post('/register', (req, res) => {
    var name = req.body.name;
    var age = req.body.age;
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email: email}).then(user => {
        if (user) {
            res.send(user.email + 'already exists please try with a new email address');
        } else {
            const newuser = new User({name, age, email, password});
            newuser.password = newuser.hashpassword(password);
            console.log(newuser);
            newuser.save().then(user => {
                res.send(user);
            }).catch(error => {
                console.log(error);
            })
        }
    })


})

/*  var newuser = new user();
    
       newuser.name= req.body.name;
        newuser.age= req.body.age;
        newuser.gender= req.body.gender;
        newuser.email= req.body.email;
        newuser.password=req.body.password;
        newuser.save()
        .then(user=>{
            
        })
        .catch(error=>{
            console.log(error);
        })
    */


router.post('/login', function (req, res, next) {
    passport.authenticate('login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'
    })(req, res, next);
});




function entureauthenticated (req,res,next){
    if(req.isAuthenticated()){
        console.log('user authenticated');
        return next();
    }
    res.redirect('/login');
    console.log('not authenticated');
}
function redirectdashboard (req,res,next){
    if(req.isAuthenticated()){
        console.log('user authenticated');
      res.redirect('/dashboard');
    }
    
console.log('user not authenticated');
   return next();
}

module.exports = router;
