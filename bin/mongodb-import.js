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

const assert = require("assert");
const path = require("path");
const os = require("os");

const AWS = require("aws-sdk");
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

    // create indexes
    
    // populate
    .then(sd => _.d.update(sd, {
        json: sd.db.items,
    }))
    .then(_.promise.conditional(sd => sd.json.length, mongo.insert))

    .then(sd => {
        console.log("+", "ok")
    })
    .catch(error => {
        console.log("ERROR", error)
        console.log("#", _.error.message(error))
    })
    .done(() => process.exit())

/*
const table_name = ad._[0]

Q({
    awsd: awsd,
    table_name: table_name,
    result: {
        table_name: table_name,
        schema: {},
        items: [],
    }
})
    .then(aws.initialize)
    .then(aws.dynamodb.initialize)
    .then(aws.dynamodb.describe_table)
    .then(sd => {
        sd.result.schema.keys = sd.table.KeySchema.map(kd => kd.AttributeName)
        sd.result.schema.indexes = {};

        (sd.table.GlobalSecondaryIndexes || []).forEach(xd => {
            sd.result.schema.indexes[xd.IndexName] = xd.KeySchema.map(kd => kd.AttributeName)
        })

        return sd;
    })
    .then(aws.dynamodb.all)
    .then(sd => {
        sd.result.items = sd.jsons;

        sd.path = `exported/${table_name}.json`;
        sd.json = sd.result;

        return sd;
    })
    .then(fs.mkdir.parent)
    .then(fs.write.json)
    .then(sd => {
        console.log("+", "#items", sd.result.items.length)
        console.log("+", "keys", sd.result.schema.keys)
        console.log("+", "indexes", _.keys(sd.result.schema.indexes).sort())
    })
    .catch(error => {
        console.log("ERROR", error)
        console.log("#", _.error.message(error))
    })
*/
