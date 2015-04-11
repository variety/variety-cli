# variety-cli

Command line interface for the [Variety Schema Analyser](https://github.com/variety/variety).

## Install
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
variety --query='{"name": "Bob"}' test/users'
```

Print all available commands and options:

```
variety --help
```

