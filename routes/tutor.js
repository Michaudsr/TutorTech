let router = require('express').Router();
let db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn');
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingClient = mbxGeocoding({accessToken: process.env.MAPBOX_TOKEN})



router.get('/profile/:id', (req, res) =>{
    console.log(req.params)
    console.log('🤢')
    db.tutor.findOne({
      where: { id: req.query.id }
    })
    .then(tutors =>{
      db.user.findOne({
        where: { id: tutors.userId }
      })
      .then(foundTutor =>{
        console.log('found tutor: ', foundTutor)
        res.render('tutors/tutorProfile', { tutors, foundTutor })
      })
      .catch(err => {
        console.log('error, couldn\'t find tutor', err)
      })
  
    })
    .catch(err => {
      console.log('Error, finding tutor at profile route 😢', err);
    })
  })

  router.get('/locationSearch',(req,res)=>{
    db.tutor.findAll({
      where: { city: req.query.city}
    })
    .then(tutors =>{
      geocodingClient.forwardGeocode({
        query: `${req.query.city},${req.query.state}`,  
      })
      .send()
      .then(response=>{
          let match = response.body.features[0]
    
          console.log("match", match)
          console.log(match.center)
          res.render('tutors/locationSearch',{match, mapKey:process.env.MAPBOX_TOKEN, city:req.query.city, state:req.query.state, tutors: tutors})
      })
      .catch(err=>{
          console.log(err)
          res.send('Error',err)
      })
      console.log(tutors)
    })
  
  })

  router.get('/tutorSearch', (req, res) => {
    db.tutor.findAll({ include: [db.user]})
    .then((tutors) =>{
      // console.log('tutors from search', tutors)
      console.log(tutors[0].user, '😶' )
      res.render('tutors/tutorSearch', { tutors: tutors })
    }).catch(err => {
      console.log('Error, finding tutors in tutorSearch route 🤮', err);
    })
  
  })

  router.get('/tutorProfileEdit', isLoggedIn, (req, res) =>{
    db.tutor.findOne({
      where: { userId: req.user.id },
      include: [db.user]
  
    })
    .then((tutor) =>{
      res.render('tutors/tutorProfileEdit', { tutor: tutor });
  
    }).catch(err => {
      console.log('Error, finding tutor at profile route 😢', err);
    })
  })

  router.put('/tutorProfileEdit', isLoggedIn, (req, res) =>{
    db.tutor.update(req.body, {
      where: { userId: req.user.id },
      include: [db.user]
    })
      .then(([row, tutor]) =>{
        res.redirect('/student')
      }).catch(err => {
        console.log('Error updating tutor at tutorProfileEdit put route', err);
      })
  })

  router.delete('/tutorDelete', isLoggedIn, (req, res) =>{
    db.tutor.destroy({
      where: { userId: req.user.id },
      include: [db.user]
    })
    .then((tutor) =>{
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

  module.exports = router;