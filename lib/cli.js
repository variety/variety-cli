var path = require('path');
var utils = require('./utils');
var program = require('./program');

var execute = function(proc, args) {
  try {
    var execution = require('child_process').spawn(
      'mongo',
      [args.db, '--eval='+utils.buildParams(args.collection, args.params), 'variety.js'].concat(args.shellParams)
    );

    // https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
    execution.stdout.on('data', function (data) {
      proc.stdout.write('' + data);
    });

    execution.stderr.on('data', function (data) {
      proc.stderr.write('' + data);
    });

  } catch(ex) {
    proc.stdout.write(program.help());
    proc.exitFn(1);
  }
};

var runAnalysis = function(proc) {
  var args = program.parse(proc.argv);

  if(args.params.help) {
    proc.stdout.write(program.help());
    proc.exitFn(1);
  }
  execute(proc, args);
};

module.exports = function(proc) {
  var varietyPath = path.join(path.dirname(module.parent.filename), "variety.js");
  utils.verifyLocalLibrary(varietyPath)
    .fail(function(err){
        proc.stderr.write(err.message + "\n");
        return utils.download(
          "https://raw.githubusercontent.com/variety/variety/master/variety.js",
          varietyPath
        );
      })
    .then(function() {runAnalysis(proc);})
    .done();
};