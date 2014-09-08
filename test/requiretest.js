var assert = require('assert');
var TextRequireify = require('../index');

suite('textrequireify', function(){
	test('require some', function(done){
		var tr = TextRequireify.create({rootDirectory:__dirname});
		var data = '';
		var failed = false;

		tr("some file that requires text.js")
			.on('error', function(err){
				failed = true;
				done(err);
			})
			.on('data', function(buf){
				data += buf;
			})
			.on('end', function(){
				if (!failed) done();
				assert.equal('var foo = "Test file\\n"; var bar = requireText;', data);
			})
			.end("var foo = requireText('data/test.txt'); var bar = requireText;");
	});

	test('nothing to require', function(done){
		var tr = TextRequireify.create({rootDirectory:__dirname});
		var data = '';
		var failed = false;
		var src = "alert('requireText(\"data/test.txt\")')";

		tr("nothing to see here.js")
			.on('error', function(err){
				failed = true;
				done(err);
			})
			.on('data', function(buf){
				data += buf;
			})
			.on('end', function(){
				if (!failed) done();
				assert.equal(src, data);
			})
			.end(src);
	});

	test('absolutely nothing to require', function(done){
		var tr = TextRequireify.create({rootDirectory:__dirname});
		var data = '';
		var failed = false;
		var src = "alert('nope')";

		tr("nothing to see here.js")
			.on('error', function(err){
				failed = true;
				done(err);
			})
			.on('data', function(buf){
				data += buf;
			})
			.on('end', function(){
				if (!failed) done();
				assert.equal(src, data);
			})
			.end(src);
	});
});
