/*
 *  samples/watch.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-05
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const mongodb = require("..")
const _ = require("iotdb-helpers")

/**
 */
const on_collection = _.promise((self, done) => {
    _.promise(self)
        .validate(on_collection)
        .make(sd => {
            console.log("+", on_collection.method, "changed", sd.event)
        })
        .end(done, self, on_collection)
})

on_collection.method = "on_collection"
on_collection.description = `Callback for collection updates`
on_collection.requires = {
    event: _.is.Object,
}
on_collection.accepts = {
}
on_collection.produces = {
}

/**
 */
const updater = _.promise((self, done) => {
    setInterval(() => {
        const timestamp =_.timestamp.make()

        _.promise(self)
            .validate(updater)

            .add({
                query: {
                    "a": "b",
                },
                json: {
                    "a": "b",
                    "timestamp": timestamp,
                },
            })
            .then(mongodb.db.replace)
            // .then(mongodb.update.upsert)
            .make(sd => {
                console.log("+", updater.method, timestamp, "mongodb$result", sd.mongodb$result)
            })

            .catch(_.error.log)
    }, 2500)
})

updater.method = "updater"
updater.description = ``
updater.requires = {
}
updater.accepts = {
}
updater.produces = {
}

/**
 *  Demonstrate watching collection updates
 */
_.promise({
    mongodb$cfg: require("./mongodb$cfg.json"),
    mongodb$collection_name: "test1",
    mongodb$on_collection: on_collection,
    table_schema: {
        name: "test1",
        keys: [ "a" ],
        partials: true,
    },
    mongodb$pipeline: [
        {
            "$match": {
                "$or": [
                    {
                        "updateDescription.updatedFields.timestamp": { "$exists": true },
                    },
                    {
                        "operationType": "replace",
                    },
                ],
            },
        },
    ],
    /*
    */
})
    .then(mongodb.initialize)
    .then(mongodb.collection)

    /*
    .then(mongodb.pipline.initialize)
    .then(mongodb.pipline.query.p({
        "timestamp": [ "!=", null ],
    })
    */
    .then(mongodb.watch.collection)
    .then(updater)

    .then(mongodb.close)
    .catch(_.error.log)
