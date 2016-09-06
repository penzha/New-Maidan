/**
 * New node file
 */

var mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
}
module.exports = User;

User.prototype.save = function save (callback) {
	// save to Mongodb
	var user = {
		name: this.name,
		password: this.password,
	};
	
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		
		// read users set
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			// add index to attribute 'name'
			collection.ensureIndex('name', {unique: true});
			
			// write into user doc
			collection.insert(user, {safe: true}, function(err, user) {
				mongodb.close();
				callback(err, user);
			});	
		});
	});
};

User.get = function get (username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		
		// read user set
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			// search doc that 'name' = username
			collection.findOne({name: username}, function(err, doc) {
				mongodb.close();
				if (doc) {
					// convert to User object
					var user = new User(doc);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
};
