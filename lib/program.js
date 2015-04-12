/*jslint node: true */
"use strict";

var commander = require('commander');
var HJSON = require('hjson');

commander._name = 'variety'; // hack, how to do it correctly?
commander
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

commander.usage = function() {
  return "[options] db_name/collection_name";
};

var args = function() {
    return commander.args;
};

module.exports = {
    'init': commander.parse.bind(commander),
    'help':commander.help.bind(commander),
    'args': args,
    'opts' : commander.opts.bind(commander)
};
