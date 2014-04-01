# textrequireify

Browserify transform that includes text files using `requireText('module/filename')` syntax.

## Usage

### JS files

The transform is only applied to JS files with a `.js` extension. It can include any file as long as it's UTF-8 encoded.

	requireText('modulename/file.ext');

This expression will be replaced with a string with contents of the `file.ext` from `modulename` module.

	requireText('./relative/path/file.ext');

File will be loaded from the path relative to the file containing the `requireText()` call.

### Browserify API

		var textrequireify = require('textrequireify');

		browserify.transform(textrequireify.create({
			rootDirectory: "/path/to/bower_components/",
		}));
