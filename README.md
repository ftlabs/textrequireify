# textrequireify

Browserify transform that implements RequireJS-like `require('text!module/filename')` includes.

## Usage

### JS files

The transform only processes files with `.js` extension. Required files *must* be UTF-8 encoded.

	require('text!example/file.ext');

This expression will be replaced with a string with contents of the `file.ext` from `example` module. This is the recommended, require-js-compatible syntax.

	require('text!../relative/path/file.ext');

File will be loaded from the path relative to the file containing the `require()` call.

### Browserify API

		var textrequireify = require('textrequireify');

		browserify.transform(textrequireify.create({
			rootDirectory: "/path/to/bower_components/",
		}));
