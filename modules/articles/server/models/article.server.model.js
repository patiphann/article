'use strict';

var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;

var userSchema = new Schema({
	title: {
		type: String,
		trim: true,
		default: ''
	},
	content: {
		type: String,
		trim: true,
		default: ''
	},
	create_by: Schema.ObjectId,
	create_name: {
		type: String,
		trim: true,
		default: ''
	},
	create_date: {
		type: String,
		trim: true,
		default: Date.now
	},
	update_by: Schema.ObjectId,
	update_name: {
		type: String,
		trim: true,
		default: ''
	},
	update_date: {
		type: String,
		trim: true,
		default: Date.now
	}
}, { collection: 'articles' });

// redis
userSchema.set('redisCache', true);

userSchema.set('expires', 60);

module.exports = mongoose.model('articles', userSchema);

// update: [{
// 		by: Schema.ObjectId,
// 		date: {
// 			type: String,
// 			trim: true,
// 			default: Date.now
// 		}
// 	}]