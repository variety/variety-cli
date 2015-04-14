#! /usr/bin/env node
/*jslint node: true */
"use strict";

var cli = require("./lib/cli");
cli({
    stdin:  process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    exitFn: process.exit,
    argv:   process.argv,
    process: process
}).done(); // end the promise
