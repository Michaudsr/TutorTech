# Tutor Tech
Tutor Tech is an app that allows a user to sign up as either a student or a Tutor and create a personal profile. If a user signs up as a student they then will have the ability to search all the tutors in database, as well as search for a tutor by the location city and state. If a user signs up as a Tutor they have the ability to adjust their hourly rate and their profile will be visible for a user to search.

## Sign Up

The sign up logical first will find or create a user by their email,password and distinction(either student or tutor)
```
router.post('/signup', (req, res, next) => {
  console.log(req.body);
    db.user.findOrCreate({
      where: { email: req.body.email },
      defaults: { 
        password: req.body.password,
        distinction: req.body.distinction
      }
    })
```
Once the user has been created, and the distinction 'student' has been selected it will then create a student in the student table.
```
.then(([user, created]) => {
      if (created) {
        // if created, success and redirect to home
        console.log(`${user.email} was created`);
        if (req.body.distinction == 'student') {
          // create student in student table
          db.student.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userId: user.id,
            city: req.body.city,
            state: req.body.state,
            description: req.body.description
          })
          .then((student) =>{
            console.log('creating new student 😊', student.firstName)

          }).catch(err => {
            console.log('Error, Creating a new student 😢', err);
          })
```
Else if tutor was selected it will create a tutor in the tutor table
```
 } else {
          // create tutor in tutor table
          db.tutor.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userId: user.id,
            city: req.body.city,
            state: req.body.state,
            description: req.body.description,
            hourlyRate: 150
          })
          .then((tutor) =>{
            console.log('creating new tutor 😊', tutor.firstName)

          }).catch(err => {
            console.log('Error, Creating a new tutor 😢', err);
          })
        }
```
## Login

Once a user creates an account they can then log in as whichever distinction they chose, either a student or a tutor. The login using authenticate will either have a successful redirect back to the homepage or a failure back to the login, both using flash messages.
```
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'Welcome back.',
  failureFlash: 'Either email or password is incorrect. Please try again.'
}));
```
The login ejs page uses a form with an input for email and password.
```
<div class="pure-u-1 pure-u-md-1-3">
  <form action="/auth/login" method="POST">
    <label for="auth-email"></label>
    <input id="auth-email" type="email" name="email" placeholder="email">
</div>
  <div class="pure-u-1 pure-u-md-1-3">
    <label for="auth-password"></label>
    <input id="auth-password" type="password" name="password" placeholder='password'>
  </div>
  <div class="pure-u-1 pure-u-md-1-3">
    <button>Login</button>
  </form>
  </div>
  ```
Once logged in a user uses isLoggedIn middleware and and is able to access the site through a session cookie
```
module.exports = (req, res, next) => {
    if (!req.user) {
       req.flash('Error', 'You must be signed in to access this page');
       res.redirect('/auth/login');

    } else {
        next();
    }
};
```
```
app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}));
```
## Layout

If a user is not logged in, the nav bar on the homepage will have a link to See experts, which is a list of all the current tutor's in the database. The homepage also displays a sign up and login in link from the nav bar. Once a user is logged in the nav bar will then display, a link to the users personal profile, the See experts link, and a logout. I used a forEach loop on the tutorSearch.ejs to diplay all existing tutors in the database.
```
<div class="pure-u-1 pure-u-md-1-3"> 
  <h1>List of All Tutors on the App</h1>
  <% tutors.forEach(t => { %>
      <p>
        <div class="pure-u-1 pure-u-md-1-3"> 
          <form method="GET" action="/tutor/profile/<%= t.id %>"> 
            <input type="hidden" name="id" value="<%= t.id %>">
            <button type='submit'>
            <%= t.firstName %>
            <%= t.lastName %>
          </button>
          </form>
        </div>
        <div class="pure-u-1 pure-u-md-1-3"> 
          <%= t.user.email %>
        </div>
        <div class="pure-u-1 pure-u-md-1-3"> 
          <%= t.city %>,
          <%= t.state %>
        </div>
      </p>
      
    <% }) %>
</div>
```
```
   <ul>
            <div class="pure-g">
            <% if (!currentUser) { %>
              <div class="pure-u-1-3"><p><li><a href="/tutor/tutorSearch">See Experts</a></li></p></div>
              <div class="pure-u-1-3"><p><li><a id="signup" href="/auth/signup">Signup</a></li></p></div>
              <div class="pure-u-1-3"><p><li><a href="/auth/login">Login</a></l</p></div>
                <% } else { %>
                  <div class="pure-u-1-3"><p><li><a href="/student">Profile</a></li></p></div>
                  <div class="pure-u-1-3"><p><li><a href="/tutor/tutorSearch">See Experts</a></li></p></div>
                  <div class="pure-u-1-3"><p><li><a href="/auth/logout">Logout</a></li></p></div>
                <% } %>
            </div>
          </ul>
        </nav>
```
## Student 
If logged in as a student you can then from the homepage have access to your profile via the profile link in the nav bar. On the student profile page displays the name,email,location, and a descriptive bio. Below the details of the student you have a choice to edit your personal information as well as to delete your account. Above the student's details you have a location search, were you can then type a city and state and that will bring up the location search page for the tutor's in the area searched, as well as a map of the area.
```
<h2>Profile Page</h2>
<h3>Welcome to your PROFILE</h3>

<% if (userType == 'student') { %>
<form  method="GET" action="/tutor/locationSearch">
    <div class="pure-u-1 pure-u-md-1-3"> 
    <input type="text" name="city" id="" placeholder="city">
    </div>
    <div class="pure-u-1 pure-u-md-1-3"> 
    <input type="text" name="state" id="" placeholder="state">
    </div>
    <div class="pure-u-1 pure-u-md-1-3"> 
    <button type="submit">Submit </button>
    </div>
</form>
<div class="pure-u-1 pure-u-md-1-3"> 
<p>
<div class="pure-u-1 pure-u-md-1-3"> 
    <%= student.firstName %>
    <%= student.lastName %>
</div>

<div class="pure-u-1 pure-u-md-1-3"> 
<%= currentUser.email %>
</div>
<div class="pure-u-1 pure-u-md-1-3"> 
<%= student.city %>,
<%= student.state %>
</div>
<div class="pure-u-1 pure-u-md-1-3"> 
Bio: <%= student.description %>       
</div>
<div class="pure-u-1 pure-u-md-1-3"> 
<form action="/student/studentProfileEdit" method="GET">
<button>Edit</button>
</form>
<form action="/student/studentDelete?_method=DELETE" method="POST">
<button>Delete</button>
</form>
</div>
</p>
</div>
```
### Location Search

I used a forEach loop, on the location search.ejs to go through all tutors in the database, and matches the tutors attritubes of city and state with the search query using a get route. Mapbox will also display a map for the searched location.

```
<h1>Tutors by Location</h1>

<div>   <a href="/student">Back to Search</a>   </div>

<% tutors.forEach(t => { %>
    <p>
    <div class="pure-u-1 pure-u-md-1-3"> 
    <form method="GET" action="/tutor/profile/<%= t.id %>"> 
    <input type="hidden" name="id" value="<%= t.id %>">
    <button type='submit'>
    <%= t.firstName %>
    <%= t.lastName %>
    </button>
    </form>
    </div>      
    <div class="pure-u-1 pure-u-md-1-3"> 
        <%= t.id.email %>
    </div>
    <div class="pure-u-1 pure-u-md-1-3"> 
        <%= t.city %>,
        <%= t.state %>
    </div>   
    <div class="pure-u-1 pure-u-md-1-3"> 
        <%= t.description %>
    </div>  
    <div class="pure-u-1 pure-u-md-1-3"> 
    Hourly Rate:$<%= t.hourlyRate %>
    </div>   
    </p>
  <% }) %>
```
```
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
```
### Edit Student Profile

On the student profile page I created a form to bring you to the studentProfileEdit.ejs 
```
<form action="/student/studentProfileEdit" method="GET">
<button>Edit</button>
</form>
```
I created this route to get to the studentProfileEdit.ejs
```
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
```
Once on the studentProfileEdit.ejs you can then change any details of the students name, location, or descriptive bio.
```
<form action="/student/studentProfileEdit?_method=PUT" method="POST">  
    <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="firstName"></label>
        <input id="firstName" type="text" name="firstName" placeholder="first name" value="<%= student.firstName %>">
    </div>

    <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="lastName"></label>
        <input id="lastName" type="text" name="lastName" placeholder="last name" value="<%= student.lastName %>">
    </div>
    
    <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="city"></label>
        <input id="city" type="city" name="city" placeholder="city" value="<%= student.city %>">
    </div>
    <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="state"></label>
        <input id="state" type="state" name="state" placeholder="state" value="<%= student.state %>">
    </div>
    
    <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="description"></label>
        <input id="description" type="description" name="description" placeholder='description' value="<%= student.description %>">
    </div>
    <div class="pure-u-1 pure-u-md-1-3"> 
        <button type='submit'>Update</button>
    </div>
  
</form>
```
All the students information is wrapped in a form, and uses this put route i wrote to update the students information.
```
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
```
### Student Delete
If a user that has the distinction of student wants to delete their profile, they are able to go to profile page and select the delete button which uses the delete route that I wrote.
```
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
```
## Tutor

If a user is logged in as a tutor, like a student account the tutor will have access to view their profile, see experts, and logout via the nav bar. The get route I created to access the student profile is actually the same route used to render the tutor profile, using if, else statements
```
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
```
The tutor profile displays all the information that a student profile does name,email,location, descriptive bio, but also has a hourly rate display.
```
<% } else { %>
    <div class="pure-u-1 pure-u-md-1-3"> 

        <p> 
        <div class="pure-u-1 pure-u-md-1-3"> 
        <%= tutor.firstName %>
        <%= tutor.lastName %>
        </div>
        <div class="pure-u-1 pure-u-md-1-3"> 
        <%= currentUser.email%>
        </div>
        <div class="pure-u-1 pure-u-md-1-3"> 
        <%= tutor.city %>,
        <%= tutor.state %>
        </div>
        <div class="pure-u-1 pure-u-md-1-3"> 
         Bio: <%= tutor.description %>
        </div>
        <div class="pure-u-1 pure-u-md-1-3"> 
        Hourly Rate:$ <%= tutor.hourlyRate %>       
        </div>
        <div class="pure-u-1 pure-u-md-1-3"> 
        <form action="/tutor/tutorProfileEdit" method="GET">
        <button>Edit</button>
        </form>
        
        </div>
        <div class="pure-u-1 pure-u-md-1-3"> 
        <form action="/tutor/tutorDelete?_method=DELETE" method="POST">
        <button>Delete</button>     
        </form>
                 
        </div>
        </p>
    </div>
<% } %>
```
### Edit Tutor Profile
The Tutor profile, very similar to the student profile also have a form on the profile.ejs that takes you to the tutorProfileEdit.ejs, as seen above. The form above uses this put wrote i created:
```
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
```
Just like the studentProfileEdit, you can also update the tutors information, which also has the hourly rate that starts off at 150 dollars an hour.
```
  <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="firstName"></label>
        <input id="firstName" type="text" name="firstName" placeholder="first name" value="<%= tutor.firstName %>">
    </div>

    <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="lastName"></label>
        <input id="lastName" type="text" name="lastName" placeholder="last name" value="<%= tutor.lastName %>">
    </div>
    
    <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="city"></label>
        <input id="city" type="city" name="city" placeholder="city" value="<%= tutor.city %>">
    </div>
    <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="state"></label>
        <input id="state" type="state" name="state" placeholder="state" value="<%= tutor.state %>">
    </div>
    
    <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="description"></label>
        <textarea name="description" rows="2" cols="25" placeholder="Description"></textarea>  
    </div>
    <div class="pure-u-1 pure-u-md-1-3"> 
        <label for="hourlyRate"></label>
        <input id="hourlyRate" type="hourlyRate" name="hourlyRate" placeholder="hourly rate" value="<%= tutor.hourlyRate %>">
    </div>
    <div class="pure-u-1 pure-u-md-1-3"> 
        <button type='submit'>Update</button>
    </div>
</form>
```
All the tutor details are wrapped in form which uses this put route to update the information:
```
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
```
### Tutor Delete
If a user that has the distinction of tutor wants to delete their profile, they are able to go to profile page and select the delete button which uses the delete route that I wrote.
```
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
```