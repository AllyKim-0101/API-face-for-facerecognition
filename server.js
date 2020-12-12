const express = require('express');
const bodyParser = require('body-parser');
//bcrypt is for security
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();


//without the line 7 - app.use(bodyParser.json()), there will be an error that can not match database in frontend and backend

app.use(bodyParser.json());
app.use(cors())


const database = {
    users: [
        {
            id: '123',
            name: 'Ally',
            password: 'cookies',
            email: 'ally@gmail.com',
            entries: 0,
            joined: new Date()
        },

        {
            id: '124',
            name: 'Adam',
            password: 'bananas',
            email: 'Adam@gmail.com',
            entries: 0,
            joined: new Date()
        }

    ],
    login: [
        {
            id: '987',
            hash: '__',
            email: 'john@gmail.com'
        }
    ]

}

app.get('/', (req, res) => {
    res.send(database.users);
})


app.post('/signin', (req, res) => {
    // Load hash from your password DB.
    bcrypt.compare("apples", '$2a$10$HAuTR0p8zZfgvpkERJOLBeu/4vbAC9KEnme9fhIu7Mrn/wSiWpqeK', function (err, res) {
        // res == true
        console.log('first guess', res)
    });
    bcrypt.compare("veggies", '$2a$10$HAuTR0p8zZfgvpkERJOLBeu/4vbAC9KEnme9fhIu7Mrn/wSiWpqeK', function (err, res) {
        // res = false
        console.log('second guess', res)

    });


    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('error logging in');
    }
})


app.post('/register', (req, res) => {
    const { email, name, password } = req.body;

    //add new users info from frontend to the database
    database.users.push({
        id: '125',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    //response is a must and it responses with the last array in database
    res.json(database.users[database.users.length - 1])
})


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = 'false';
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json("not found");
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = 'false';
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json("not found");
    }
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
