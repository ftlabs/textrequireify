'use strict';

var path = require('path');
var through = require('through');
var falafel = require('falafel');
var fs = require('fs');

var prefix = /^text!/;

function create(config) {
	return function(file) {
		var source = '';
		if (!(/\.js$/).test(file)) return through();

		var rootDirectory = path.resolve(path.normalize(config.rootDirectory || './bower_components/'));

		var tr = through(function(buf){source += buf;}, function(){
			try {
				tr.queue(parse(source));
			} catch(err) {
				err.debowerifyFile = file;
				err.sourcecode = source;
				tr.emit('error', err);
			}
			tr.queue(null);
		});
		return tr;

		function parse() {
			return String(falafel(source, { locations: true, ecmaVersion: 6 }, function(node) {

				// Find require() calls
				if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
					var requirePath;

					if(node.callee.name === 'requireText') { // requireText("file.txt")
						requirePath = node.arguments[0].value;
					} else if(node.callee.name === 'require' && prefix.test(node.arguments[0].value)) { // require("text!file.txt")
						requirePath = node.arguments[0].value.replace(prefix, '');
					} else {// none of the above, skip
						return;
					}

					var fsPath;
					if (/^\.+\//.test(requirePath)) {
						fsPath = path.resolve(path.dirname(file), requirePath); // relative paths are relative to the current file
					} else if (rootDirectory) {
						fsPath = path.resolve(rootDirectory, requirePath); // absolute paths require rootDirectory setting
					}

					if (fsPath.substring(0, rootDirectory.length) !== rootDirectory) {
						throw new Error("Can't require '" + requirePath + "' in '" + file + ":" + node.loc.start.line + "', because the path points outside the root directory (too many '../'?)");
					}

					if (!fs.existsSync(fsPath)) {
						throw new Error("Can't require '" + requirePath + "' in '" + file + ":" + node.loc.start.line + "', because the file '" + fsPath + "' doesn't exist");
					}

					// JSON.stringify escapes the text as a JS string literal
					node.update(JSON.stringify(fs.readFileSync(fsPath, {encoding:'utf-8'})));
				}
			}));
		}
	};
}

module.exports = create({});
module.exports.create = create;
