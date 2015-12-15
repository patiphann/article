'use strict';

var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;
var bcrypt   	= require('bcrypt-nodejs');

var userSchema = new Schema({
	email: {
		type: String,
		trim: true,
		default: ''
	},
	password: {
		type: String,
		trim: true,
		default: ''
	},
	image: {
		type: String,
		trim: true,
		default: '/uploads/default.gif'
	},
	name: {
		type: String,
		trim: true,
		default: ''
	},
	surname:{
		type: String,
		trim: true,
		default: ''
	},
	create_date:{
		type: String,
		trim: true,
		default: Date.now
	}
}, { collection: 'users' });

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	console.log(password);
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema);