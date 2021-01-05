const express = require('express');
const bodyParser = require('body-parser');
//bcrypt is for security
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


//connect postgres
const db = knex({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "test",
        database: "smart-brain"
    }
});

// db.select('*').from('users').then(data => {
//     console.log(data);
// });

const app = express();


//without the line 7 - app.use(bodyParser.json()), there will be an error that can not match database in frontend and backend

app.use(bodyParser.json());
app.use(cors())


// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'Ally',
//             password: 'cookies',
//             email: 'ally@gmail.com',
//             entries: 0,
//             joined: new Date()
//         },

//         {
//             id: '124',
//             name: 'Adam',
//             password: 'bananas',
//             email: 'Adam@gmail.com',
//             entries: 0,
//             joined: new Date()
//         }

//     ],
//     login: [
//         {
//             id: '987',
//             hash: '__',
//             email: 'john@gmail.com'
//         }
//     ]

// }

app.get('/', (req, res) => {
    res.send(database.users);
})


app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

// // Load hash from your password DB.
// bcrypt.compare("apples", '$2a$10$HAuTR0p8zZfgvpkERJOLBeu/4vbAC9KEnme9fhIu7Mrn/wSiWpqeK', function (err, res) {
//     // res == true
//     console.log('first guess', res)
// });
// bcrypt.compare("veggies", '$2a$10$HAuTR0p8zZfgvpkERJOLBeu/4vbAC9KEnme9fhIu7Mrn/wSiWpqeK', function (err, res) {
//     // res = false
//     console.log('second guess', res)

// });


app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res) });


bcrypt.hash("bacon", null, null, function (err, hash) {
    // Store hash in your password DB.
});

// bcrypt.hash(password, null, null, function (err, hash) {
//     // Store hash in your password DB.
//     console.log(hash);
// });

app.listen(process.env.PORT || 3001, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})
