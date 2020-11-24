/*
 *  db/count.js
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
const errors = require("iotdb-errors")

/**
 */
const count = _.promise((self, done) => {
    const mongodb = require("..")

    _.promise(self)
        .validate(count)

        .then(mongodb.collection.p(self.table_schema.name))
        .make(sd => {
            const query = mongodb.util.build_query(self.query)

            if (!_.is.Empty(self.query_search)) {
                query["$text"] = {
                    "$search": self.query_search,
                }
            }

            if (self.mongodb$query) {
                Object.assign(query, self.mongodb$query)
            }

            sd.mongodb$collection.count(query, (error, count) => {
                if (error) {
                    return done(mongodb.util.intercept(self)(error))
                }

                self.count = count

                done(null, self)
            })
        })
        .catch(done)
})

count.method = "db.count"
count.requires = {
    mongodb: _.is.Object,
    table_schema: {
        name: _.is.String,
        keys: _.is.Array,
    },
}
count.accepts = {
    query: _.is.JSON,
    query_search: _.is.String,
    mongodb$query: _.is.Dictionary,
}
count.produces = {
    count: _.is.Integer,
}

/**
 *  API
 */
exports.count = count
