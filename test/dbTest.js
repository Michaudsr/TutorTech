const db = require('../models')

db.student.findOne()
.then(student =>{
   db.tutor.findByPk({
       where: {}
   })
})


