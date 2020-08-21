let router = require('express').Router();
let db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')
const multer = require('multer');
const upload = multer({dest: __dirname + '/profile'});



router.get('/', isLoggedIn, (req, res) => {
    let userType = req.user.distinction 
    if (userType == 'student') {
      console.log(userType, '😀')
      db.student.findOne({
        where: { userId: req.user.id },
        include: [db.user]
      })
      .then((student) =>{
        res.render('profile', { student: student, userType, currentUser: req.user});
  
      }).catch(err => {
        console.log('Error, finding student at profile route 😢', err);
      })
    } else {
        db.tutor.findOne({
          where: { userId: req.user.id },
          include: [db.user]
  
        })
        .then((tutor) =>{
          res.render('profile', { tutor: tutor, userType, currentUser: req.user });
    
        }).catch(err => {
          console.log('Error, finding tutor at profile route 😢', err);
        })
  
    }
  });

  router.get('/studentProfileEdit', isLoggedIn, (req, res) =>{
    db.student.findOne({
      where: { userId: req.user.id },
      include: [db.user]
  
    })
    .then((student) =>{
      res.render('students/studentProfileEdit', { student: student });
  
    }).catch(err => {
      console.log('Error, finding student at profile route 😢', err);
    })
  })

  router.put('/studentProfileEdit', isLoggedIn, (req, res) =>{
    db.student.update(req.body, {
      where: { userId: req.user.id },
      include: [db.user]
    })
      .then(([row, student]) =>{
        res.redirect('/student')
      }).catch(err => {
        console.log('Error updating student at studentProfileEdit put route', err);
      })
  })

  router.delete('/studentDelete', isLoggedIn, (req, res) =>{
    db.student.destroy({
      where: { userId: req.user.id },
      include: [db.user]
    })
    .then((student) =>{
      db.user.destroy({
        where: { id: req.user.id }
      }).then((user) =>{
        res.redirect('/auth/signup')
      }).catch(err => {
        console.log('Error Deleting User', err);
      })
    }).catch(err => {
      console.log('Error Deleting Tutor', err);
    })
  })

  router.post('/', upload.single('photo'), (req, res) => {
    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
  });

  router.post('/', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any

  })


module.exports = router