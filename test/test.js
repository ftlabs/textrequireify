'use strict';
var browserify = require('browserify');
var textrequireify = require('../index');
var path = require('path');
var assert = require('assert');
var includeDir = path.join(__dirname, 'includes');
var dataDir = path.join(__dirname, 'data');

it('should include file as an inline string', function(done) {
	var b = browserify();
	b.add(path.join(includeDir, 'compiletarget.js'));
	b.transform(textrequireify.create({ rootDirectory: __dirname }));
	b.bundle(function(e, buffer) {
		if (e) {
			done(e);
			return;
		}

		assert(buffer.toString().indexOf('testcontent') >= 0);
		done();
	});
});

it('should include file as an inline string with webpack loader syntax', function(done) {
	var b = browserify();
	b.add(path.join(includeDir, 'compiletargetbang.js'));
	b.transform(textrequireify.create({ rootDirectory: __dirname }));
	b.bundle(function(e, buffer) {
		if (e) {
			done(e);
			return;
		}

		assert(buffer.toString().indexOf('testcontent') >= 0);
		done();
	});
});

it('should work with es6 files', function(done) {
	var b = browserify();
	b.add(path.join(includeDir, 'es6compiletarget.js'));
	b.transform(textrequireify.create({ rootDirectory: dataDir }));
	b.bundle(function(e, buffer) {
		if (e) {
			done(e);
			return;
		}

		assert(buffer.toString().indexOf('testcontent') >= 0);
		done();
	});
});

it('should work with es6 files and require loader syntax', function(done) {
var b = browserify();
b.add(path.join(includeDir, 'es6compiletargetbang.js'));
b.transform(textrequireify.create({ rootDirectory: dataDir }));
b.bundle(function(e, buffer) {
	if (e) {
		done(e);
		return;
	}

	assert(buffer.toString().indexOf('testcontent') >= 0);
	done();
});
});
