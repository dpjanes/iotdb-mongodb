/**
 *  samples/db.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-29
 *
 *  Copyright (2013-2020) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const minimist = require('minimist');

const mongodb = require("..")
const mongodb$cfg = require("./mongodb$cfg.json");

const movies_schema = {
    name: "movies",
    keys: [ "title", "year" ],
    indexes: {
        "year-title-index": [ "year", "title" ],
        // "year--title-index": [ "year", "-title" ],
    },
}

const ad = minimist(process.argv.slice(2));
const action_name = ad._[0]

const actions = []
const action = name => {
    actions.push(name)

    return action_name === name
}

const _error = error => {
    const self = error.self

    if (error.errors) {
        console.log("#", error.errors)
    } else {
        console.log("#", error)
    }

    return self
}

if (action("initialize")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .make(sd => console.log("+", "ok"))
        .catch(_error)
        .then(mongodb.close)
} else if (action("load-movies")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        movies: require("./data/movies.json"),
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)

        .each({
            method: mongodb.db.put,
            inputs: "movies:json",
        })

        .make(sd => {
            console.log("+", `ok added ${sd.movies.length} movies`)
        })

        .catch(_error)
        .then(mongodb.close)
} else if (action("put")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        json: {
            year: 1999,
            title: "The Matrix",
            info: "choose the red or the blue pill",
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.put)
        .make(sd => console.log("+", "ok"))
        .catch(_error)
        .then(mongodb.close)
} else if (action("get")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        query: {
            year: 1999,
            title: "The Matrix",
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.get)
        .make(sd => console.log("+", "ok", sd.json))
        .catch(_error)
        .then(mongodb.close)
} else if (action("get-not-found")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        query: {
            year: 1999,
            title: "The Matrix Reloaded",
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.get)
        .make(sd => console.log("+", "ok", sd.json))
        .catch(_error)
        .then(mongodb.close)
} else if (action("query-simple")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        query: {
            year: 1999,
            title: "The Matrix",
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.query_simple)
        .make(sd => console.log("+", "ok", JSON.stringify(sd.jsons, null, 2)))
        .catch(_error)
        .then(mongodb.close)
} else if (action("scan-simple")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        query: {
            year: 1999,
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.scan_simple)
        .make(sd => console.log("+", "ok", JSON.stringify(sd.jsons, null, 2)))
        .catch(_error)
        .then(mongodb.close)
} else if (action("page-all")) {
    const _run = pager => {
        _.promise({
            mongodb$cfg: mongodb$cfg,
            table_schema: movies_schema,
            query_limit: 5,
            pager: pager,
        })
            .then(mongodb.initialize)
            .then(mongodb.db.initialize)
            .then(mongodb.db.ensure_schema)
            .then(mongodb.db.all)
            .make(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.title), null, 2))
                // console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.user_id), null, 2))
                console.log("+", "pager", sd.pager)
                // console.log("+", "pager", _.id.unpack(sd.pager))
                
                if (sd.cursor && sd.cursor.next) {
                    process.nextTick(() => {
                        _run(sd.cursor.next)
                    })
                } else {
                    process.exit(0);
                }
            })
            .catch(_error)
    }

    _run()
} else if (action("page-scan")) {// scan and query are aliases in this
    const _run = pager => {
        _.promise({
            mongodb$cfg: mongodb$cfg,
            table_schema: movies_schema,
            query_limit: 5,
            pager: pager,
            query: {
                "year": 2012,
            }
        })
            .then(mongodb.initialize)
            .then(mongodb.db.initialize)
            .then(mongodb.db.ensure_schema)
            .then(mongodb.db.scan_simple)
            .make(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => `${l.year}: ${l.title}`), null, 2))
                console.log("+", "pager", sd.pager)
                // console.log("+", "pager", _.id.unpack(sd.pager))
                
                if (sd.cursor && sd.cursor.next) {
                    process.nextTick(() => {
                        _run(sd.cursor.next)
                    })
                } else {
                    process.exit(0);
                }
            })
            .catch(_error)
    }

    _run()
} else if (action("query-index")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        index_name: "year-title-index",
        query: {
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.query_simple)
        .make(sd => console.log("+", "ok", JSON.stringify(sd.jsons.map(l => `${l.year}: ${l.title}`), null, 2)))
        .then(mongodb.close)
} else if (action("query-range")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        index_name: "year-title-index",
        query: {
            //year: [ ">=", 2013 ],
            year: [ "between", 2012, 2013 ],
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.query_simple)
        .make(sd => console.log("+", "ok", JSON.stringify(sd.jsons.map(l => `${l.year}: ${l.title}`), null, 2)))
        .catch(_error)
        .then(mongodb.close)
} else if (action("replace-fail")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        query: {
            year: 1999,
            title: _.timestamp.make(),
        },
        json: {
            year: 1999,
            title: "The Matrix 3D",
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.replace)
        .make(sd => console.log("+", "ok"))
        .catch(_error)
        .then(mongodb.close)
} else if (action("replace-ok")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        query: {
            year: 1999,
            title: "The Matrix 2D",
        },
        json: {
            year: 2017,
            title: "The Matrix 3D",
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.put)
        .then(mongodb.db.replace)
        .make(sd => console.log("+", "ok"))
        .catch(_error)
        .then(mongodb.close)
} else if (action("delete")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        json: {
            year: 2014,
            title: "The Matrix Unhung",
        },
        query: {
            year: 2014,
            title: "The Matrix Unhung",
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.put)
        .then(mongodb.db.delete)
        .then(mongodb.db.delete)
        .then(mongodb.db.query_simple)
        .make(sd => console.log("+", "ok", JSON.stringify(sd.jsons, null, 2)))
        .catch(_error)
        .then(mongodb.close)
} else if (action("pop")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        table_schema: movies_schema,
        json: {
            year: 2014,
            title: "The Matrix Unhung",
        },
        query: {
            year: 2014,
            title: "The Matrix Unhung",
        },
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.db.ensure_schema)
        .then(mongodb.db.put)
        .then(mongodb.db.pop)
        .make(sd => console.log("+", "ok", sd.json))
        .catch(_error)
        .then(mongodb.close)
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}

