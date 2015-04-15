# variety-cli

Command line interface for the [Variety Schema Analyser](https://github.com/variety/variety).

[![Build Status](https://travis-ci.org/todvora/variety-cli.svg)](https://travis-ci.org/todvora/variety-cli)
[![Coverage Status](https://coveralls.io/repos/todvora/variety-cli/badge.svg)](https://coveralls.io/r/todvora/variety-cli)
[![Dependencies Status](https://david-dm.org/todvora/variety-cli/status.svg)](https://david-dm.org/todvora/variety-cli/)
[![DevDependencies Status](https://david-dm.org/todvora/variety-cli/dev-status.svg)](https://david-dm.org/todvora/variety-cli/#info=devDependencies)
## Install or update

You can install the *Variety-cli* globally in your system by calling:
```
npm install variety-cli -g
```
This will download the latest version from the [NPM repository](https://www.npmjs.com/package/variety-cli). Variety-cli itself does not include the variety.js library.
The library will be downloaded on the first usage of *variety-cli* directly from the
[github repository of Variety](https://raw.githubusercontent.com/variety/variety/master/variety.js).

## Proxy setting

If you are behind some proxy, you should have configured proxy setting in your environment (because the variety-cli downloads the essential library from internet).

### NPM proxy

Run this command (and change the proxy url to your needs):
```
npm config set https-proxy http://10.203.0.1:5187/
```

### Node.js
 On the unix platforms this can be (temporary) achieved by calling:
 ```
export https_proxy=http://10.203.0.1:5187/

```
If you want to configure proxy for other node.js apps in the persistent way, add the command
to your ```.bashrc``` or ```.bashprofile```.

## Run variety

Basic usage without any options. Database and collection names are separated by ```/```:
```
variety database_name/collection_name [options]
```

Define your own query:

```
variety test/users --query='{"bio":{"$exists":true}}'
```

The *variety-cli* uses [HJSON](http://hjson.org/) to parse ```--query``` and ```--sort``` parameters and should be fault tolerant.

Anyway you should quote the JSON values properly. The quotes usage is different for every operation systems.
Good description of JSON quoting can be found in the [Amazon AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-using-param.html#quoting-strings).

## Help
Print all available commands and options:

```
variety --help
```

## Mongo shell params

The Variety-cli supports also all the available parameters from the Mongo Shell. You can specify your *host*, *port*, *username*, *password*, *quiet* and many other parameters.

```
node variety-cli.js test/users  --host localhost --port 27017 --quiet
```

## Example output
```
$ variety test/users  --host localhost --port 27017
MongoDB shell version: 3.0.0
connecting to: localhost:27017/test
Variety: A MongoDB Schema Analyzer
Version 1.4.1, released 14 Oct 2014
Using query of { }
Using limit of 10
Using maxDepth of 99
Using sort of { "_id" : -1 }
Using outputFormat of ascii
Using persistResults of false
Using collection of users
+------------------------------------------------------------+
| key                | types        | occurrences | percents |
| ------------------ | ------------ | ----------- | -------- |
| _id                | ObjectId     |          10 |    100.0 |
| name               | String       |          10 |    100.0 |
| bio                | String       |           6 |     60.0 |
| birthday           | Date         |           4 |     40.0 |
| pets               | Array,String |           4 |     40.0 |
| someBinData        | BinData-old  |           2 |     20.0 |
| someWeirdLegacyKey | String       |           2 |     20.0 |
+------------------------------------------------------------+
```

## License

[The MIT License (MIT)](https://raw.github.com/todvora/variety-cli/master/LICENSE.md)
