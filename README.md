# variety-cli

Command line interface for the [Variety Schema Analyser](https://github.com/variety/variety).

[![Build Status](https://travis-ci.org/variety/variety-cli.svg)](https://travis-ci.org/variety/variety-cli)
[![Coverage Status](https://coveralls.io/repos/variety/variety-cli/badge.svg)](https://coveralls.io/r/variety/variety-cli)
[![Build status](https://ci.appveyor.com/api/projects/status/3r6x00kf9sxpjeui?svg=true)](https://ci.appveyor.com/project/todvora/variety-cli)
[![Dependencies Status](https://david-dm.org/variety/variety-cli/status.svg)](https://david-dm.org/variety/variety-cli/)
[![DevDependencies Status](https://david-dm.org/variety/variety-cli/dev-status.svg)](https://david-dm.org/variety/variety-cli/#info=devDependencies)
## Install

You can install the *Variety-cli* globally in your system by calling:
```
npm install variety-cli -g
```
This will download the latest version from the [NPM repository](https://www.npmjs.com/package/variety-cli).
Variety-cli itself does not include the variety.js library. The library will be downloaded on the first usage
of *variety-cli* directly from the [github repository of Variety](https://raw.githubusercontent.com/variety/variety/master/variety.js).

If you want to upgrade *variety-cli* to newest version, type the same command as for the installation: ```npm install variety-cli -g```.

## Proxy setting

If you are behind some proxy, you should configure proxy setting in your environment (to allow variety-cli download of the variety lib).

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

Basic usage without any options. Database and collection names are separated by the ```/``` character:
```
variety database_name/collection_name [options]
```

Define your own query used to filter analysed documents:

```
variety test/users --query='{"bio":{"$exists":true}}'
```

The *variety-cli* uses [HJSON](http://hjson.org/) to parse ```--query``` and ```--sort``` parameters and should be fault tolerant.

Nevertheless you should quote the JSON values properly. The quotes usage is little bit different for every operation system.
Good description of JSON quoting can be found in the [Amazon AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-using-param.html#quoting-strings).

## JSON output
If you want to post-process the Variety results in another tool, maybe you find useful the
JSON output. This command should produce valid JSON output:

```
variety test/users --outputFormat='json' --quiet
```



## Help
Print all available commands and options:

```
variety --help
```

## Mongo shell params

The Variety-cli supports all the available parameters from the Mongo Shell.
You can specify your *--host*, *--port*, *--username*, *--password*, *--quiet* and many other parameters. For all the
available params of the mongo shell, see the [Mongo  documentation](http://docs.mongodb.org/manual/reference/program/mongo/).

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
Using limit of 5
Using maxDepth of 99
Using sort of { "_id" : -1 }
Using outputFormat of ascii
Using persistResults of false
Using collection of users
+------------------------------------------------------------+
| key                | types        | occurrences | percents |
| ------------------ | ------------ | ----------- | -------- |
| _id                | ObjectId     |           5 |    100.0 |
| name               | String       |           5 |    100.0 |
| bio                | String       |           3 |     60.0 |
| birthday           | Date         |           2 |     40.0 |
| pets               | Array,String |           2 |     40.0 |
| someBinData        | BinData-old  |           1 |     20.0 |
| someWeirdLegacyKey | String       |           1 |     20.0 |
+------------------------------------------------------------+
```

## License

[The MIT License (MIT)](https://raw.github.com/variety/variety-cli/master/LICENSE.md)
