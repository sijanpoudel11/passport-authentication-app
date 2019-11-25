var router = require('express').Router();
let mongoose = require('mongoose');
var User = require('./models/model');
var passport = require('passport');
var bcrypt = require('bcrypt');

// var entureauthenticated = require('./auth');
mongoose.set('useFindAndModify', false)
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

router.get('/login', redirectdashboard, (req, res) => {

    res.render('login');
});

router.get('/dashboard', entureauthenticated, (req, res) => {
    res.render('dashboard', {user: req.user});
    console.log(req.user);
});
router.get('/dashboard/:id',(req,res)=>{
    let id = req.params.id;
    User.findOne({_id:id},(err,user)=>{
        if(user){
            res.render('dashboard',{user:user})
        }
    })
})

router.get('/update/:id', entureauthenticated,(req, res) => {
    User.findById({
        _id: req.params.id
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (user) {
            res.render('update', {user: user})
        }
    })

})
router.get('/delete/:id',entureauthenticated, (req, res) => {
    let id = req.params.id;

    // alert('do you want to continue.');
    User.findOneAndDelete({
        _id: id
    }, (err, doc) => {
        if (err) {
            console.log(err);
        }
        if (doc) {
            console.log(doc.name + 'deleted from database');
            res.redirect('/login');
            
        }
    })

})

router.post('/update/:id',entureauthenticated, (req, res) => {
    var id = req.params.id;
    let password = req.body.password;

    console.log(req.params.id + '  and  ' + req.body.password + 'email' + req.body.email);

    User.findOne({
        email: req.body.email
    }, (err, doc) => {
        if (err) {
            console.log(err);
        }

        if (doc) {
            res.send(req.body.email + 'is already used. please use another email');
        }

        User.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                name: req.body.name,
                age: req.body.age,
                email: req.body.email,
                password: password
            }
        }, {new: true}).then((user) => {
            res.send('new user is' + user);
        }).catch(err => {
            res.send(err);
        })


    })
    // let newpassword = User.hashpassword(password)

})
// logout
router.get('/logout',entureauthenticated, (req, res) => {
    req.logOut();
    res.redirect('/login');
    console.log('logged out');
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
                console.log(user);
                res.render('login');
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
    passport.authenticate('login', function (err, user, info) {

        if (err) {
            return next(err);
        }
        if (! user) {
            console.log('email or password incorrect redirected to login page');
            res.redirect('/login');
        }
        console.log(user);
        req.logIn(user, function (err) {
            if (err) {
                return next(err);

            }
            console.log(req.user)
            console.log(user + 'logged in eith email' + user.email);
            res.render('dashboard', {user: user});
        })

    })(req, res, next);
});

router.get('/changepassword/:id', entureauthenticated,(req, res) => {
    let id = req.params.id;
    res.render('changepassword', {id: id});
    console.log('redirected for password changing');
})
router.post('/changepassword',entureauthenticated, (req, res) => {
    let {id, currentpassword, newpassword, confirmpassword} = req.body;
    console.log(currentpassword + 'new password' + newpassword);
    User.findOne({_id: id},(err,user)=>{
       
        if(err){
            res.send(err);
        }
        if(user){
            let name = user.name;
            let email = user.email;
            let age = user.age;
            let password = user.password;
    
            // compare password with current password
    
            if (bcrypt.compareSync(currentpassword, password)) {
    
                let hashedpassword = bcrypt.hashSync(newpassword, 10);
                user.password = hashedpassword;
                user.save().then(user => {
                    console.log(user);
                    res.render('dashboard',{user : user});
                }).catch(err => {
                    res.send(err);
                })
    
            }
        }
        
       console.log(req.user);
      //   res.redirect('/dashboard');
         res.render('dashboard',{user:req.user});
    })
    .then(user => {
        let name = user.name;
        let email = user.email;
        let age = user.age;
        let password = user.password;

        // compare password with current password

        if (bcrypt.compareSync(currentpassword, password)) {

            let hashedpassword = bcrypt.hashSync(newpassword, 10);
            user.password = hashedpassword;
            user.save().then(user => {
                console.log(user);
                res.render('dashboard',{user : user});
            }).catch(err => {
                res.send(err);
            })

        }
    }).catch(err => {
        console.log(err);
    })

})


function entureauthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('user authenticated');
        return next();
    }
    res.redirect('/login');
    console.log('not authenticated redirected to login page');
}
function redirectdashboard(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('user authenticated redirected to dashboard');
        res.redirect('/dashboard');
    }

    console.log('user not authenticated');
    return next();
}

module.exports = router;
