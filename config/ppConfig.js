const passport = requre('passport');
const localStrategy = require('passpoty-local').Stragetegy;
const db = require('../model');

// Passport serialize your info make it easier to login
// - Convert the user based on the id

passport.serializeUser((user, cb) => {
    cb(null, user.id);
})
// Passport "deserializeUser" is going to take the id and look that
// up in the database
passport.deserializeUser((id, cb) => {
    cb(null, id)
    .catch(cb());
})

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField:'password'
}, (email, password, cb) => {
    db.user.findOne({
        where: { email }
    })
    .then(user => {
        if(!user || !user.validPassword(password)) {
            cb(null, false);
        } else {
            cb(null, user);
        }
    })
    .catch(cb());
}))