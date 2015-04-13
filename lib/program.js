/*jslint node: true */
"use strict";

var minimist = require('minimist');
var HJSON = require('hjson');

var options = [
  {'name': 'query',
  'desc': 'standard Mongo query object (json), to filter the set of documents required before analysis',
  'parser': HJSON.parse
  },
  {'name': 'sort',
  'desc': 'analyze documents in the specified order, takes Mongo sort object (json)',
  'parser': HJSON.parse
  },
  {'name': 'maxDepth',
  'desc': 'limit the <n> depth Variety will recursively search to find new objects',
  'parser': parseInt
  },
  {'name': 'limit',
  'desc': 'analyze only the <n> newest documents in a collection',
  'parser': parseInt
  },
  {'name': 'outputFormat',
    'desc': 'output format of results, possible variants are "ascii" or "json", default is "ascii".',
    'parser': String
  },
  {'name': 'persistResults',
    'desc': 'save results in MongoDB for future use, default is "false".',
    'parser': function(val) {return val == 'true';}
  },
  {'name': 'help',
      'desc': 'Print help and usage instructions.',
  }
];

var parseVarietyArgs = function(options, args) {
  var knownKeys = options.map(function(opt){return opt.name;});
  var params = {};
  Object
    .keys(args)
    .filter(function(opt){return knownKeys.indexOf(opt) > -1;})
    .forEach(function(opt){
      var parser = options.filter(function(val){return val.name === opt;})[0].parser;
      var value = args[opt];
      if(typeof parser !== 'undefined') {
        value = parser.call(this, args[opt]);
      }
      params[opt] = value;
    });
  return params;
};

var parseMongoArgs = function(options, args) {
  var knownKeys = options.map(function(opt){return opt.name;});
  var params = [];
  Object
    .keys(args)
    .filter(function(opt){return opt != "_";})
    .filter(function(opt){return knownKeys.indexOf(opt) == -1;})
    .forEach(function(opt){
      var value = args[opt];
      params.push('--' + opt);
      if(typeof value !== 'boolean') {
        params.push(value);
      }
      params[opt] = value;
    });
  return params;
};

var parseDbCollection = function(args) {
  var db = null;
  var collection = null;
  if(args._.length > 0 && args._[0].split("/").length == 2) {
    db = args._[0].split("/")[0];
    collection = args._[0].split("/")[1];
  }
  return {'db':db, 'collection':collection};
};

var parse = function(argv) {
  var other = {};
  var args = minimist(argv.slice(2));

  var ids = parseDbCollection(args);

  return {
    'db':ids.db,
    'collection':ids.collection,
    'params':parseVarietyArgs(options, args),
    'shellParams': parseMongoArgs(options, args)
  };
};

var help = function() {
  var pad = function(string, width) { return width <= string.length ? string : pad(width, string + ' ');};
  var maxOptionLength = Math.max.apply(null, options.map(function(opt){return opt.name.length;}));

  var result = [''];
  result.push('Usage: variety [options] db_name/collection_name"');
  result.push('');
  result.push('Options:');
  result.push('');

  options.forEach(function(option) {
       result.push('  --' + pad(option.name, maxOptionLength) + '  ' + option.desc);
  });

  result.push('');
  result.push('Examples:');
  result.push('');
  result.push('  $ variety test/users --outputFormat=\'json\'');
  result.push('  $ variety logs/webserver --sort=\'{"created":-1}\'');
  result.push('');
  result.push('  For other usages see https://github.com/variety/variety');
  result.push('');

  return result.join('\n');
};

module.exports = {
    'parse': parse,
    'help':help,
};
