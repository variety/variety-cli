var utils = require("../lib/utils");
var tmp = require('tmp');
var fs = require('fs');
var nock = require('nock');

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
    utils.fileExists(__filename)
    .fail(function(ex) {
      // this file should always exist, so fail intentionally in fail handler
      expect(true).toBe(false);

    })
    .fin(function () {
      done();
    });
  });

  it('should correctly fail when doesn\'t exist local library', function (done) {
    utils.fileExists(__filename + "_nonsense")
    .then(function() {
      // this file should never exist, so fail intentionally in then handler
      expect(true).toBe(false);
    })
    .fin(function () {
      done();
    });
  });


  it('should download and save some file from given url', function (done) {

    var varietyUrl = 'https://raw.githubusercontent.com/variety/variety/master/variety.js';

    nock('https://raw.githubusercontent.com')
      .get('/variety/variety/master/variety.js')
      .reply(200, 'dummy variety lib content');

    var target = tmp.fileSync();
    utils.download(varietyUrl, target.name)
      .then(function(path) {
        var buf = fs.readFileSync(path, {encoding: 'utf8'});
        target.removeCallback();
        expect(buf).toEqual('dummy variety lib content');
        done();
      })
      .done();
  });
});