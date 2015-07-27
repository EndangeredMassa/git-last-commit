var process = require('child_process');

function _command(command, callback) {
	process.exec(command, {cwd: __dirname}, function(err, stdout, stderr) {
		callback(stdout.split('\n').join(','));
	});
}

var command = 'git log -1 --pretty=format:"%h,%H,%s,%f,%b,%at,%ct,%an,%ae,%cn,%ce,%N," && git rev-parse --abbrev-ref HEAD && git tag --contains HEAD';

module.exports = {
	getLastCommit : function(callback) {
		_command(command, function(res) {
			var a = res.split(',');

			var tags = [];
			if (a[a.length-1] !== '') {
				tags = a.slice(13 - a.length);
			}

			callback({
				shortHash: a[0],
				hash: a[1],
				subject: a[2],
				sanitizedSubject: a[3],
				body: a[4],
				authoredOn: a[5],
				committedOn: a[6],
				author: {
					name: a[7],
					email: a[8],
				},
				committer: {
					name: a[9],
					email: a[10]
				},
				notes: a[11],
				branch: a[12],
				tags: tags
			});
		});
	}
};