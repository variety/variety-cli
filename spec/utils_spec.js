var utils = require('../lib/utils');

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
});
