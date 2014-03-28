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

		var rootDirectory = config.rootDirectory && path.normalize(config.rootDirectory);

		var tr = through(function(buf){source += buf;}, function(){
			try {
				tr.queue(parse());
			}
			catch (err) {
				err.debowerifyFile = file;
				tr.emit('error', err);
			}
			tr.queue(null);
		});
		return tr;

		function parse () {
			return String(falafel(source, {loc:true}, function(node) {

				// Find require() calls
				if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'require') {
					var requirePath = node.arguments[0].value;
					if (!prefix.test(requirePath)) return; // skip if not require('text!path')

					requirePath = requirePath.replace(prefix,'');

					var fsPath;
					if (/^\.+\//.test(requirePath)) {
						fsPath = path.resolve(path.dirname(file), requirePath); // relative paths are relative to the current file
					} else if (config.rootDirectory) {
						fsPath = path.resolve(rootDirectory, requirePath); // absolute paths require rootDirectory setting
					} else {
						throw new Error("Can't require '" + requirePath + "' in '" + file + ":" + node.loc.start.line + "', because config.rootDirectory is not set");
					}

					if (config.rootDirectory && fsPath.substring(0, rootDirectory.length) !== rootDirectory) {
						throw new Error("Can't require '" + requirePath + "' in '" + file + ":" + node.loc.start.line + "', because the path escapes the root directory");
					}

					if (!fs.existsSync(fsPath)) {
						throw new Error("Can't require '" + requirePath + "' in '" + file + ":" + node.loc.start.line + "', because the file '" + fsPath + "' doesn't exist");
					}

					node.update(JSON.stringify(fs.readFileSync(fsPath, {encoding:'utf-8'})));
				}
			}));
		}
	};
}

module.exports = create({});
module.exports.create = create;
