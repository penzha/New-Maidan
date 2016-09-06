/**
 * New node file
 */

var mongodb = require('./db');

function Post(username, post, time) {
	this.user = username;
	this.post = post;
	
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
}
module.exports = Post;

Post.prototype.save = function save(callback) {
	// save into Mongodb
	var post = {
		user: this.user,
		post: this.post,
		time: this.time,
	};
	
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		
		// read posts
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			// add index for user attr
			collection.ensureIndex('user');
			// write post
			collection.insert(post, {safe: true}, function(err, post) {
				mongodb.close();
				callback(err, post);
			});
		});
	});
};

Post.get = function(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		
		console.log("Post.get");
		// read posts
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			console.log("db.collection find posts");
			// search 'user' = username. If username is null, then match all
			var query = {};
			if (username) {
				query.user = username;
			}
			
			collection.find(query).sort({time: -1}).toArray(function(err, docs) {
				mongodb.close();
				if (err) {
					callback(err, null);
				}
				console.log("will save posts");
				
				// save posts to Post
				var posts = [];
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.post, doc.time);
					posts.push(post);
				});
				callback(null, posts);
			});
		});
	});
};