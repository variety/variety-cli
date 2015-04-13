/*jslint node: true */
"use strict";

var Q = require("q");
var request = require('request');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var verifyLocalLibrary = function(filename) {
  var deferred = Q.defer();
  fs.exists(filename, function(exists) {
      if(exists) {
        deferred.resolve();
      } else {
        deferred.reject(new Error("Variety not found in the local system, has to be downloaded."));
      }
  });
  return deferred.promise;
};

var download = function(url, dest) {
  console.log("downloading Variety from " + url);
  var deferred = Q.defer();
  request(url)
    .on('end', deferred.resolve)
    .on('error',deferred.reject)
    .pipe(fs.createWriteStream(dest));
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

var buildParams = function(collection, opts) {
  var varietyParams = _.assign({}, opts);
  varietyParams.collection = collection;
  return Object
    .keys(varietyParams)
    .map(function(key) {
     return jsVarDefinition(key, varietyParams[key]);
    })
    .join('');
};


module.exports = {
    'verifyLocalLibrary': verifyLocalLibrary,
    'download': download,
    'jsVarDefinition': jsVarDefinition,
    'buildParams': buildParams
};