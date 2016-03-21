var program = require('../lib/program');

describe(__filename, function () {
  it('should return formated help', function (done) {
    var help = program.help();
    expect(help).toContain('Options');
    expect(help).toContain('Examples');
    expect(help).toContain('--query');
    expect(help).toContain('standard Mongo query object (json), to filter the set of documents required before analysis');
    done();
  });

  it('should parse db and collection name', function (done) {
    var parsed = program.parse(['node', 'variety-cli.js', 'test/users']);
    expect(parsed.db).toEqual('test');
    expect(parsed.collection).toEqual('users');
    done();
  });

  it('should parse string and integer options', function (done) {
    var parsed = program.parse(['node', 'variety-cli.js', '--limit', '5', '--outputFormat=json', 'test/users']);
    expect(parsed.params.outputFormat).toEqual('json');
    expect(parsed.params.limit).toEqual(5);
    done();
  });

  it('should parse boolean options', function (done) {
    var parsed = program.parse(['node', 'variety-cli.js', '--persistResults', 'true', 'test/users']);
    expect(parsed.params.persistResults).toEqual(true);
    done();
  });

  it('should parse JSON options', function (done) {
    var parsed = program.parse(['node', 'variety-cli.js', '--query', '{"name":"Bob"}', '--sort={created:-1}', 'test/users']);
    expect(parsed.params.query).toEqual({'name':'Bob'});
    expect(parsed.params.sort).toEqual({'created':-1});
    done();
  });

  it('should parse additional mongo options', function (done) {
    var parsed = program.parse(['node', 'variety-cli.js', '--query', '{"name":"Bob"}', '--sort={created:-1}', 'test/users']);
    expect(parsed.params.query).toEqual({'name':'Bob'});
    expect(parsed.params.sort).toEqual({'created':-1});
    done();
  });

  it('should handle --help argument', function (done) {
    var parsed = program.parse(['node', 'variety-cli.js', '--help']);
    expect(parsed.params.help).toEqual(true);
    done();
  });

  it('should handle additional mongo shell arguments', function (done) {
    var parsed = program.parse(['node', 'variety-cli.js', 'test/users', '--quiet', '--host=localhost', '--port=28017']);
    // TODO: why doesn't work the simple toEqual?!
    expect(JSON.stringify(parsed.shellParams)).toEqual(JSON.stringify(['--quiet', '--host' , 'localhost', '--port', 28017]));
    done();
  });
});