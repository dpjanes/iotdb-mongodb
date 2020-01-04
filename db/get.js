/*
 *  db/get.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-06
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

const util = require("../lib/util")

/**
 */
const get = _.promise((self, done) => {
    const mongodb = require("..")

    _.promise(self)
        .validate(get)

        .then(mongodb.collection.p(self.table_schema.name))
        .make(sd => {
            sd.mongodb$collection.findOne(self.query, (error, result) => {
                if (error) {
                    return done(util.intercept(self)(error))
                }

                self.json = util.scrub_ids(result) || null

                if (sd.table_schema.partials) {
                    self.json.$_original = _.d.clone.deep(self.json)
                }

                done(null, self)
            })
        })
        .catch(done)
})

get.method = "db.get"
get.requires = {
    mongodb: _.is.Object,
    table_schema: {
        name: _.is.String,
        keys: _.is.Array,
    },
}
get.accepts = {
    query: _.is.JSON,
    table_schema: {
        partials: _.is.Boolean
    },
}
get.produces = {
    json: _.is.JSON,
}

/**
 */
const get_document = _.promise((self, done) => {
})

/**
 *  API
 */
exports.get = get
exports.get.document = get_document
