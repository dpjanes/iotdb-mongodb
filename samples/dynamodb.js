/**
 *  test_dynamodb.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-29
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const Q = require("bluebird-q");
const minimist = require('minimist');

const mongo = require("..")
const mongodbd = require("./mongodbd.json");
mongodbd.schema = {
    "movies": {
        keys: [ "title", "year" ],
    },
}

const ad = minimist(process.argv.slice(2));

const action = (name) => ad._.indexOf(name) > -1;

if (action("initialize")) {
    Q({
        mongodbd: mongodbd,
    })
        .then(mongo.initialize)
        .then(mongo.dynamodb.initialize)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

/*
if (action("create-table")) {
    Q({
        mongodbd: mongodbd,
        table_name: "movies",
        partition_key: "#year",
        sort_key: "title",
        write_capacity_units: 10,
    })
        .then(mongo.initialize)
        .then(mongo.dynamodb.initialize)
        .then(mongo.dynamodb.create_table)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("create-table-wait")) {
    Q({
        mongodbd: mongodbd,
        table_name: "movies",
        partition_key: "#year",
        sort_key: "title",
        write_capacity_units: 10,
    })
        .then(mongo.initialize)
        .then(mongo.dynamodb.initialize)
        .then(mongo.dynamodb.create_table)
        .then(mongo.dynamodb.wait_table_exists)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("delete-table")) {
    Q({
        mongodbd: mongodbd,
        table_name: "movies",
    })
        .then(mongo.initialize)
        .then(mongo.dynamodb.initialize)
        .then(mongo.dynamodb.delete_table)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}
*/

if (action("put")) {
    Q({
        mongodbd: mongodbd,
        table_name: "movies",
        json: {
            year: 1999,
            title: "The Matrix",
            info: "choose the red or the blue pill",
        },
    })
        .then(mongo.initialize)
        .then(mongo.dynamodb.initialize)
        .then(mongo.dynamodb.put)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}


/*
if (action("get")) {
    Q({
        mongodbd: mongodbd,
        table_name: "movies",
        query: {
            year: 1999,
            title: "The Matrix",
        },
    })
        .then(mongo.initialize)
        .then(mongo.dynamodb.initialize)
        .then(mongo.dynamodb.get)
        .then(sd => console.log("+", "ok", sd.json))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("query-simple")) {
    Q({
        mongodbd: mongodbd,
        table_name: "movies",
        query: {
            year: 1999,
            title: "The Matrix",
        },
    })
        .then(mongo.initialize)
        .then(mongo.dynamodb.initialize)
        .then(mongo.dynamodb.query_simple)
        .then(sd => console.log("+", "ok", sd.jsons))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("scan-simple")) {
    Q({
        mongodbd: mongodbd,
        table_name: "movies",
        query: {
            title: "The Matrix",
        },
        keys: [ "title", "#year" ],
    })
        .then(mongo.initialize)
        .then(mongo.dynamodb.initialize)
        .then(mongo.dynamodb.scan_simple)
        .then(sd => console.log("+", "ok", sd.jsons))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("page-all")) {
    const _run = pager => {
        Q({
            mongodbd: mongodbd,
            table_name: "ledger",
            query_limit: 5,
            pager: pager,
        })
            .then(mongo.initialize)
            .then(mongo.dynamodb.initialize)
            .then(mongo.dynamodb.all)
            .then(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.ledger_id), null, 2))
                // console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.user_id), null, 2))
                console.log("+", "pager", sd.pager)
                // console.log("+", "pager", _.id.unpack(sd.pager))
                
                if (sd.pager) {
                    process.nextTick(() => {
                        _run(sd.pager)
                    })
                }
            })
            .catch(error => console.log("#", _.error.message(error)))
    }

    _run()
}

if (action("page-scan")) {
    const _run = pager => {
        Q({
            mongodbd: mongodbd,
            table_name: "ledger",
            query_limit: 5,
            pager: pager,
            query: {
                "user_id": "urn:consensas:user:Q-SVYoHm7E",
            }
        })
            .then(mongo.initialize)
            .then(mongo.dynamodb.initialize)
            .then(mongo.dynamodb.scan_simple)
            .then(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.ledger_id), null, 2))
                console.log("+", "pager", sd.pager)
                // console.log("+", "pager", _.id.unpack(sd.pager))
                
                if (sd.pager) {
                    process.nextTick(() => {
                        _run(sd.pager)
                    })
                }
            })
            .catch(error => console.log("#", _.error.message(error)))
    }

    _run()
}


if (action("page-query")) {
    const _run = pager => {
        Q({
            mongodbd: mongodbd,
            table_name: "snapshot",
            index_name: "user_id-created-index",
            query_limit: 5,
            pager: pager,
            query: {
                "user_id": "urn:consensas:user:Q-SVYoHm7E",
            }
        })
            .then(mongo.initialize)
            .then(mongo.dynamodb.initialize)
            .then(mongo.dynamodb.query_simple)
            .then(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.ledger_id), null, 2))
                console.log("+", "pager", sd.pager)
                // console.log("+", "pager", _.id.unpack(sd.pager))
                
                if (sd.pager) {
                    process.nextTick(() => {
                        _run(sd.pager)
                    })
                }
            })
            .catch(error => console.log("#", _.error.message(error)))
    }

    _run()
}

*/
