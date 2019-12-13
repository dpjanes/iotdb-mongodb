/*
 *  lib/watch.js
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

const _ = require("iotdb-helpers")

const util = require("./util")

/**
 */
const watch_collection = method => _.promise((self, done) => {
    const pipeline = []
    const stream = self.mongodb$collection.watch(pipeline)

    stream.on("change", event => {
        _.promise(self)
            .add("event", event)
            .then(method)
            .catch(_.promise.log)
    })
})

watch_collection.method = "watch.collection"
watch_collection.requires = {
    mongodb$collection: _.is.Object,
}
watch_collection.accepts = {
    mongodb$options: _.is.Dictionary,
}
watch_collection.produces = {
}

/**
 */
const watch_db = method => _.promise((self, done) => {
    const pipeline = []
    const stream = self.mongodb.watch(pipeline)

    stream.on("change", event => {
        _.promise(self)
            .add("event", event)
            .then(method)
            .catch(_.promise.log)
    })
})

watch_db.method = "watch.db"
watch_db.requires = {
    mongodb: _.is.Object,
}
watch_db.accepts = {
    mongodb$options: _.is.Dictionary,
}
watch_db.produces = {
}

/**
 *  API
 */
exports.watch = {
    collection: watch_collection,
    db: watch_db,
}
