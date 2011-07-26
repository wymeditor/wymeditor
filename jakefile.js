var fs = require('fs');

var files = [
	'dependencies/rangy/rangy-core.js',
	'dependencies/rangy/rangy-selectionsaverestore.js',
	'wymeditor/core/wymeditor.js',
	'wymeditor/core/observable.js',
	'wymeditor/core/utils.js',
	'wymeditor/core/selection.js',
	'wymeditor/core/dom/normalizer.js',
	'wymeditor/core/dom/serializer.js',
	'wymeditor/core/dom/structure_manager.js',
	'wymeditor/core/editable_area.js'
];

desc('Build WYMeditor');
task('default', function (params) {
	jake.Task['wymeditor.js'].invoke();
});

desc('Create build directory');
directory('build');

file({'wymeditor.js': ['build']}, function () {
	var i, file, data = '';
	for (i = 0; file = files[i]; i++) {
		 data += fs.readFileSync(file);
	}
	fs.writeFileSync('build/wymeditor.js', data);
})