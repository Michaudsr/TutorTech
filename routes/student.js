let router = require('express').Router();
let db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')



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

module.exports = router