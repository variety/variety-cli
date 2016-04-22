'use strict';

var child = require('child-process-promise');
var program = require('./program');
var utils = require('./utils');
var colors = require('colors/safe');

var executeVariety = function(proc, args, libPath) {
  var spawnArgs = [args.db, '--eval='+utils.buildParams(args.collection, args.params), libPath].concat(args.shellParams);

  var promise = child.spawn('mongo', spawnArgs);

  var childProcess = promise.childProcess;
  childProcess.stdout.on('data', function (data) {
    proc.stdout.write(data.toString());
  });
  childProcess.stderr.on('data', function (data) {
    proc.stderr.write(data.toString());
  });

  return promise;

};

var parse = function(proc) {
  try {
    return Promise.resolve(program.parse(proc.argv));
  } catch (err) {
    return Promise.reject(err);
  }
};

var shouldRunAnalysis = function(args) {
  return (args.params.help || !args.db || !args.collection) ? Promise.reject() : Promise.resolve(args);
};

var printHelp = function(proc, ex) {
  if(ex) {
    var errText = '\nERROR: ' + ex.message + '\n\n';
    proc.stderr.write(colors.red.bold(errText));
  }
  var helpText = program.help();
  proc.stdout.write(helpText);

  if(ex) {
    return Promise.reject(ex);
  } else {
    return Promise.resolve(helpText);
  }
};

var verifyVarietyLib = function() {
  return require.resolve('variety');
};

module.exports = function(proc) {
  // return promise, to allow usage in tests or in other libraries
  return parse(proc)
    .then(function(args) {
      return shouldRunAnalysis(args)
        .then(function(){return verifyVarietyLib(proc);})
        .then(function(libPath){return executeVariety(proc, args, libPath);});
    })
  .catch(function(ex) {
    return printHelp(proc, ex);
  });
};
