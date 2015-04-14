var path = require('path');
var utils = require('./utils');
var program = require('./program');
var spawn = require('child-process-promise').spawn;
var Q = require("q");

var execute = function(proc, args) {
  var spawnArgs = [args.db, '--eval='+utils.buildParams(args.collection, args.params), 'variety.js'].concat(args.shellParams);
  return spawn('mongo', spawnArgs)
    .progress(function (childProcess) {
      childProcess.stdout.on('data', function (data) {
        proc.stdout.write(data.toString());
      });
      childProcess.stderr.on('data', function (data) {
        proc.stderr.write(data.toString());
      });
    });
};

var parse = function(proc) {
  return Q(program.parse(proc.argv));
};

var shouldRunAnalysis = function(args) {
  return args.params.help ? Q.reject() : Q(args);
};

var printHelp = function(proc, ex) {
  if(ex) {
    proc.stderr.write(ex);
  }
  proc.stdout.write(program.help());
};

var runAnalysis = function(proc,args) {
  execute(proc, args);
};

var verifyVarietyLib = function(proc) {

  var varietyPath = path.join(path.dirname(module.parent.filename), 'variety.js');
  var varietyUrl = 'https://raw.githubusercontent.com/variety/variety/master/variety.js';

  return utils.verifyLocalLibrary(varietyPath)
    .fail(function(ex) {
      proc.stderr.write(ex.message + '\n');
      return utils.download(varietyUrl, varietyPath);
    });
};

module.exports = function(proc) {
  // return promise, to allow usage in tests or in other libraries
  return parse(proc)
    .then(function(args) {
      return shouldRunAnalysis(args)
        .then(function(){return verifyVarietyLib(proc);})
        .then(function(){return runAnalysis(proc, args);});
    })
  .fail(function(ex) {
    printHelp(proc, ex);
  });
};
