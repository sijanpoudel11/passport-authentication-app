var Localstrategy = require('passport-local');
var User = require('./models/model');
bcrypt = require('bcrypt');


module.exports = function (passport) {
    

    passport.use('login', new Localstrategy({
        usernameField: 'email',

        passReqToCallback: true
    }, function (req, email, password, done) {

        User.findOne({
            email: email
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            // no user found

            if (!user) {
                console.log('no user found ');
                return done(null,false);
                
            }

             // comparing password using bcrypt
            if ( bcrypt.compareSync(password,user.password)) {
               
                console.log('user an password matched');

                return done(null, user);
            }else{

            console.log('password not matched');

           return done(null, false);
            }

        })


    }))
    passport.serializeUser(function (user, done) {

        done(null, user.id);

    });


    passport.deserializeUser(function (id, done) {

        User.findById(id, function (err, user) {

            done(err, user);

        });
    });
}
