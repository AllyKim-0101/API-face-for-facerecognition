const express = require('express');
const bodyParser = require('body-parser');
//bcrypt is for security
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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


app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash); // true
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')

            }
        })
        .catch(err => res.status(400).json('Wrong credentials'))
})

// // Load hash from your password DB.
// bcrypt.compare("apples", '$2a$10$HAuTR0p8zZfgvpkERJOLBeu/4vbAC9KEnme9fhIu7Mrn/wSiWpqeK', function (err, res) {
//     // res == true
//     console.log('first guess', res)
// });
// bcrypt.compare("veggies", '$2a$10$HAuTR0p8zZfgvpkERJOLBeu/4vbAC9KEnme9fhIu7Mrn/wSiWpqeK', function (err, res) {
//     // res = false
//     console.log('second guess', res)

// });





app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        //response is a must and it responses with the last array in database
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        //add new users info from frontend to the database

        .catch(err => res.status(400).json('Unable to register'))

})


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id
    })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not Found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
    // if (!found) {
    //     res.status(400).json("not found");
    // }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
})

bcrypt.hash("bacon", null, null, function (err, hash) {
    // Store hash in your password DB.
});



// bcrypt.hash(password, null, null, function (err, hash) {
//     // Store hash in your password DB.
//     console.log(hash);
// });

app.listen(3001, () => {
    console.log('app is running on port 3001');
})
