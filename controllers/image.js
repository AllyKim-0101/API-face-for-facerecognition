const { json } = require('body-parser');
const Clarifai = require('clarifai');


//hiding clarifai API in backend
const app = new Clarifai.App({
    //go to clarifi to see real API- this is for security
    apiKey: process.env.API_CLARIFI
});

const handleApiCall = (req, res) => {
    app.models
        .predict(
            Clarifai.FACE_DETECT_MODEL,
            req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'))

}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall

}
