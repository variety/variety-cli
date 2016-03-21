var cli = require("../lib/cli");
var stream = require('stream');
var Q = require("q");

var getWritableStream = function() {
  var Writable = require('stream').Writable;
  var ws = Writable();
  ws.value = '';
  ws._write = function (chunk, enc, next) {
      this.content += chunk;
      next();
  };
  return ws;
};

var mockSpawn = function(bin, args) {
  return Q.resolve({'bin':bin, 'args':args});
};

describe(__filename, function () {
  beforeEach(function(){
    this.addMatchers({
      toEndWith: function(suffix) {
        this.message = function() {return 'Expected "'+this.actual+'" to end with "'+suffix+'".';};
        return this.actual.indexOf(suffix, this.actual - suffix.length) !== -1;
      }
    });
  });

  it('CLI should correctly respond to the --help argument', function (done) {
    var ws = getWritableStream();
    cli({
        stdout: ws,
        stderr: ws,
        exitFn: function(){},
        argv:   ['node', 'variety-cli.js', '--help'],
        process: null
    })
    .fin(function(){
      expect(ws.content).toContain('Usage: variety db_name/collection_name [options]');
      done();
    })
    .done();
  });

  it('CLI should correctly execute Variety', function (done) {

    var child = require('child-process-promise');
    var utils = require('../lib/utils');

    spyOn(child, 'spawn').andCallFake(mockSpawn);

    var ws = getWritableStream();
    cli({
        stdout: ws,
        stderr: ws,
        exitFn: function(){},
        argv:   ['node', 'variety-cli.js', 'foo/bar', '--limit=5', '--host', 'localhost'],
        process: null
    })
    .then(function(res) {
      expect(res.bin).toEqual('mongo');
      expect(res.args[0]).toEqual('foo'); //db name
      expect(res.args[1]).toEqual('--eval=var collection="bar";var limit=5;'); //variety args
      expect(res.args[2]).toEndWith('variety.js'); //library path
      expect(res.args[3]).toEqual('--host'); //library path
      expect(res.args[4]).toEqual('localhost'); //library path
      done();
    })
    .done();
  });
});
