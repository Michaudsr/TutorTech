# Express Authentication

Express authentication template using Passport + flash messages + custom middleware

## What it includes

* Sequelize user model / migration
* Settings for PostgreSQL
* Passport and passport-local for authentication
* Sessions to keep user logged in between pages
* Flash messages for errors and successes
* Passwords that are hashed with BCrypt
* EJS Templating and EJS Layouts

### User Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| name | String | Must be provided |
| email | String | Must be unique / used for login |
| password | String | Stored as a hash |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Default Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | / | server.js | Home page |
| GET | /auth/login | auth.js | Login form |
| GET | /auth/signup | auth.js | Signup form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates User |
| GET | /auth/logout | auth.js | Removes session info |
| GET | /profile | server.js | Regular User Profile |

## Steps To Use

#### 1. Create a new repo on Github and use your 'express-authentication' as the template

When we are finished with this boilerplate, we are going to make it a template on Github that will allow us to create a new repo on Github with all this code already loaded in.
* Go to `github.com` and create a new repository. In the template dropdown, choose this template.
* Clone your new repo to your local machine
* Get Codin'!

#### 2. Delete any .keep files

The `.keep` files are there to maintain the file structure of the auth. If there is a folder that has nothing in it, git won't add it. The dev work around is to add a file to it that has nothing in it, just forces git to keep the folder so we can use it later.

#### 3. Install node modules from the package.json

```
npm install
```

(Or just `npm i` for short)

#### 4. Customize with new project name

Remove defaulty type stuff. Some areas to consider are:

* Title in `layout.ejs`
* Description/Repo Link in `package.json`
* Remove boilerplate's README content and replace with new project's readme

#### 5. Create a new database for the new project

Using the sequelize command line interface, you can create a new database from the terminal.

```
createdb <new_db_name>
```

#### 6. Update `config.json`

* Change the database name
* Other settings are likely okay, but check username, password, and dialect

#### 7. Check the models and migrations for relevance to your project's needs

For example, if your project requires a birthdate field, then don't add that in there. 

> When changing your models, update both the model and the migration.

#### 8. Run the migrations

```
sequelize db:migrate
```

#### 9. Add a `.env` file with the following fields:

* SESSION_SECRET: Can be any random string; usually a hash in production
* PORT: Usually 3000 or 8000

#### 10. Run server; make sure it works

```
nodemon
```

or

```
node index.js
```
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
