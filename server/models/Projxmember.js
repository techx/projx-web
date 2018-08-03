// IMPORTS //
var mongoose = require('mongoose');


// SCHEMA //
var projxmemberSchema = mongoose.Schema({
    email: { type: String, required: true, lowercase: true, index: { unique: true } }, // unique identifier
    isAdmin: { type: Boolean, required: true },
    name: { type: String }
});


// METHODS //

/**
 * Find a member if exists; callback error otherwise
 * @param email {string} - email of a potential member
 * @param callback {function} - function to be called with err and result
 */
projxmemberSchema.statics.getProjxmember = function(email, callback) {
    Projxmember.find({ email: email.toLowerCase() }, function(err, results) {
        if (err) {
            callback(err);
        } else if (results.length > 0) {
            console.log("getMember success");
            callback(null, results[0]);
        } else {
            console.log("getMember fail");
            callback('Projxmember not found');
        };
    });
}

/**
 * Create a new projxmember
 * @param projxmember {object} - projxmember object to be created (must have unique email field)
 * @param callback {function} - function to be called with err and result
 */
projxmemberSchema.statics.createProjxmember = function (projxmember, callback) {
    projxmember.email = projxmember.email.toLowerCase();
    projxmember.isAdmin = false;
    Projxmember.find({ email: projxmember.email }, function (err, results) {
        if (err) callback(err);
        else if (results.length === 0) {
            var newProjxmember = new Projxmember(projxmember);
            newProjxmember.save(function (err) {
                if (err) callback('Error saving projxmember: ' + err);
                else callback(null, newProjxmember);
            });
        } else callback('Member already exists');
    });
}


/**
 * Update given member
 * @param projxmember {object} - new member object (with email as identifier)
 * @param callback {function} - function to be called with err and result
 */
projxmemberSchema.statics.updateProjxmember = function (projxmember, callback) {
    Projxmember.getProjxmember(projxmember.email, function (err, oldProjxmember) {
        if (err) {
            callback(err);
        } else {
            for (field in Projxmember.schema.paths) {
                oldProjxmember[field.split(".")[0]] = projxmember[field.split(".")[0]];
            };
            oldProjxmember.save(function (err) {
                if (err) callback('Error saving projx member: ' + err);
                else callback(null, oldProjxmember);
            });
        }
    })
}


// EXPORTS //
var Projxmember = mongoose.model('Projxmember', projxmemberSchema);
module.exports = Projxmember;
