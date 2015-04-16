/*jslint node: true */
"use strict";

var Q = require("q");
var child = require('child-process-promise');
var path = require('path');
var program = require('./program');
var utils = require('./utils');

var executeVariety = function(proc, args, libPath) {
  var spawnArgs = [args.db, '--eval='+utils.buildParams(args.collection, args.params), libPath].concat(args.shellParams);
  return child.spawn('mongo', spawnArgs)
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
  return Q.resolve(program.parse(proc.argv));
};

var shouldRunAnalysis = function(args) {
  return (args.params.help || !args.db || !args.collection) ? Q.reject() : Q.resolve(args);
};

var printHelp = function(proc, ex) {
  if(ex) {
    proc.stderr.write(ex.message);
  }
  proc.stdout.write(program.help());
};

var verifyVarietyLib = function(proc) {
  var varietyPath = path.join(path.dirname(module.parent.filename), 'variety.js');
  var varietyUrl = 'https://raw.githubusercontent.com/variety/variety/master/variety.js';
  return utils.fileExists(varietyPath)
    .fail(function(ex) {
      proc.stderr.write(ex.message + '\n');
      proc.stdout.write('Downloading Variety from ' + varietyUrl + '.\n');
      return utils.download(varietyUrl, varietyPath);
    });
};

module.exports = function(proc) {
  // return promise, to allow usage in tests or in other libraries
  return parse(proc)
    .then(function(args) {
      return shouldRunAnalysis(args)
        .then(function(){return verifyVarietyLib(proc);})
        .then(function(libPath){return executeVariety(proc, args, libPath);});
    })
  .fail(function(ex) {
    printHelp(proc, ex);
  });
};
