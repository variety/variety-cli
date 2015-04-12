#! /usr/bin/env node

/*jslint node: true */
"use strict";

var path = require('path');
var utils = require('./lib/utils.js');
var program = require('./lib/program.js');

var runAnalysis = function() {
  program.init(process.argv);

  try {
    var target = utils.dbCollectionParse(program.args());
    var execution = require('child_process').spawn(
      'mongo',
      [target.db, '--eval='+utils.buildParams(target.collection, program.opts()), 'variety.js'],
      {stdio:'inherit'}
    );
  } catch(ex) {
    program.help();
    process.exit(1);
  }
};

var varietyPath = path.join(__dirname, "variety.js");

utils.verifyLocalLibrary(varietyPath)
  .fail(function(err){
      console.log(err.message);
      return utils.download(
        "https://raw.githubusercontent.com/variety/variety/master/variety.js",
        varietyPath
      );
    })
  .then(runAnalysis)
  .done();
