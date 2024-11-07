// Including controllers that will handle functions from routing
const wordController = require('./controllers/wordController');
const alphabetController = require('./controllers/alphabetController');

module.exports = (server) => {
    // API route to handle phonetic word retrieval
    server.post('/ipa/:language/:word', wordController.getPhonetic);

    // API call to retrieve International Phonetic Alphabet for specific language
    server.post('/alphabet/:language', alphabetController.getAlphabet);
};
