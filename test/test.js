'use strict';
var browserify = require('browserify');
var textrequireify = require('../index');
var path = require('path');
var assert = require('assert');

it('should include file as an inline string', function(done) {
	var b = browserify();
	b.add(path.join(__dirname, 'compiletarget.js'));
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
	b.add(path.join(__dirname, 'compiletargetbang.js'));
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
	b.add(path.join(__dirname, 'es6compiletarget.js'));
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

it('should work with es6 files and require loader syntax', function(done) {
var b = browserify();
b.add(path.join(__dirname, 'es6compiletargetbang.js'));
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
