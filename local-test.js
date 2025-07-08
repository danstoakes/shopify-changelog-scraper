// run-check.js
const { handler } = require('./netlify/functions/check-feed');

handler().then(response => {
    console.log('Function Response:', response);
}).catch(err => {
    console.error('Function Error:', err);
});