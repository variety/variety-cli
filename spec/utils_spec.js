var utils = require("../lib/utils");

describe(__filename, function () {

  it('should format Variety params', function (done) {
    var params = utils.buildParams('users',{
      'foo':'bar',
      'lorem':12,
      'ipsum':{'one':'two'}
    });
    expect(params).toContain('var collection="users";');
    expect(params).toContain('var foo="bar";');
    expect(params).toContain('var lorem=12;');
    expect(params).toContain('var ipsum={"one":"two"};');
    done();
  });

  it('should correctly verify existing local library', function (done) {
    utils.verifyLocalLibrary(__filename)
    .fail(function(ex) {
      // this file should always exist, so fail intentionally in fail handler
      expect(true).toBe(false);

    })
    .fin(function () {
      done();
    });
  });

 it('should correctly fail when doesn\'t exist local library', function (done) {
    utils.verifyLocalLibrary(__filename + "_nonsense")
    .then(function() {
      // this file should never exist, so fail intentionally in then handler
      expect(true).toBe(false);
    })
    .fin(function () {
      done();
    });
  });


});