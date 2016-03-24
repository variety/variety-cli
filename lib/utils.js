'use strict';

var _ = require('lodash');
var util = require('util');

var evalConvertor = {
  'string': JSON.stringify,
  'object': JSON.stringify
};

var jsVarDefinition = function(value, name) {
  return util.format('var %s=%s;', name, (evalConvertor[typeof value] || _.identity)(value));
};

var buildParams = function(collection, opts) {
  return _.map(
      _.assign({}, {'collection':collection}, opts),
      jsVarDefinition
    ).join('');
};

module.exports = {
  'buildParams': buildParams
};
