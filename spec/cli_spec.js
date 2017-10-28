var cli = require('../lib/cli');

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
  var promise = Promise.resolve({'bin':bin, 'args':args});

  promise.childProcess = {
    stdout:{on:function(){}},
    stderr:{on:function(){}}
  };

  return promise;
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
      .then(function(){
        expect(ws.content).toContain('Usage: variety db_name/collection_name [options]');
        done();
      });
  });

  it('CLI should correctly execute Variety', function (done) {

    var child = require('child-process-promise');

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
      .catch(done);
  });

  it('CLI should forward auth arguments directly to mongo shell', function (done) {

    var child = require('child-process-promise');

    spyOn(child, 'spawn').andCallFake(mockSpawn);

    var ws = getWritableStream();
    cli({
      stdout: ws,
      stderr: ws,
      exitFn: function(){},
      argv:   ['node', 'variety-cli.js', 'foo/bar', '--username', 'lorem', '--password', 'ipsum', '--authenticationDatabase', 'my-auth-db'],
      process: null
    })
      .then(function(res) {
        expect(res.bin).toEqual('mongo');
        expect(res.args[0]).toEqual('foo'); //db name
        expect(res.args[1]).toEqual('--eval=var collection="bar";'); //variety args
        expect(res.args[2]).toEndWith('variety.js'); //library path
        expect(res.args[3]).toEqual('--username');
        expect(res.args[4]).toEqual('lorem');
        expect(res.args[5]).toEqual('--password');
        expect(res.args[6]).toEqual('ipsum');
        expect(res.args[7]).toEqual('--authenticationDatabase');
        expect(res.args[8]).toEqual('my-auth-db');
        done();
      })
      .catch(done);
  });

  it('CLI should handle short versions of mongo arguments (for example -u, -p)', function (done) {

    var child = require('child-process-promise');

    spyOn(child, 'spawn').andCallFake(mockSpawn);

    var ws = getWritableStream();
    cli({
      stdout: ws,
      stderr: ws,
      exitFn: function(){},
      argv:   ['node', 'variety-cli.js', 'foo/bar', '-u', 'lorem', '-p', 'ipsum', '--authenticationDatabase', 'my-auth-db'],
      process: null
    })
      .then(function(res) {
        expect(res.bin).toEqual('mongo');
        expect(res.args[0]).toEqual('foo'); //db name
        expect(res.args[1]).toEqual('--eval=var collection="bar";'); //variety args
        expect(res.args[2]).toEndWith('variety.js'); //library path
        expect(res.args[3]).toEqual('-u');
        expect(res.args[4]).toEqual('lorem');
        expect(res.args[5]).toEqual('-p');
        expect(res.args[6]).toEqual('ipsum');
        expect(res.args[7]).toEqual('--authenticationDatabase');
        expect(res.args[8]).toEqual('my-auth-db');
        done();
      })
      .catch(done);
  });

  it('CLI should handle incorrect args and print error + help', function (done) {

    var child = require('child-process-promise');
    spyOn(child, 'spawn').andCallFake(mockSpawn);

    var ws = getWritableStream();
    cli({
      stdout: ws,
      stderr: ws,
      exitFn: function(){},
      argv:   ['node', 'variety-cli.js', 'foo/bar', '--sort', '{foo:bar)'], // incorrect brackets pair
      process: null
    })
      .then(function() {
        done(new Error('Should throw exception and continue in catch branch'));
      })
      .catch(function(err) {
        expect(err.message).toContain('Failed to parse option');
        done();
      });
  });

});
