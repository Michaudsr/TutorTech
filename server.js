require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const SECRET_SESSION = process.env.SECRET_SESSION;
const passport = require('./config/ppConfig')
const flash = require('connect-flash');
// require the authorization middleware at the top of the page
const isLoggedIn = require('./middleware/isLoggedIn');
const student = require('./models/student');
const db = require('./models');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);


// secret: What we actually giving back to the user to use our site/ session cookie
// resave: Save the session if even if it's modified, make this false
// saveUninitialized: if its a new session, we'll save it, therefor,
// setting this to true
app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}));

// Initialize passport and run session as middleware
app.use(passport.initialize());
app.use(passport.session());

// flash for temporary messages to the user
app.use(flash());

// middleware to have our messages accessible for every view
app.use((req, res, next) => {
  // before every route, we will attached our user to res.local
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('index', { alerts: res.locals.alerts });
});
                                             
app.get('/profile', isLoggedIn, (req, res) => {
  let userType = req.user.distinction 
  if (userType == 'student') {
    console.log(userType, '😀')
    db.student.findOne({
      where: { userId: req.user.id }
    })
    .then((student) =>{
      res.render('profile', { student: student });

    }).catch(err => {
      console.log('Error, finding student at profile route 😢', err);
    })
  } else {
      db.tutor.findOne({
        where: { userId: req.user.id }
      })
      .then((tutor) =>{
        res.render('tutorProfile', { tutor: tutor });
  
      }).catch(err => {
        console.log('Error, finding tutor at profile route 😢', err);
      })

  }
});


app.get('/tutorSearch', (req, res) => {
  db.tutor.findAll()
  .then((tutors) =>{
    console.log('tutors from search', tutors)
    res.render('tutorSearch', { tutors: tutors })
  }).catch(err => {
    console.log('Error, finding tutors in tutorSearch route 🤮', err);
  })

})






app.use('/auth', require('./routes/auth'));


const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${port} 🎧`);
});

module.exports = server;
