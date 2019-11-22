#!/usr/bin/env node
/**
 *  mongodb-test.js
 *
 *  David Janes
 *  IOTDB
 *  2018-05-28
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");
const fs = require("iotdb-fs");

const path = require("path");
const os = require("os");

const minimist = require('minimist');

const mongo = require("../index");

const ad = minimist(process.argv.slice(2), {
    binary: [],
});

if (ad._.length < 1) {
    console.log("usage: mongodb-test <url>")
    process.exit(1)
}

/*
 *  Load settings
 */
_.promise.make({
    mongodb$cfg: {
        url: ad._[0]
    }
})
    .then(mongo.initialize)
    .then(sd => {
        console.log("+", "ok")
    })
    .catch(error => {
        console.log("ERROR", error)
        console.log("#", _.error.message(error))
    })
    .done(() => process.exit())
