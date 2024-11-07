const redis = require('redis');
const request = require('request');
const cheerio = require('cheerio');

exports.getPhonetic = (lang, wordToTranslate, callback) => {
    // Get a Redis client from the connection pool
    const client = redis.createClient();

    // Connect to Redis Server
    client.on('connect', () => {
        // This will be the Redis key that will contain the phonetic equivalent
        const key = `${lang}:${wordToTranslate}`;

        // We attempt to retrieve the value from Redis
        client.get(key, (err, result) => {
            // Return an error if one is found
            if (err) {
                return callback(err);
            }
            // If the key is found, simply format the result as JSON and return it
            if (result) {
                const data = {
                    language: lang,
                    word: wordToTranslate,
                    phonetic: result,
                };
                return callback(null, data);
            }
            // The word is not cached in Redis. Retrieve the info from cambridge.com
            const url = `https://dictionary.cambridge.org/dictionary/english/${wordToTranslate}`;
            // Using request package we will retrieve info from desired URL
            request(url, (error, response, html) => {
                if (!error) {
                    // Using cheerio package we will extract the phonetic word from page
                    const $ = cheerio.load(html);
                    const phoneticWord = $(
                      '[class="ipa dipa lpr-2 lpl-1"]'
                    ).first().text();
                    // Format the result as JSON, store it in Redis and return it
                    const data = {
                        language: lang,
                        word: wordToTranslate,
                        phonetic: phoneticWord,
                    };
                    client.set(key, phoneticWord);

                    return callback(null, data);
                }
            });
        });
    });
};
