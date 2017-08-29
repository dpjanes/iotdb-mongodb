#!/usr/bin/env node
/**
 *  mongodb-import.js
 *
 *  David Janes
 *  IOTDB
 *  2017-08-06
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");
const fs = require("iotdb-fs");

const path = require("path");
const os = require("os");

const Q = require("bluebird-q");
const minimist = require('minimist');

const mongo = require("../index");

const ad = minimist(process.argv.slice(2), {
    binary: [],
});

if (ad._.length < 1) {
    console.log("usage: mongodb-import <export-file>")
    process.exit(1)
}

/*
 *  Load settings
 */
let mongodbd = {};
[ path.join(os.homedir(), ".iotdb-mongodb.json"), ".iotdb-mongodb.json", ]
    .forEach(p => {
        try {
            Object.assign(mongodbd, require(p))
        } catch (x) {
        }
    })

if (ad.url) {
    mongodbd.url = ad.url
}

Q({
    mongodbd: mongodbd,
})
    .then(mongo.initialize)

    .then(sd => _.d.add(sd, "path", ad._[0]))
    .then(fs.read.json)
    .then(sd => _.d.update(sd, {
        db: sd.json,
        table_name: sd.json.table_name,
    }))

    // create an empty version of the table
    .then(mongo.collection)
    .then(mongo.drop)
    .then(mongo.collection)

    // create the indexes
    .then(sd => _.d.add(sd, "inputs", 
        _.values(sd.db.schema.indexes)
            .concat([ sd.db.schema.keys ])
            .map(keys => _.object(keys, keys.map(key => key === "created" ? -1 : 1))))
    )
    .then(sd => _.promise.each(sd, "indexes", mongo.ensure_index))
    
    // populate
    .then(sd => _.d.update(sd, {
        json: sd.db.items,
    }))
    .then(_.promise.conditional(sd => sd.json && sd.json.length, mongo.insert))

    .then(sd => {
        console.log("+", "ok", sd.db.table_name)
    })
    .catch(error => {
        console.log("ERROR", error)
        console.log("#", _.error.message(error))
    })
    .done(() => process.exit())
