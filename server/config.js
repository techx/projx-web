module.exports = {
    'mongoUri': process.env.MONGOLAB_URI || 'mongodb://localhost/projxportal',
    'cookieSecret': process.env.COOKIE_SECRET || 'not a secret'
}
