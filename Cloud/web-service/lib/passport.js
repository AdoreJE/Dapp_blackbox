var db = require('../lib/db');
var bcrypt = require('bcrypt');

module.exports = function (app) {

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    // request.user 에 user 저장
    // 처음 한번만 실행
    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user);
        done(null, user.address);
    });

    // page 로드할때마다 저장
    passport.deserializeUser(function (address, done) {
        var user = db.get('users').find({
            address: address
        }).value();
        console.log('deserializeUser', address, user);
        done(null, user);
    });

    // passport 사용 - local(id, pass)
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (email, password, done) {
            console.log('LocalStrategy', email, password);
            var user = db.get('users').find({
                email: email
            }).value();
            if (user) {
                bcrypt.compare(password, user.password, function(err,result){
                    if(result){
                        return done(null, user, {
                            message: 'Welcome.'
                        });
                    } else {
                        return done(null, false, {
                            message: 'Password is not correct.'
                        });
                    }
                });
            } else {
                return done(null, false, {
                    message: 'There is no email.'
                });
            }
        }
    ));
    return passport;
}