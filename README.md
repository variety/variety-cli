# variety-cli

Command line interface for the [Variety Schema Analyser](https://github.com/variety/variety).

[![Build Status](https://travis-ci.org/todvora/variety-cli.svg)](https://travis-ci.org/todvora/variety-cli)
[![Coverage Status](https://coveralls.io/repos/todvora/variety-cli/badge.svg)](https://coveralls.io/r/todvora/variety-cli)

## Install or update
```
npm install variety-cli -g
```

## Run
Basic usage without any options. Database and collection names separated by ```/```:
```
variety database_name/collection_name
```

Define your own query:

```
variety --query='{"name": "Bob"}' test/users
```

Print all available commands and options:

```
variety --help
```

