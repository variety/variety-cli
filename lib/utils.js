/*jslint node: true */
"use strict";

var Q = require("q");
var request = require('request');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var util = require('util');

var fileExists = function(filename) {
  var deferred = Q.defer();
  fs.exists(filename, function(exists) {
      if(exists) {
        deferred.resolve(filename);
      } else {
        deferred.reject(new Error('File ' + filename + ' not found in the local system.'));
      }
  });
  return deferred.promise;
};

var download = function(url, dest) {
  var deferred = Q.defer();
  request(url)
    .on('end', function(){return deferred.resolve(dest);})
    .on('error',deferred.reject)
    .pipe(fs.createWriteStream(dest, {encoding: 'utf8'}));
  return deferred.promise;
};

var evalConvertor = {
  'string': JSON.stringify,
  'object': JSON.stringify
};

var jsVarDefinition = function(value, name) {
  return util.format("var %s=%s;", name, (evalConvertor[typeof value] || _.identity)(value));
};

var buildParams = function(collection, opts) {
  return _.map(
      _.assign({}, {'collection':collection}, opts),
      jsVarDefinition
    ).join('');
};

module.exports = {
    'fileExists': fileExists,
    'download': download,
    'buildParams': buildParams
};