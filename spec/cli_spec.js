var cli = require("../lib/cli");
var stream = require('stream');

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

describe(__filename, function () {
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
      expect(ws.content).toContain('Usage: variety [options] db_name/collection_name');
      done();
    });
  });
});