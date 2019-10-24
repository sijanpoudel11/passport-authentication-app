passport = require('passport');

module.exports = function(req,res,next){
    if(req.isAuthenticated()){
        console.log('user authenticated');
        return next();
    }
    res.redirect('/login');
    console.log('not authenticated');
}