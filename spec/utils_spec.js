var cli = require("../lib/utils.js");

describe(__filename, function () {

  it('should format JavaScript vars', function (done) {
    expect(cli.jsVarDefinition('foo', 'bar')).toEqual('var foo="bar";');
    expect(cli.jsVarDefinition('foo', 12)).toEqual('var foo=12;');
    expect(cli.jsVarDefinition('foo', {"foo":"bar"})).toEqual('var foo={"foo":"bar"};');
    done();
  });

  it('should correctly verify existing local library', function (done) {
    cli.verifyLocalLibrary(__filename)
    .fail(function(ex) {
      // this file should always exist, so fail intentionally in fail handler
      expect(true).toBe(false);

    })
    .fin(function () {
      done();
    });
  });

 it('should correctly fail when doesn\'t exist local library', function (done) {
    cli.verifyLocalLibrary(__filename + "_nonsense")
    .then(function() {
      // this file should never exist, so fail intentionally in then handler
      expect(true).toBe(false);
    })
    .fin(function () {
      done();
    });
  });


});