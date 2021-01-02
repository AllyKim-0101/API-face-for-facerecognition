const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    //validation on frontend 
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    }
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

}

module.exports = {
    handleRegister: handleRegister
};
