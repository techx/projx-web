var error = {};

error.internal = function (err, res) {
    console.log(err);
    res.status(500).send('Server error');
}

module.exports = error;
