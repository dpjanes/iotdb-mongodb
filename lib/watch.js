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
const watch_collection = _.promise(self => {
    _.promise.validate(self, watch_collection)

    self.mongodb$collection
        .watch(self.mongodb$pipeline || []) 
        .on("change", event => {
            _.promise(self)
                .add("event", event)
                .then(self.mongodb$on_collection)
                .catch(_.promise.log)
        })
})

watch_collection.method = "watch.collection"
watch_collection.description = `Watch for collection changes

    cf. https://docs.mongodb.com/manual/reference/method/db.collection.watch/
`
watch_collection.requires = {
    mongodb$collection: _.is.Object,
    mongodb$on_collection: _.is.Function,
}
watch_collection.accepts = {
    mongodb$options: _.is.Dictionary,
    mongodb$pipline: _.is.Array,
}
watch_collection.produces = {
}
watch_collection.params = {
    mongodb$on_collection: _.p.normal,
}
watch_collection.p = _.p(watch_collection)

/**
 *  API
 */
exports.watch = {
    collection: watch_collection,
}
