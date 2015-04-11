#! /usr/bin/env node

/*jslint node: true */
"use strict";

var program = require('commander');
var HJSON = require('hjson');
var Q = require("q");
var request = require('request');
var fs = require('fs');
var path = require('path');

var download = function(url, dest) {
  console.log("downloading Variety from " + url);
  var deferred = Q.defer();
  request(url)
    .on('end', deferred.resolve)
    .on('error',deferred.reject)
    .pipe(fs.createWriteStream(dest));
  return deferred.promise;
};

var verifyLocalLibrary = function(filename) {
  var deferred = Q.defer();
  fs.exists(filename, function(exists) {
      if(exists) {
        deferred.resolve();
      } else {
        deferred.reject(new Error("Variety not found in local system, has to be downloaded"));
      }
  });
  return deferred.promise;
};

var jsVarDefinition = function(name, value) {
  if(typeof value === 'string') {
    value = '"' + value + '"';
  } else if(typeof value === 'object') {
    value = JSON.stringify(value);
  }
  return 'var ' + name + '=' + value + ";";
};

var buildParams = function(collection, program) {
  var varietyParams = program.opts();
  varietyParams.collection = collection;
  return Object
    .keys(varietyParams)
    .filter(function(key) {
      return typeof varietyParams[key] !== 'undefined';
    })
    .map(function(key) {
     return jsVarDefinition(key, varietyParams[key]);
    })
    .join('');
};

var runAnalysis = function() {
  program._name = 'variety'; // hack, how to do it correctly?
  program
    .option('-q, --query [query]', 'Standard Mongo query object (json), to filter the set of documents required before analysis', HJSON.parse)
    .option('-s, --sort [sort]', 'Analyze documents in the specified order, takes Mongo sort object (json)', HJSON.parse)
    .option('-m, --maxDepth <n>', 'Limit the depth Variety will recursively search to find new objects', parseInt)
    .option('-l, --limit <n>', 'Analyze only the <n> newest documents in a collection', parseInt)
    .option('-f, --outputFormat [type]', 'Output format of results, possible variants are "ascii" or "json" [ascii]', 'ascii')
    .option('-p, --persistResults [false]', 'Save results in MongoDB for future use [false]', false)
    .on('--help', function(){
      console.log('  Examples:');
      console.log('');
      console.log('    $ variety --sort {created:-1} logs/webserver');
      console.log('    $ variety --limit=2 --query=\'{"name": "Bob"}\' test/users');
      console.log('    $ variety -f "json" test/users');
      console.log('');
      console.log('    For other usages see https://github.com/variety/variety');
      console.log('');
    });

  program.usage = function() {
    return "[options] db_name/collection_name";
  };
  program.parse(process.argv);

  if (program.args.length != 1 || program.args[0].split("/").length != 2) {
    program.help();
    process.exit(1);
  }

  var database = program.args[0].split("/")[0];
  var collection = program.args[0].split("/")[1];
  var execution = require('child_process').spawn(
    'mongo',
    [database, '--eval='+buildParams(collection, program), 'variety.js'],
    {stdio:'inherit'}
  );
};

var varietyPath = path.join(__dirname, "variety.js");
verifyLocalLibrary(varietyPath)
  .fail(function(err){
      console.log(err.message);
      return download(
        "https://raw.githubusercontent.com/variety/variety/master/variety.js",
        varietyPath
      );
    })
  .then(runAnalysis)
  .done();
