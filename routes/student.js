let router = require('express').Router();
let db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')
const multer = require('multer');
const upload = multer({dest: './uploads'});
const cloudinary = require('cloudinary')



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
          console.log(tutor.get())
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
        res.redirect('student')
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



//  router.post('/', upload.single('myFile'), (req, res) => {
//     cloudinary.uploader.upload(req.file.path, (result) => {
//       db.student.update({
//         url: req.file.url
//       }, {
//         where: { id: req.body.id }
//       })
//       .then(()=> {
//         res.redirect('/profile')
//       })
//       .catch(err => {
//         console.log('ERROR', err)
//       })
//     })
//   })
  
//   router.get('/profile', (req, res) =>{
//     db.user.findByPk(req.user.id)
//     .then(user => {
//       if (user.distinction == 'student'){
//         db.student.findOne({
//           where: { userId: user.id }
//         })
//         .then(student => {
//           res.render('profile', { user: student })
//         })
//         .catch(err =>{
//         console.log('ERROR', err)
//         })
//       } else {
//         db.tutor.findOne({
//           where: { userId: user.id }
//         })
//         .then(tutor => {
//           res.render('profile', { user: tutor })
//         })
//         .catch(err =>{
//         console.log('ERROR', err)
//         })
//       }
//     })
//   }) 

  


module.exports = router