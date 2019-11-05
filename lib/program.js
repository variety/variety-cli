'use strict';

var minimist = require('minimist');
var HJSON = require('hjson');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var opt = function(name, desc, parser) { return {'name':name, 'desc':desc, 'parser':parser};};

var parseHson = function(input) {
  try {
    return HJSON.parse(input);
  } catch (e) {
    throw new Error('Failed to parse option \''+this.name+'\': ' + e.message);
  }
};

var options = [
  opt('query',          'standard Mongo query object (json), to filter the set of documents required before analysis', parseHson),
  opt('sort',           'analyze documents in the specified order, takes Mongo sort object (json)', parseHson),
  opt('maxDepth',       'limit the <n> depth Variety will recursively search to find new objects', parseInt),
  opt('limit',          'analyze only the <n> newest documents in a collection', parseInt),
  opt('outputFormat',   'output format of results, possible variants are "ascii" or "json", default is "ascii"', String),
  opt('persistResults', 'save results in MongoDB for future use, default is "false".', function(val) {return val == 'true';}),
  opt('slaveOk',        'allow queries on slave instances, default is "false".', function(val) {return val == 'true';}),
  opt('plugins',        'comma separated list of paths to the variety plugins (see examples below).', String),
  opt('help',           'returns information on the options and use of variety CLI', _.identity)
];

var parsedOpts = function(options, args) {
  return Object
    .keys(args)
    .map(function(key) {
      var def = _.find(options, function(opt){return opt.name === key;});
      return {'name':key, 'value':args[key], 'def': def};
    });
};

var parseVarietyArgs = function(options, args) {
  return parsedOpts(options, args)
    .filter(function(opt){return opt.def;})
    .map(function(opt){opt.value = opt.def.parser(opt.value); return opt;})
    .reduce(function(acc, val){
      acc[val.name] = val.value;
      return acc;
    }, {});
};

var parseMongoArgs = function(options, args) {
  var unknownOpts = parsedOpts(options, args).filter(function(opt){return !opt.def && opt.name != '_';});
  var accumulate = function(acc, opt) {
    if(opt.name.length > 1) {
      acc.push('--' + opt.name);
    } else {
      acc.push('-' + opt.name);
    }
    if(typeof opt.value !== 'boolean') {
      acc.push(opt.value);
    }
    return acc;
  };
  return _.reduce(unknownOpts, accumulate, []);
};

var parseDbCollection = function(args) {
  var db = null;
  var collection = null;
  if(args._.length > 0) {
    var split = args._[0].split('/');
    
    db = split.slice(0, split.length - 1).join('/');
    collection = split[split.length - 1];
  }
  return {'db':db, 'collection':collection};
};

var parse = function(argv) {
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
  var maxOptionLength = _.max(options.map(function(opt){return opt.name.length;}));
  var optsDesc = options
    .map(function(option) {return '  --' + _.padEnd(option.name, maxOptionLength) + '  ' + option.desc;})
    .join('\n');

  var buf = fs.readFileSync(path.join(__dirname, 'MANPAGE.txt'), 'utf8');
  return buf.replace('{OPTIONS}', optsDesc);
};

module.exports = {
  'parse': parse,
  'help':help
};
